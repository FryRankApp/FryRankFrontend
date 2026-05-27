# FryRank - Cursor Pagination & Infinite Scroll

## What We Built
We connected the frontend to the backend's cursor-based pagination on the `GetAllReviews` lambda. Previously, the frontend fetched all reviews in a single unbounded request. Now it fetches 10 at a time, and both the restaurant reviews page and the critic profile page automatically load the next page as the user scrolls to the bottom, with an "End of reviews." message when there are no more pages to fetch.

The infinite scroll logic was later consolidated into `ReviewCardList` so that any component rendering a paginated list gets the behaviour for free via props, rather than duplicating the sentinel + observer pattern.

## How It Works
The backend returns a `nextCursor` field alongside the `reviews` array in its response. This cursor is an ISO datetime string derived from the last review returned, and is omitted entirely from the JSON when there are no further pages (Gson skips null fields).

On the frontend, the data flows like this:
1. A container dispatches `startGetAllReviewsForRestaurantRequest(restaurantId, cursor)` — `cursor` is `null` on the initial load and the value of `nextCursor` on subsequent loads.
2. The Redux-Saga intercepts the action, builds the GET request with `limit=10` and an optional `cursor` query param, and calls the backend.
3. On success, the saga dispatches a success action carrying the new reviews and the `nextCursor` from the response.
4. The reducer always spreads the incoming reviews onto `state.reviews`. Since containers call `resetReviews()` on mount before fetching, `state.reviews` is always `null` on a fresh load — spreading onto `null || []` naturally yields just the new reviews, making an explicit append-vs-replace flag unnecessary.
5. `ReviewCardList` renders an invisible sentinel `<div>` at the bottom of the list. An `IntersectionObserver` watches it — when it scrolls into view and `nextCursor` is non-null, `onLoadMore()` is called to fetch the next page. When `nextCursor` is null, "End of reviews." is shown instead.

## Key Design Decisions & Trade-offs
- **Infinite scroll consolidated in `ReviewCardList`** — both `Reviews` and `Critic` previously duplicated the sentinel + `IntersectionObserver` pattern. Moving it into `ReviewCardList` means any component rendering a paginated list gets the behaviour for free by passing `nextCursor`, `requestingReviews`, and `onLoadMore`.
- **No `isPaginating` flag** — an earlier version passed an explicit boolean from the saga to tell the reducer whether to append or replace reviews. This was removed because containers always call `resetReviews()` on mount, guaranteeing `state.reviews` is `null` on a fresh load. Spreading onto `null || []` handles both cases identically.
- **`onLoadMore` callback over passing `getReviews` + id** — `ReviewCardList` has no knowledge of `restaurantId` or `accountId`. The parent pre-binds those into `onLoadMore`, keeping `ReviewCardList` decoupled from each page's specific data.
- **Explicit `limit=10` from the frontend** — even though the backend defaults to 10, we pass it explicitly so the frontend isn't silently dependent on a backend default that could change.
- **`??` instead of `||` for `nextCursor`** — `data.nextCursor ?? null` safely handles the field being absent from the response (Gson omits null fields) without accidentally treating an empty string as falsy.
- **`IntersectionObserver` over scroll event listeners** — scroll listeners fire constantly and require manual math to determine position. `IntersectionObserver` fires only when the sentinel element enters or exits the viewport, making it more efficient and simpler to implement.
- **`onLoadMore` guard on the footer** — `ReviewCardList` is also used by `RecentReviews`, which has no pagination. Without the guard, "End of reviews." would always render there. Checking `onLoadMore` before rendering the footer means non-paginated uses of `ReviewCardList` are unaffected.

## Concepts to Remember
- **Cursor-based pagination** — instead of page numbers, the server returns a cursor (here, an ISO datetime) pointing to where the next page starts. More reliable than offset pagination when data is being added or removed concurrently.
- **`IntersectionObserver`** — a browser API that fires a callback when a watched element enters or exits the visible area of the screen. Used here to detect when the user has scrolled to the bottom of the list.
- **Sentinel element** — an invisible DOM element placed at a strategic position (here, the bottom of a list) used purely as an observation target, with no visual presence.
- **Spread operator (`...`)** — `[...a, ...b]` creates a new array combining both without mutating either. Used to append new reviews to existing ones. `[...(null || []), ...b]` safely handles a null starting value.
- **`??` (nullish coalescing)** — returns the right-hand side only if the left is `null` or `undefined`. Safer than `||` when you want to preserve falsy values like `0` or `""`.
- **`useRef`** — a React hook that gives you a stable reference to a DOM element across renders, without triggering a re-render when it changes.
- **`onLoadMore` as a pre-bound callback** — when a child component needs to trigger a parent action but shouldn't know about the parent's data, the parent wraps the call in a callback and passes it down. The child just calls it without needing to know the arguments.

## Files Changed
| File | What Changed |
|------|--------------|
| `src/redux/reducers/reviews/index.js` | Added `nextCursor` to initial state; `GET_*_SUCCESS` cases now always spread incoming reviews onto existing state; `RESET_REVIEWS` clears `nextCursor`; removed `isPaginating` from action creators |
| `src/redux/sagas/reviews/index.js` | Both GET sagas pass `limit: 10` and optional `cursor` param; forward `nextCursor` to success actions; removed `cursor != null` argument |
| `src/containers/Reviews/index.jsx` | Maps `nextCursor` and `requestingReviews` from Redux state |
| `src/containers/Critic/index.js` | Maps `nextCursor` from Redux state |
| `src/components/Common/ReviewCardList/index.jsx` | Now owns the sentinel + `IntersectionObserver` infinite scroll pattern; accepts `nextCursor`, `requestingReviews`, `onLoadMore` props; renders spinner and end-of-reviews footer |
| `src/components/Reviews/index.jsx` | Removed sentinel/observer logic; passes pagination props to `ReviewCardList` |
| `src/components/Critic/index.jsx` | Removed sentinel/observer logic; passes pagination props to `ReviewCardList` |

## Testing Approach
Manual testing approach:
- Load the restaurant reviews page and confirm only 10 reviews appear initially
- Scroll to the bottom and confirm the next page loads and appends seamlessly
- Scroll to the end of all reviews and confirm "End of reviews." appears
- Repeat on a critic profile page
- Test a restaurant with fewer than 10 reviews and confirm "End of reviews." appears immediately without a sentinel
- Confirm navigating away and back resets reviews cleanly (via `resetReviews` which also clears `nextCursor`)
- Confirm `RecentReviews` does not show "End of reviews." (no `onLoadMore` passed)
