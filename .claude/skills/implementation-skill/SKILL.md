---
name: implementation-skill
description: Use this skill at the start of any FryRank frontend implementation session — before writing code, especially when adding a new feature, wiring something across redux/sagas/components, or refactoring shared logic. It captures the engineer's standing rules for how to build on the FryRankFrontend codebase. Also use when reviewing your own diff before reporting "done."
version: 1.0.0
---

# FryRank Frontend Implementation Skill

The engineer's playbook for building features on the FryRank frontend. Load it first so you don't re-learn the same lessons mid-PR.

This skill describes **principles and where to look**, not snapshots of the current code. Facts about specific files, action names, prop shapes, and endpoint contracts go stale — always re-read the source before acting on them.

## Step 0 — Load the rules into memory

Before writing code, confirm that `feedback_fryrank_implementation_guidelines.md` is in `MEMORY.md`. If it isn't, save it. The rules below should be ambient context for the whole session.

## Core Rules (from the engineer)

### 1. DRY — one implementation, reused everywhere
- Adding the same UI to multiple pages? Build one shared component and use it everywhere. Don't inline near-identical copies.
- Adding the same logic to multiple places (reducers, sagas, containers)? Apply the pattern symmetrically — don't let parallel paths drift.
- **Test before extracting:** if you've written it once and would write it again, *that's* when you extract. A few similar lines is better than a half-fitting shared helper that needs `if/else` for each caller.
- **Watch for duplication a signature mismatch is hiding.** A custom component's callback usually emits a bare value (`onChange(nextValue)`), while a form's handler takes a DOM event (`e.target.name` / `e.target.value`). That difference disguises the fact that an inline callback re-implements the same update-and-clear-error body the handler already has. Don't compare *signatures* — compare *what the bodies do*. When they match, bridge the shapes instead of copying the body, e.g. route the value-callback through the existing handler with a synthetic event: `onChange={(v) => handleInputChange({ target: { name: 'tags', value: v } })}`. This applies within a single file (generic handler vs. specialized inline callback), not just across files.

### 2. No pass-through methods or silent refactors
- A wrapper that just forwards args to another function with no added logic is an anti-pattern. If you find yourself writing one to "make room" for a new feature, stop.
- If supporting a new feature cleanly *requires* a refactor, **consult the engineer first.** Explain what needs to change, why the current shape doesn't work, and what the new shape would be. Do not silently refactor.

### 3. The frontend owns input validation
- The frontend enforces user-facing input rules at submission time. Centralize these in the validation helper(s) — find them by grepping for `validate*` or by following the form components.
- Trust that the backend will not re-validate frontend rules — this means the frontend cannot rely on the backend rejecting bad input. The validation here is load-bearing.
- Surface validation errors via the reducer's form-errors slot and clear them on input change so users see real-time feedback. Mirror how an existing form does this.

### 4. Tests are scoped to new logic only
- Write tests for *the new thing you added*, not for surrounding behaviour that's already covered.
- No existing test infra for an area? Note it in your end-of-session summary; don't invent a test framework on the side.
- Priority candidates are pure helpers, reducer cases, and saga param-shaping — not full-component rendering.

### 5. Name things so a reader doesn't have to guess
- React component props mirror standard shapes when possible: `value` + `onChange`, or domain-specific equivalents (e.g. `selectedThing` + `onThingChange`).
- When two related concepts coexist (e.g. multi-select on a form vs. single-select on a filter), let the names *encode the distinction* — plural for multi, singular for single.
- Redux state describes *what the state is*; component props describe *what the prop does at the call site*. They can differ on purpose.
- If a reviewer would ask "why two props?", be ready to explain — usually it's the controlled-component pattern (one to read, one to write). That isn't a DRY violation.

### 6. Respect what's already there
- Edit existing files when you can; only create new files when there's no natural home.
- **Don't remove existing comments** unless the engineer explicitly asks. If a comment looks redundant to you, ask first. (This came up directly during the categorization session.)
- Don't write new comments that just describe what the code does — names should carry that. Comments are for *why* and *non-obvious constraints*.
- Don't add error handling for things that can't happen, or backwards-compat shims for code that hasn't shipped. Trust internal contracts.

## Working Style Expectations

### Before you start writing code
1. **Read the spec doc / Figma board in full.**
2. **Confirm standing guidelines are loaded** (this skill, memory entries).
3. **Skim existing patterns.** Look at how the codebase already does something similar. The "Where to look" table below tells you where to find each kind of thing.
4. **If the feature consumes a backend contract, re-read the backend.** Don't trust prior memory or this skill for endpoint shapes — open `FryRankLambda` and look at the current handler, model class, and `QueryParam`-style enum. Endpoints evolve.
5. **Build a task list** (`TaskCreate`) that maps to the spec, then update statuses as you progress.

### When something doesn't fit
- If the spec asks for something the current backend can't support, **don't ship a hack.** Surface the gap clearly, propose options with trade-offs, and let the engineer decide.
- The two go-to alternatives are usually: (a) defer and document the follow-up, or (b) ask the engineer to extend the backend first.
- A **fan-out hack** — making N API calls per user action to simulate a filter that should be one server-side call — is almost never the right answer. Flag it as a non-starter even if it would technically work.
- When deferring, capture *exactly* what's left in your end-of-session export so a future session can pick it up.

### Before reporting "done"
- Run lint + build. Both should be clean of *new* warnings (pre-existing ones are fine to leave alone). The exact commands evolve — check `package.json` scripts.
- Walk the diff one more time against the self-check below.
- If you can't manually verify behaviour in a browser (no dev server, no test infra), say so explicitly. A passing build doesn't mean the feature works.
- Update task statuses. Mark a task `completed` only if it's actually finished — partial work stays `in_progress`. Mark deferrals as completed only after documenting them.

### End of session
- Prompt the engineer for `/schoolme` (per the `claude-school` skill habit).
- The export should cover what was built, why decisions were made, what was deferred, and exactly what a future session needs to do to finish.

## Where to look (instead of trusting this skill)

When you need to know the *current* state of something, go to the source. This list intentionally points to *kinds of files* rather than specific filenames — find the actual file by grep/glob in the live tree.

| Question | Where to look |
|----------|---------------|
| What query params does an endpoint accept? | The backend handler in `FryRankLambda` plus its `QueryParam`-style enum. |
| What's the payload shape for a request/response? | The backend model class for that resource, and the saga that posts/parses it. |
| What constants do the frontend and backend share by value? | The frontend's constants file. Cross-check against the backend's constants class — drift between them is a bug. |
| What shared UI already exists? | The Common barrel and its `index.js` re-exports. |
| What actions does a reducer already expose? | The reducer's `types` object and exported `*Actions` object. |
| What's the redux state shape? | The reducer's `initialState`. |
| Which container owns a given page? | `src/containers/<Page>/` — usually one file that maps state/dispatch and runs a `lifecycle`. |
| What does pagination look like on this page? | The `review-pagination-frontend` skill, then the sentinel logic inside the shared list component. |
| What pitfalls hit a past session? | Memory entries under `feedback_*.md` — read them before debugging. |

If you're tempted to assume something based on this skill or a memory file, *verify against the live code first.* Memories and skill docs are point-in-time observations; the code is current.

## Rules for adding new code (durable)

These are the conventions to follow when *writing new code*. They don't describe where things live (see the table for that) — they describe the rules that apply once you're authoring.

- **Adding a new shared component** → register it in the Common barrel's `index.js` so other pages can import it. Add `PropTypes` even on small components. Style with Tailwind utility classes.
- **Adding a new redux field** → put it in `initialState` first, then add the action type, action creator, and reducer case. All dispatches go through the exported action creators — never raw `{ type: ... }`.
- **Adding a new saga** → use `takeEvery`, accept query/body params via the action payload, pass them to axios. Add optional params (cursor, filter) only when non-null.
- **Adding filter-style state** → reset it on page mount in the container's `lifecycle.componentDidMount`, so it doesn't bleed across navigation. Thread the filter value through any pagination callback so paginated fetches stay filtered.
- **Wiring redux to UI** → containers do the `connect()` plumbing, components stay presentation-only and receive everything via props. The exception is top-level pages that already use `useSelector`/`useDispatch` directly — match the existing pattern on that page.
- **`IntersectionObserver` sentinels** need `height: 1px` + `rootMargin: '200px'` — Chromium ignores zero-height sentinels. (Captured in memory as `feedback_review_pagination_observer`.)

## Quick self-check before each commit

- [ ] No pass-through methods or silent refactors? If a refactor seemed needed, did I ask first?
- [ ] No duplicated logic across files — or *within* a file between a generic event handler and an inline value-emitting component callback (compare what the bodies do, not their signatures)? If duplication remains, is it justified (only a few instances, or each has meaningful differences)?
- [ ] Validation enforced at submission time on the frontend, with errors surfaced through the reducer's form-errors slot?
- [ ] Tests scoped to new logic, not re-testing existing coverage?
- [ ] Prop names readable without reading the implementation?
- [ ] Existing comments preserved?
- [ ] Backend contract re-verified against the live backend, not cached assumptions?
- [ ] Lint + build clean (no new warnings)?
- [ ] Tasks updated, deferrals documented?
