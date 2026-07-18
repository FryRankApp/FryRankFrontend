# Fryrank - Metadata PUT Consolidation Phase 1

## What We Built

Phase 1 of FRY-137: replaced the frontend's blind seed-PUT of user metadata on login with a **GET-then-PUT** flow. Previously, every login where `userSettings` was null fired a PUT to `/userMetadata` with the user's Google `given_name`, relying entirely on the backend's conditional write to avoid clobbering a chosen username. Now the frontend GETs the user's metadata first and only PUTs when no record exists. This is step 1 of a 4-step plan that lets the backend later route PUT and UPSERT to the same DAL method (step 2), collapse the frontend rename flow onto PUT (step 3), and delete UPSERT entirely (step 4) — without ever needing a temporary backend change that would just get reverted.

## How It Works

1. `GoogleLogin` container's `componentDidUpdate` fires `initializeUserSettings(accountId, defaultUsername, idToken)` when `loggedIn && userSettings === null` (same guard as before, new action).
2. The `INITIALIZE_USER_SETTINGS_REQUEST` action is watched by `takeLeading`, which runs the first chain and ignores re-entrant dispatches — login produces 2–3 `componentDidUpdate`s before `userSettings` populates.
3. The new saga `callInitializeUserSettings` GETs `/userMetadata?accountId=X`:
   - **Record exists** (`data.username !== undefined`): dispatch `successfulPutUserSettingsRequest(data)` directly. GET and PUT both return the backend's `PublicUserMetadataOutput` shape, so the existing `PUT_USER_SETTINGS_SUCCESS` reducer case populates `userSettings`/`currentUserSettings` unchanged, and the container guard stops firing.
   - **Record absent**: `yield call(callPutUserSettings, {...})` — delegates to the existing PUT worker, which seeds the record with the Google name and dispatches its own success/failure.
   - **GET fails**: dispatch `failedPutUserSettingsRequest` and stop — never PUT on an ambiguous read.

**The 404 that isn't:** the plan said "PUT when GET returns 404," but the backend never 404s here. The DAL returns `PublicUserMetadataOutput(null)` for a missing DynamoDB item, the handler wraps it in a 200, and the default `Gson` serializer **omits null fields** — so a missing record arrives as `200` with body `{}`. Absence is therefore detected as `data.username === undefined`. (A `NotFoundException → 404` path exists in `APIGatewayResponseBuilder`, but only `ReviewDomain.deleteReview` throws it.)

## Key Design Decisions & Trade-offs

- **Detect absence via missing `username`, not a real 404 (option a).** Alternative (b) was a small backend PR making GET return 404 first. Chose (a) to keep Phase 1 frontend-only — one less deploy, and the check is equally reliable given the verified serializer behavior.
- **One chained saga, one dispatched action** — not container-driven GET-then-decide-then-PUT. The branch decision would otherwise live in `componentDidUpdate`, which re-fires on every prop change while `userSettings` is null — threading a two-step state machine through exactly the lifecycle that's hardest to reason about.
- **New `INITIALIZE_USER_SETTINGS_REQUEST` trigger, reused `PUT_USER_SETTINGS_{SUCCESS,FAILURE}` terminals.** The operation is "initialize my settings," not "PUT" — the name encodes the semantics. But both outcome branches produce exactly what the existing success case already does, so a parallel `INITIALIZE_SUCCESS` case would be copy-paste duplication. `PUT_USER_SETTINGS_REQUEST` keeps its honest meaning and stays alive for step 3.
- **`takeLeading` over the house-default `takeEvery`** — deliberate, commented deviation. `takeEvery` would send 2–3 redundant GETs per login; `takeLatest` is the worst fit (cancels the in-flight continuation for zero correctness gain since every dispatch carries the same payload). Ranked: `takeLeading` > `takeEvery` > `takeLatest`.
- **Reuse `callPutUserSettings` via `yield call`, but *not* `callGetUserSettings`.** The PUT worker destructures the same fields and dispatches the right terminals — genuine reuse. The existing GET worker is hard-wired to the *other-user* flow (`GET_OTHER_USER_SETTINGS_SUCCESS` → `otherUserSettings` slot) — the wrong reducer slot. One inline `axios.get` beats a half-fitting shared helper.
- **Retry storms were traced, not guessed at:** on failure, `error` is set → one re-render → one re-dispatch → same error string → `connect`'s shallow compare sees no change → loop halts at ~2 attempts. Same as the old behavior; an `initializeAttempted` flag was explicitly deferred.
- **Pre-existing bugs found during verification got tickets, not drive-by fixes** (FRY-151: saga error extraction never surfaces backend messages + unguarded catches that crash on network errors; FRY-152: dead `putUserSettings` mapping). Keeps the Phase 1 diff reviewable and gives the bugs tracking of their own. The *new* saga uses the correct extraction (`err.response?.data || err.message`) from day one.
- **Safety net confirmed before relying on it:** the backend PUT is already conditional (`WriteMode.CREATE_IF_ABSENT`, DynamoDB `attribute_not_exists(accountId)`), returning the existing username on conditional failure — so racing or stale-bundle PUTs during rollout converge instead of clobbering. Phase 1 ships safely independent of steps 2–4.

## Concepts to Remember

- **`takeLeading` / `takeEvery` / `takeLatest`** — redux-saga watcher strategies. `takeEvery` runs a worker for every action; `takeLatest` cancels the in-flight worker and restarts on each new action; `takeLeading` runs the first and *ignores* newcomers until it finishes. "Initialize once" semantics = `takeLeading`.
- **`yield call(worker, args)`** — invokes another saga inline, inheriting its dispatches. The reuse tool that avoids both duplicated axios code and pass-through wrapper functions.
- **Serializer null-omission** — Gson (and many serializers) drop null fields by default, so "field is null" and "field is absent" are indistinguishable on the wire (`{}`). Contract checks must look at what actually serializes, not the model class.
- **Conditional writes (`attribute_not_exists`)** — DynamoDB's server-side compare-and-set. Makes "create if absent" atomic so concurrent writers can't overwrite each other; the client-side GET-then-PUT is a *convergent* pattern only because this guard backs it.
- **Read-then-write vs. atomic conditional write** — moving the existence check client-side introduces a window where state changes between read and write. Acceptable here only because (a) traffic ~zero and (b) the server-side guard still catches the race.
- **Shallow-compare quiescence** — `connect()` only re-renders when mapped props change by reference/value. A failure loop that keeps producing the *same* error string self-terminates. Useful for reasoning about `componentDidUpdate` dispatch loops.
- **Add-before-depend, remove-after-undepend** — the cross-repo migration ordering rule behind the 4-step plan: each step keeps both old and new paths working until nothing depends on the old one.

## Files Changed

| File | What Changed |
|------|--------------|
| `src/redux/sagas/userSettings/index.js` | New `callInitializeUserSettings` worker (GET → conditional `call` to PUT worker); `takeLeading` watcher line; imports `call`/`takeLeading` |
| `src/redux/reducers/userSettings/index.jsx` | New `INITIALIZE_USER_SETTINGS_REQUEST` type, no-op reducer case, `startInitializeUserSettingsRequest` creator |
| `src/containers/Common/GoogleLogin/index.jsx` | `mapDispatchToProps` + `componentDidUpdate` swap from `putUserSettings` to `initializeUserSettings` |
| `src/redux/sagas/userSettings/index.test.js` | **New — first test file in the repo.** 3 tests on the seed-flow branching |

## Testing Approach

- **Unit tests (Jest via react-scripts — infra already existed, just unused):** `runSaga` from redux-saga with a factory-mocked axios module (the sagas yield axios promises directly, house style, so generator-stepping wasn't practical). Three cases, scoped strictly to the new branching: username present → success dispatched with GET data, no PUT; username absent → PUT fired with `accountId`/`defaultUsername` params, success dispatched; GET failure → failure dispatched with the raw error body, no PUT. All pass.
- **Build:** `npm run build` compiles with zero *new* ESLint warnings.
- **Not verified:** a real browser login — requires live Google OAuth. Flagged for manual verification before merge.
- **Known-but-unticketed edge cases:** Google accounts with no `given_name` send a null `defaultUsername` → backend `@NonNull` → 500 (pre-existing, now narrowed to the absent branch); a record existing with a null stored username round-trips as `{}` → treated as absent → conditional PUT converges harmlessly; Settings page renders its error banner inside `userSettings &&`, so init failures are invisible there.
