# Fryrank - Review Categorization Tags

## What We Built
A categorization system that lets users tag each FryRank review with one or more fry styles (Regular, Curly, Waffle, Sweet Potato, Poutine, etc.) and then filter reviews by tag on the restaurant page, the critic (user) page, and the recent reviews page. Tag selection is required when creating or editing a review, and tags are shown as chips on every review card. The matching backend support already lives in `FryRankLambda` (a `tags: List<String>` field on `Review` plus a `tag` query parameter on the GET endpoints) — this session was the frontend wiring.

## How It Works

**Data shape.** A review now carries a `tags` array of strings. The canonical tag list is `FRY_TAGS` in `src/constants.js` — a frozen array that the frontend treats as the source of truth and ships verbatim to the backend (the backend matches by exact string with `contains(#tags, :tag)` in DynamoDB).

**Three reusable common components** keep the UI consistent and DRY:
- `TagSelector` — multi-select chips, used inside `CreateReview/ReviewForm` and `EditReviewModal`. Renders all `FRY_TAGS` as toggleable buttons, surfaces a `formErrors.tags` border + message.
- `TagFilter` — single-select dropdown, used on the three review-list pages. Emits `null` when "All fry types" is picked.
- `TagBadges` — read-only amber pill chips, rendered on every `ReviewCard` after the body.

**Validation.** `helpers/reviewValidation.js` gained one check: `tags` must be a non-empty array. Both the create form and the edit modal call `validateReview` before submit, so the backend doesn't have to enforce "at least one tag" — frontend owns that responsibility per the engineer's standing guidelines.

**Filter state lives in redux.** `reviewsReducer` got a `tagFilter` field plus a `SET_TAG_FILTER` action. Each list page maps that state to a component-level prop named `selectedTag` and the setter to `onTagChange` (the controlled-component pattern). On mount each page clears the filter back to `null`; on change it dispatches `resetReviews()` then refetches with the new tag in the saga.

**Saga changes.** `callGetAllReviewsForRestaurant` and `callGetAllReviewsForAccount` now accept a `tag` field on the action and add it as a `tag` query param when present. `RecentReviews` uses a plain `fetch` helper instead of a saga, so `fetchRecentReviews` was given an optional `tag` arg that goes onto the URL via `URLSearchParams`.

**End-to-end flow for "filter critic page by Curly":**
1. User picks "Curly" from the `TagFilter` dropdown.
2. `onTagChange(tag)` dispatches `setTagFilter("Curly")` → reducer updates `tagFilter`.
3. `componentDidUpdate` notices `selectedTag` changed, dispatches `resetReviews()` to clear the list, then `getReviews(accountId, null, "Curly")`.
4. Saga sends `GET /reviews?accountId=…&limit=10&tag=Curly`.
5. Reducer's `GET_ACCOUNT_REVIEWS_SUCCESS` case appends the response — but since we just reset, the list is now exactly the tag-matching page.
6. Infinite-scroll `onLoadMore` keeps the current `selectedTag` in its `getReviews` call so paginated fetches stay filtered.

## Key Design Decisions & Trade-offs

- **Hardcoded tag list, not user-defined.** The spec calls for an MVP filter-expression approach with embedded tags in reviews — not a normalized tags table. Hardcoding in `constants.js` keeps the UI deterministic and lets the backend skip tag validation. Trade-off: any new tag requires a synchronized frontend + backend deploy (called out in the spec's "cons" section).
- **Frontend owns "≥1 tag" enforcement.** Per the implementation guidelines, validation should not be duplicated on the backend. The form rejects empty selections; the backend trusts the payload. Cheaper backend, but means any non-browser client could submit a tagless review — acceptable for MVP.
- **Single-tag filter, multi-tag review.** Backend's `tag` query param is singular and uses a `contains()` filter expression, so the filter UI is a one-pick dropdown. A review itself can carry multiple tags, so the multi-select chip UI is on the form. The asymmetry is intentional and matches what the DAL supports today.
- **Prop names `selectedTag` + `onTagChange`** instead of `tagFilter` + `setTagFilter`. The engineer pushed back on the original naming during review — `selectedTag` (singular) reads cleanly alongside `TagSelector`'s `selectedTags` (plural) on the form, and `onTagChange` matches React's standard `value`/`onChange` shape. Redux state itself stayed `tagFilter` because it describes the *purpose* of the state.
- **Reset-then-refetch on filter change** rather than client-side filtering of already-loaded pages. Client filtering would break pagination (the cursor reflects backend order on the unfiltered set) and would only filter the currently-loaded slice. Server filtering is correct even if it costs an extra round trip.
- **Deferred restaurants-page tag filter.** The spec explicitly asked whether filtering restaurants on the search list + map by tag was feasible. The current aggregate endpoint (`/reviews/aggregateInformation`) only accepts `ids` + `rating`; there's no way to ask "which of these restaurants have ≥1 review with tag X". Options were (a) ship a fan-out hack — one `GET /reviews` per visible restaurant on every filter change, slow and chatty; or (b) extend the backend's `AggregateReviewFilter` with a `tag` field that filters returned IDs. The engineer chose to defer until the backend can support it, which also wins the map view for free (pins are derived from the same restaurant ID set).
- **Tag chip color = amber, not red.** Score uses red, edit/delete icons use slate, so tags got their own visual lane (`bg-amber-100 text-amber-900`). Helps users scan a list of reviews and pattern-match on fry style at a glance.

## Concepts to Remember

- **Filter expression (DynamoDB).** A post-query filter applied after the index lookup. Cheaper to add than a new GSI, but it still reads (and bills for) all index-matching items before filtering. Right call for an MVP; revisit if tag-filtering becomes a hot path.
- **DRY in component design.** One `TagSelector`, one `TagFilter`, one `TagBadges` — used everywhere they're needed. The temptation when adding a feature across three pages is to inline three near-identical pieces of JSX; resist that and extract the component first.
- **Pass-through methods (anti-pattern).** A wrapper that exists only to forward args to another function with no added logic. The implementation guidelines call these out specifically — if a refactor seems needed to support a new feature cleanly, surface it to the engineer rather than silently introducing a shim.
- **Controlled components.** A component owns no internal state for its value; instead it takes a `value` (or `selectedTag`) prop and emits an `onChange` callback. The two props look redundant but serve opposite roles — one for reading, one for writing — and the state itself lives one level up (in our case, in redux).
- **Validation ownership.** Pick *one* layer to enforce a rule. If the frontend already guarantees a constraint at submit time, duplicating it on the backend adds maintenance cost without preventing real bugs. Reserve backend validation for things only the backend can know (auth, race conditions, cross-record invariants).
- **Reducer initial state matters for forms.** Adding `tags: []` to `initialState.currentReview` (and resetting it in `CREATE_REVIEW_FOR_RESTAURANT_REQUEST`) ensures the form starts and ends in a known state. Skipping this leads to "ghost tags" carrying over between reviews.

## Files Changed

| File | What Changed |
|------|--------------|
| `src/constants.js` | Added `FRY_TAGS` frozen list (17 styles) shared with backend by value. |
| `src/helpers/reviewValidation.js` | Reject submission when `tags` is missing or empty. |
| `src/components/Common/TagSelector/index.jsx` | New — multi-select chip picker for review forms. |
| `src/components/Common/TagFilter/index.jsx` | New — single-select dropdown for filtering review lists. |
| `src/components/Common/TagBadges/index.jsx` | New — amber chip display for tags on review cards. |
| `src/components/Common/index.js` | Re-export `TagBadges`, `TagFilter`, `TagSelector`. |
| `src/components/Common/ReviewCard/index.jsx` | Render `TagBadges` (using updated review from redux so edits reflect immediately). |
| `src/components/CreateReview/ReviewForm/index.jsx` | Wire `TagSelector` into the new-review form, clear `formErrors.tags` on change. |
| `src/components/EditReview/EditReviewModal.jsx` | Wire `TagSelector` into the edit modal. |
| `src/components/Reviews/index.jsx` | Render `TagFilter`, tag-aware empty state, pass `selectedTag` through `onLoadMore`. |
| `src/components/Critic/index.jsx` | Render `TagFilter`, tag-aware empty state, pass `selectedTag` through `onLoadMore`. |
| `src/components/RecentReviews/index.jsx` | Render `TagFilter`, refetch when filter changes, tag-aware empty state. |
| `src/containers/Reviews/index.jsx` | Map `tagFilter` → `selectedTag`, `setTagFilter` → `onTagChange`; reset+refetch on change. |
| `src/containers/Critic/index.js` | Same mapping + reset+refetch on either accountId or tag change. |
| `src/containers/RecentReviews/index.js` | `fetchRecentReviews` accepts a `tag` arg and adds it as a query param. |
| `src/redux/reducers/reviews/index.js` | Added `tagFilter` state, `SET_TAG_FILTER` type, `setTagFilter` action, `tags: []` on `currentReview` + reset on submit. |
| `src/redux/sagas/reviews/index.js` | Pass `tag` through to `GET /reviews` for both restaurant and account queries. |

## Testing Approach

- **Static checks.** `npx eslint` ran clean against all changed files (only pre-existing warnings, none introduced by this work). `npx react-scripts build` compiled successfully with the expected gzipped size bump (~971B JS, 70B CSS).
- **Manual test plan handed to engineer.** Verify on each page:
  - Create review: submitting without picking any tag surfaces the red-bordered tag error; submitting with one or more tags succeeds and the new card shows the chips.
  - Edit review: changing tag selection and saving updates the chip set on the card without a hard refresh.
  - Restaurant page filter: picking "Curly" should reduce the list to curly reviews; clearing should refetch the full set; empty-state copy should mention the active tag.
  - Critic page filter: same as restaurant page, plus that switching critics resets the filter to "All fry types".
  - Recent reviews filter: changing the filter triggers a refetch; the restaurant detail batch fetch still runs after.
- **No new unit tests.** No test infrastructure existed for these areas (no `*.test.js(x)` files in `src/`), and the implementation guidelines say to scope tests to genuinely new logic — the validation change is a one-line non-empty check, and the components are thin glue over existing redux + saga patterns. If/when test infra lands, the priority candidates would be `validateReview` (tags branch) and the reducer's `SET_TAG_FILTER` case.
- **Deferred verification.** The restaurants-page tag filter is intentionally not built yet; once the backend extends `AggregateReviewFilter` with a `tag` field, the manual test will be: pick a tag, confirm restaurants without matching reviews drop from both the list and the map pins.

## Follow-up: Finishing the Restaurants-Page Tag Filter

The one piece left from the spec is filtering the restaurants search results (list view + Google Map view) by tag. It was deferred mid-session because the current `/reviews/aggregateInformation` endpoint only takes `ids` + `rating` — there's no server-side way to ask "which of these restaurant IDs have ≥1 review containing tag X". The two viable paths considered were:

1. **Per-restaurant fan-out (rejected).** Fire one `GET /reviews?restaurantId=X&tag=T` per visible restaurant on every filter change, hide the ones that come back empty. Works without backend changes but is N calls per filter interaction — too chatty even for 10 results per page, and gets worse as the page size grows.
2. **Extend the aggregate endpoint (chosen, pending backend work).** Add a `tag` field to `AggregateReviewFilter` and a matching `tag` query param on `GetAggregateReviewInformationHandler`. When present, the DAL filters the batch-get result down to restaurant IDs whose aggregate row (or a quick secondary lookup) confirms ≥1 review with that tag.

### What needs to happen on the backend (FryRankLambda)

- Add a `String tag` field to `AggregateReviewFilter` (currently only holds `includeRating`).
- Read `QueryParam.TAG` in `GetAggregateReviewInformationHandler` and pass it through `ReviewDomain.getAggregateReviewInformationForRestaurants` to the DAL.
- In `ReviewDALImpl.getAggregateReviewInformationForRestaurants`, when `tag` is non-null, filter the response so only restaurant IDs with at least one matching-tag review come back. The cheapest implementation is probably a per-restaurant query against `RESTAURANT_ID_TIME_INDEX` with the same `contains(#tags, :tag)` filter the review-list path already uses (limit 1, project nothing), run in parallel across the input ID list.
- Tests: extend `ReviewDomainTests` and `ReviewDALTests` for the new tag path only; per the guidelines, don't re-test API Gateway validation that's already covered in `APIGatewayRequestValidatorTest`.

### What needs to happen on the frontend (this repo)

- Add a `tag` param to the aggregate fetch inside `redux/sagas/restaurants/index.js` (`callGetRestaurantsForQuery`). The existing `axios.get(AGGREGATE_INFORMATION_API_PATH, { params: { ids, rating: true } })` becomes `{ ids, rating: true, tag }`.
- Add `tagFilter` to `restaurantsReducer` initial state + `SET_RESTAURANTS_TAG_FILTER` action. Keep this filter separate from the reviews tag filter, since restaurant search and review lists are independent flows. (Alternative: share the reviews `tagFilter` if the UX should sync across all pages — discuss with engineer first.)
- In `containers/Restaurants/index.js`, listen for tag-filter changes and re-call `getRestaurants(searchQuery, location)` so the saga refetches with the new tag.
- Drop the now-shorter restaurant ID set into the existing `restaurantIdsForQuery` + `pinData` pipeline. The list view filters by `restaurantIds.includes(...)` so it gets the change for free; the map's `pinData` is derived from the same data via `getPinData(...)`, so map pins also drop without extra work.
- Render `TagFilter` next to the existing `SearchInput` in `components/Restaurants/index.jsx` and wire it to the new restaurants reducer action.
- Manual test: type a search, switch between map and list views, pick a tag — verify the list shrinks and the map's pin set shrinks to match. Confirm clearing the tag restores the full result set without re-typing the search.

### Why this ordering matters

Doing the backend first means the frontend never ships a fan-out hack that would have to be ripped out two days later. It also keeps the contract single-source-of-truth on the backend, which matches how `tag` filtering already works on the review-list endpoints (`GET /reviews?tag=…`, `GET /reviews/recent?tag=…`). When the backend lands, the frontend wiring above should be a one-PR follow-up.
