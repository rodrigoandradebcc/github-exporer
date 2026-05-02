# GitHub Explorer

A React Native app for searching GitHub repositories, browsing repository details, and listing open issues. Built as a technical assessment showcasing component architecture, data fetching patterns, and design-system discipline.

---

## Technologies

| Technology | Why |
|---|---|
| **Expo SDK 54 + Expo Router v6** | File-based routing eliminates manual navigation boilerplate; deep-link support comes for free. Chosen over bare React Native to focus on product code rather than build configuration. |
| **React Native 0.81 / React 19** | Cross-platform mobile target. |
| **TanStack Query v5** | Handles server state (cache, stale-while-revalidate, infinite pagination, retries) declaratively. Avoids manual `useEffect`/`useState` data-fetching chains. |
| **Axios** | Thin HTTP client; interceptors keep authentication and error normalisation in one place (`ApiError`). |
| **date-fns** | Lightweight, tree-shakable date utilities with pt-BR locale for relative timestamps on issues. |
| **TypeScript (strict + `noUncheckedIndexedAccess`)** | Maximum type safety. Catches array boundary bugs at compile time. |
| **ESLint + Prettier** | Consistent code style, enforced via `npm run lint` and `npm run format`. |
| **Jest + jest-expo + @testing-library/react-native** | Unit and component tests that run without a device or simulator. |

---

## Getting started

### Prerequisites

- Node.js 20+
- iOS Simulator (Xcode) or Android Emulator, or the **Expo Go** app on a physical device

### Install

```bash
npm install
```

### Environment (optional)

Without a token the GitHub API allows 60 unauthenticated requests/hour. For development, copy `.env.example` and add a Personal Access Token:

```bash
cp .env.example .env
# edit .env and fill in your token
```

```
EXPO_PUBLIC_GITHUB_TOKEN=ghp_your_token_here
```

The `EXPO_PUBLIC_` prefix is required by Expo SDK 49+ to expose variables to app code. The `.env` file is already listed in `.gitignore`.

### Run

```bash
npx expo start           # opens Expo CLI — press i for iOS, a for Android, w for web
npx expo start --ios     # launches iOS Simulator directly
npx expo start --android
```

---

## Scripts

```bash
npm test              # run Jest once (no watch)
npm run lint          # ESLint across all source files
npm run type-check    # tsc --noEmit (type errors only, no output)
npm run format        # Prettier write pass
```

---

## Project structure

```
src/
├── app/                        # Expo Router routes (thin wrappers only — no logic)
│   ├── _layout.tsx             # Root layout: QueryClient + ThemeProvider + Stack
│   ├── index.tsx               # / → SearchScreen
│   ├── showcase.tsx            # /showcase → Design System showcase
│   └── repository/[owner]/[repo]/
│       ├── index.tsx           # /repository/:owner/:repo → RepositoryDetailScreen
│       └── issues.tsx          # /repository/:owner/:repo/issues → IssuesScreen
│
├── features/                   # Business domains, each self-contained
│   ├── repositories/
│   │   ├── components/         # RepositoryCard, RepositoryCardSkeleton
│   │   ├── hooks/              # useSearchRepositories, useRepository
│   │   └── screens/            # SearchScreen, RepositoryDetailScreen (+ __tests__)
│   └── issues/
│       ├── hooks/              # useRepositoryIssues
│       └── screens/            # IssuesScreen (+ __tests__)
│
├── services/api/               # HTTP layer: Axios client, typed GitHub API functions, ApiError
├── design-system/              # Closed component library (index.ts is the only public surface)
│   ├── tokens/                 # colors, spacing, radius, sizes
│   ├── theme/                  # ThemeProvider + useTheme (persists mode to AsyncStorage)
│   └── components/             # Avatar, Badge, Box, Button, Card, Heading,
│                               #   Input, Skeleton, Switch, Text
└── hooks/                      # Shared generic hooks (useDebounce)
```

---

## Architectural decisions

### Feature-based organisation

Code is grouped by domain (`repositories`, `issues`) rather than by layer (`screens/`, `hooks/`, `components/`). Everything related to a feature is co-located. Adding a new domain means adding a new folder, not touching existing ones.

### Design system as a closed module

All DS components live under `src/design-system/` and the **only** public surface is `src/design-system/index.ts`. Feature screens may not import from internal DS paths. This enforces:

- A single source of truth for all theme tokens — components access them via `useTheme()`, never as raw strings or hardcoded hex values
- Zero inline styles in feature code — every visual property is a named prop accepted by a DS component
- Easy auditing: any style change is contained inside DS components, not scattered across screens

The three places in `src/app/showcase.tsx` that use `View` with inline styles (color swatches, spacing bars, section divider) are intentional and documented in comments — they are intrinsically about rendering raw token values.

### React Query cache strategy

| Query | `staleTime` | Rationale |
|---|---|---|
| Repository search | 5 min | Search results change infrequently; avoids hammering the API on every debounced keystroke |
| Repository detail | 1 min | Detail data is relatively static; shorter TTL keeps star/fork counts reasonably fresh |
| Issues list | 5 min | Issues change often in active repos but real-time updates are not a requirement here |

`refetchOnWindowFocus` is disabled globally — mobile apps don't have a meaningful "window focus" event and the default behaviour would trigger unnecessary refetches on every navigation transition.

### Error handling and rate limits

All Axios errors are normalised into `ApiError` (status, message, `isRateLimit`). The `isRateLimit` flag (set for HTTP 403 and 429) disables automatic retries in the root `QueryClient` and triggers a dedicated error state in every screen that explains the limit and suggests adding `EXPO_PUBLIC_GITHUB_TOKEN`. Generic network errors get a retry button that re-executes the failed query.

---

## What I would do with more time

- **Issue detail screen** — render the issue body (Markdown) and comments thread.
- **Offline support** — persist the React Query cache to AsyncStorage via `@tanstack/query-async-storage-persister` so previously loaded data is available without a network connection.
- **E2E tests** — Detox or Maestro tests covering the search → detail → issues flow on a real simulator, which type checking and unit tests cannot catch.
- **Accessibility** — add `accessibilityLabel` / `accessibilityHint` to all interactive elements, audit contrast ratios against WCAG AA, smoke-test with VoiceOver and TalkBack.
- **Design token expansion** — add typography tokens (font family, line heights) and a motion token for consistent animation durations across `Skeleton` and micro-interactions.
- **Error boundaries** — wrap the root `Stack` in a React error boundary to catch unexpected runtime errors gracefully instead of showing a blank screen.
- **CI pipeline** — GitHub Actions workflow running `type-check`, `lint`, and `test` on every pull request before merge.
- **Pagination UX** — the current infinite scroll is functional but a cursor-based pagination strategy with a visible "load more" affordance would be more reliable for repos with thousands of issues.
