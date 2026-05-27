# Review Pagination - Frontend

## Context

Use this skill when working on cursor-based pagination for the reviews feature — extending it to new pages, debugging infinite scroll behaviour, or modifying how paginated reviews are stored in Redux.

## API Contract

**Request params** (GET `/reviews`):
- `restaurantId` or `accountId` — required, one or the other
- `limit` — always send `10` explicitly (defined as `REVIEWS_LIMIT` in `src/redux/sagas/reviews/index.js`)
- `cursor` — omit on the first request; send `nextCursor` from the previous response on subsequent requests

**Response shape:**
```json
{
  "reviews": [...],
  "nextCursor": "2026-03-17T03%3A58%3A02Z"
}
```

`nextCursor` is a URL-encoded ISO datetime string. It is **omitted entirely** from the response (not set to null) when there are no further pages — Gson skips null fields. Always use `data.nextCursor ?? null` on the frontend to safely handle the missing field.

## Redux State Shape

`nextCursor` lives alongside `reviews` in `reviewsReducer`:

```javascript
{
  reviews: [],        // array of review objects, accumulated across pages
  nextCursor: null,   // string when more pages exist, null when exhausted
  requestingReviews: false,
  ...
}
```

`nextCursor` is reset to `null` alongside `reviews` when `RESET_REVIEWS` is dispatched (e.g. on page mount before fetching).

## Data Flow

1. Container dispatches `startGetAllReviews*Request(id, cursor)` — `cursor` is `null` on first load, `nextCursor` from state on subsequent loads.
2. Saga builds params `{ id, limit: REVIEWS_LIMIT }`, adds `cursor` only if non-null.
3. Saga dispatches success action with `(reviewsData, ..., nextCursor)`.
4. Reducer always spreads incoming reviews onto `state.reviews` — safe because containers call `resetReviews()` on mount, guaranteeing `state.reviews` is `null` on a fresh load. Stores new `nextCursor`.
5. `ReviewCardList` observes a sentinel `<div>` at the bottom of the list via `IntersectionObserver`. When it enters the viewport and `nextCursor` is non-null, calls `onLoadMore()`. When `nextCursor` is null, renders `<p>End of reviews.</p>` in place of the sentinel.

## Infinite Scroll Pattern

The infinite scroll logic lives entirely in `components/Common/ReviewCardList/index.jsx`. Parent components pass three pagination props:

```jsx
<ReviewCardList
    reviews={reviews}
    nextCursor={nextCursor}
    requestingReviews={requestingReviews}
    onLoadMore={() => getReviews(id, nextCursor)}
/>
```

Inside `ReviewCardList`:

```jsx
const sentinelRef = useRef(null);

useEffect(() => {
    if (!sentinelRef.current || !nextCursor || requestingReviews || !onLoadMore) return;

    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            onLoadMore();
        }
    }, { rootMargin: '200px' });

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
}, [nextCursor, requestingReviews, onLoadMore]);
```

The effect re-runs when `nextCursor` or `requestingReviews` changes:
- `nextCursor` change → new page loaded, observer reattaches to sentinel
- `requestingReviews` guard → prevents duplicate in-flight requests

The footer at the bottom of the list:
```jsx
{requestingReviews && <FrySpinner />}
{onLoadMore && (nextCursor
    ? <div ref={sentinelRef} style={{ height: '1px' }} />
    : <p>End of reviews.</p>
)}
```

The `onLoadMore` guard prevents the footer from rendering on pages that use `ReviewCardList` without pagination (e.g. `RecentReviews`).

## Adding Pagination to a New Page

If a new page needs to display paginated reviews from `GET /reviews`:

1. Dispatch `startGetAllReviews*Request(id, null)` on mount (already resets via `resetReviews`).
2. Map `nextCursor` and `requestingReviews` from `state.reviewsReducer` in the container's `mapStateToProps`.
3. Ensure `getReviews` is in `mapDispatchToProps`.
4. Pass `nextCursor`, `requestingReviews`, and `onLoadMore` to `ReviewCardList` — the infinite scroll behaviour is handled automatically.

## Key Design Decisions

- **Infinite scroll consolidated in `ReviewCardList`** — both `Reviews` and `Critic` previously duplicated the sentinel + `IntersectionObserver` pattern. Moving it into `ReviewCardList` means any component rendering a paginated list gets the behaviour for free via props.
- **No `isPaginating` flag** — the reducer previously needed an explicit boolean to decide whether to append or replace reviews. Since containers always call `resetReviews()` on mount (setting `state.reviews` to `null`), spreading onto `null || []` on a fresh load yields the same result as replacing. The flag was removed entirely.
- **`onLoadMore` callback over passing `getReviews` + id** — `ReviewCardList` has no knowledge of `restaurantId` or `accountId`. The parent pre-binds those into `onLoadMore`, keeping `ReviewCardList` decoupled from the calling convention.
- **`??` not `||` for `nextCursor`** — `data.nextCursor ?? null` handles the field being absent (Gson omits it) without falsely treating an empty string as no cursor.
- **`limit` always sent** — the backend defaults to 10, but we send it explicitly so the frontend isn't silently coupled to a backend default that could change.
- **`IntersectionObserver` over scroll listeners** — scroll events fire constantly and need manual position math. `IntersectionObserver` fires only when the sentinel enters or exits the viewport.
- **`nextCursor` reset on `RESET_REVIEWS`** — containers call `resetReviews()` on mount before fetching. Without resetting `nextCursor`, stale cursor state from a previous visit could corrupt the first request.
- **`getRecentReviews` is unaffected** — it uses a separate `/reviews/recent` endpoint with a `count` param and has no pagination.
