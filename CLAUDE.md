# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server (react-scripts)
npm run build     # Production build
npm test          # Run tests (react-scripts)
npm test -- --testPathPattern=<pattern>  # Run a single test file
```

**Deploy to AWS:**
```bash
./deploy.sh       # Unix/macOS
.\deploy.bat      # Windows
```

## Environment Variables

Copy `.env.sample` to `.env` and populate:
- `REACT_APP_BACKEND_SERVICE_PATH` — Backend API base URL (e.g., `http://localhost:8080/api`)
- `REACT_APP_GOOGLE_API_KEY` — Google Places API key
- `REACT_APP_GOOGLE_AUTH_KEY` — Google OAuth client ID

## Architecture

FryRank is a French fry restaurant review app. Users search for restaurants via Google Places, then read and write fry reviews stored in a custom backend.

### Component / Container pattern

`src/components/` holds presentational components (no Redux). `src/containers/` holds the Redux-connected counterparts. They mirror each other's directory structure. When adding a feature, create the UI in `components/` and wire Redux in `containers/`.

### State management: Redux Toolkit + Redux-Saga

`src/redux/reducers/` — state slices (`restaurants`, `reviews`, `user`, `userSettings`)
`src/redux/sagas/` — async side effects (API calls via Axios)
`src/redux/store.js` — store + saga middleware setup

**Data flow:**
1. Container dispatches a `*_REQUEST` action
2. Saga intercepts it, calls the backend or Google Places API
3. On success/failure, saga dispatches `*_SUCCESS` / `*_FAILURE`
4. Reducer updates state; component re-renders via `useSelector`

### Routing

Routes are defined in `src/routes.js` and rendered in `src/App.js` using React Router v6.

Key routes:
- `/restaurants` — restaurant search + map/list view
- `/restaurants/:restaurantId` — reviews for a restaurant
- `/restaurants/:restaurantId/create` — create review
- `/critics/:accountId` — a critic's review history
- `/recent-reviews` — recent reviews feed
- `/userSettings` — user account settings

Route path constants live in `src/constants.js` (`PATH_*` exports).

### API integration

**Backend** (`REACT_APP_BACKEND_SERVICE_PATH`):
- Reviews CRUD: `GET/POST/DELETE /reviews`
- Aggregate ratings: `GET /reviews/aggregateInformation`
- User metadata: endpoints called with `Authorization: Bearer <idToken>`

**Google Places API** (`https://places.googleapis.com/v1/`):
- `POST places:searchText` — search restaurants by text + location
- `GET places/{id}` — restaurant details
- Uses `X-Goog-Api-Key` and `X-Goog-FieldMask` headers

### Authentication

Google OAuth via the `GoogleLogin` component in `src/components/Common/GoogleLogin/`. The ID token is stored in `userReducer.idToken` and passed as a Bearer token for authenticated backend calls.
