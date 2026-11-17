# Developer Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start status -->
_Up to date._
<!-- sdlc:auto:end status -->

<!-- sdlc:auto:start source -->
Generated from commit `77df320` · model `auto`
<!-- sdlc:auto:end source -->

<!-- sdlc:auto:start overview -->
To-do-app is a generated two-part repository for a simple to-do web app. The README describes the intended product: sign-up and login, per-user tasks, editing, completion toggling, deletion and filtering. `frontend/` is a Vite + React 19 single-page app (TypeScript, Tailwind CSS v4, React Router 7). Per its README, its screens currently render seeded sample data rather than calling the API. `frontend/src/lib/api.ts` provides `apiFetch` and session-token helpers as the seam for wiring screens to real endpoints. `backend/` is a FastAPI 0.115 service using SQLAlchemy 2 and Pydantic 2. No models or routers are implemented yet: the only route is `GET /health`. Tables are created from the models at startup via `Base.metadata.create_all`. The database defaults to a local SQLite file and can be pointed at PostgreSQL through `DATABASE_URL`. `docker-compose.yml` provides a PostgreSQL 16 service for that purpose.
<!-- sdlc:auto:end overview -->

<!-- sdlc:auto:start prerequisites -->
- Node.js with npm (version not pinned in package.json; Vite 6 and React 19 are used)
- Python 3.12 (the version used by backend/Dockerfile) with pip
- Docker with Docker Compose (optional, for the PostgreSQL 16 service and the backend container)
- Playwright Chromium (installed via `npm run test:e2e:install`) for end-to-end tests
<!-- sdlc:auto:end prerequisites -->

<!-- sdlc:auto:start setup -->
1. cd backend
2. pip install -r requirements.txt
3. uvicorn app.main:app --reload
4. In a second terminal, from the repository root: cd frontend
5. npm install
6. npm run dev
7. Optional, to use PostgreSQL instead of the default SQLite file: from the repository root run `docker compose up -d db`, then set DATABASE_URL to <database-connection-string> before starting the backend
8. Optional: set VITE_API_BASE_URL (defaults to http://localhost:8000) and VITE_API_SECRET_KEY to <your-api-secret-key> for the frontend build
<!-- sdlc:auto:end setup -->

<!-- sdlc:auto:start run -->
| Name | Command | Description |
|---|---|---|
| backend dev | `cd backend && uvicorn app.main:app --reload` | Runs the FastAPI service with auto-reload on http://localhost:8000. The health check is at /health and the OpenAPI docs at /docs. |
| backend container | `cd backend && docker build -t to-do-app-backend . && docker run -p 8000:8000 to-do-app-backend` | Builds and runs the backend image from backend/Dockerfile. It serves on port 8000 as a non-root user and includes a /health healthcheck. |
| database | `docker compose up -d db` | Starts the PostgreSQL 16 service defined in docker-compose.yml on port 5432 with a persistent `db-data` volume. |
| frontend dev | `cd frontend && npm run dev` | Starts the Vite dev server, by default at http://localhost:5173 (an origin the backend CORS allows in development). |
| frontend build | `cd frontend && npm run build` | Bundles the SPA with Vite. This does not typecheck. |
| frontend preview | `cd frontend && npm run preview` | Serves the production build locally. |
| format (frontend) | `cd frontend && npm run format` | Formats the frontend with Prettier. |
| lint fix (frontend) | `cd frontend && npm run lint:fix` | Applies the ESLint fixes it can. |
| format (backend) | `cd backend && ruff format .` | Formats the backend Python code with Ruff. |
<!-- sdlc:auto:end run -->

<!-- sdlc:auto:start structure -->
| Path | Purpose |
|---|---|
| `.devcontainer/` | Dev container configuration (devcontainer.json). |
| `.quorq/` | Platform handoff metadata (handoff.json) from the Quorq AI SDLC platform. |
| `backend/` | FastAPI service: requirements.txt, Dockerfile, pytest.ini, ruff.toml and a root conftest.py. |
| `backend/app/` | Application package. main.py holds the app, CORS setup, lifespan table creation and /health. database.py holds the engine, SessionLocal, Base and the get_db dependency. models.py holds SQLAlchemy models (none yet) and schemas.py holds Pydantic models (StubResponse). |
| `backend/app/routers/` | Home for generated routers, one per architecture component. Currently empty. |
| `backend/tests/` | Pytest suite with shared conftest.py, an `integration/` folder (test_health.py) and a `unit/` folder. |
| `frontend/` | Vite + React SPA: package.json, vite.config.ts, tsconfig.json, eslint.config.js, .prettierrc, playwright.config.ts and index.html. |
| `frontend/src/` | App source: main.tsx (entry with BrowserRouter), index.css, test-setup.ts, and lib/ (api.ts API client, ui.tsx components, icons.tsx, navigate.ts). |
| `frontend/e2e/` | Playwright acceptance specs (example.spec.ts) and helpers (support/admin.ts). |
<!-- sdlc:auto:end structure -->

<!-- sdlc:auto:start conventions -->
- Frontend imports use the `@/` alias for `frontend/src`, configured in both vite.config.ts and tsconfig.json.
- TypeScript uses `strict`, but `noImplicitAny` and `strictNullChecks` are disabled. `npm run build` does not typecheck, so run `npm run typecheck` separately.
- Component tests live beside their components in `src/` as `*.test.ts(x)` or `*.spec.ts(x)`. Playwright specs live in `e2e/` and are excluded from Vitest.
- All HTTP calls go through `apiFetch` in `src/lib/api.ts`. It prefixes `VITE_API_BASE_URL`, sends JSON, and sends a bearer token: the session token from localStorage key `session_token` if present, otherwise `VITE_API_SECRET_KEY`.
- Login is expected to return a token in the response body, which the client stores with `setSessionToken`. The frontend does not rely on cookies.
- Backend models inherit `Base` from app.database and must be defined in app/models.py, which main.py imports before `create_all`.
- Request handlers get a DB session through the `get_db` dependency, one session per request.
- Unimplemented generated routes return a typed `StubResponse` instead of raising, so the OpenAPI document stays complete.
- Backend configuration comes from environment variables: `DATABASE_URL` (default `sqlite:///./app.db`) and `ALLOWED_ORIGINS` (comma-separated; defaults to the localhost:5173 dev origins).
- There are no migrations yet. Tables are created at startup, and the code comments say to replace this with Alembic before storing real data.
- Linting and formatting use ESLint and Prettier on the frontend and Ruff on the backend.
<!-- sdlc:auto:end conventions -->

<!-- sdlc:auto:start testing -->
| Name | Command | Description |
|---|---|---|
| backend tests | `cd backend && pytest` | Runs the pytest suite under backend/tests, including the /health integration test. pytest.ini sets pythonpath so `import app` works. |
| backend lint | `cd backend && ruff check .` | Lints backend code with Ruff. |
| frontend unit tests | `cd frontend && npm test` | Runs Vitest component tests in src/ under jsdom. It passes when no tests exist. |
| frontend typecheck | `cd frontend && npm run typecheck` | Runs `tsc --noEmit` over src/. |
| frontend lint | `cd frontend && npm run lint` | Runs ESLint over the frontend. The platform uses this as a gate, so keep it passing. |
| frontend format check | `cd frontend && npm run format:check` | Verifies Prettier formatting without writing changes. |
| e2e browser install | `cd frontend && npm run test:e2e:install` | Downloads the Chromium browser for Playwright. |
| e2e | `cd frontend && npm run test:e2e` | Runs the Playwright specs in e2e/. If E2E_BASE_URL is unset, it boots the backend from backend/.venv on port 8000 and a built preview of the frontend on port 4173. If E2E_BASE_URL is set, it runs against that URL instead. |
<!-- sdlc:auto:end testing -->

<!-- sdlc:auto:start troubleshooting -->
| Problem | Solution |
|---|---|
| `npm run test:e2e` fails to start the backend web server. | playwright.config.ts runs `../backend/.venv/bin/python -m uvicorn ...`, so the backend dependencies must be installed in a virtual environment at backend/.venv (install backend/requirements.txt into it). |
| Browser requests from the frontend to the API are blocked by CORS. | Without ALLOWED_ORIGINS, the backend only allows http://localhost:5173 and http://127.0.0.1:5173. Use the Vite dev server on that port, or set ALLOWED_ORIGINS to a comma-separated list of your frontend origins. |
| `npm run build` succeeds but `npm run typecheck` reports errors. | This is expected: the build does not typecheck. Per the frontend README, errors usually come from untyped state such as `useState({})` that is later read for named fields. Add types and fix them before relying on the code. |
| `pytest` cannot import `app`. | Run pytest from the backend/ directory, so that pytest.ini (with `pythonpath = .`) is picked up. |
| The backend fails at startup when using PostgreSQL. | Tables are created on startup, so the database must be reachable. Start it with `docker compose up -d db`, wait for its healthcheck, and check that DATABASE_URL is set to the correct <database-connection-string>. Unset DATABASE_URL to fall back to SQLite. |
| Frontend build fails to resolve `@/App`. | main.tsx imports `@/App`, but App.tsx does not appear in the provided file tree. Make sure frontend/src/App.tsx exists. |
| The UI shows data that does not match the backend. | The screens currently render seeded sample data and do not call the API. Wire each screen to the backend through `apiFetch` in src/lib/api.ts. |
| Playwright's Chromium crashes inside a container. | The config already passes `--disable-dev-shm-usage`. Make sure the browser was installed with `npm run test:e2e:install`. |
<!-- sdlc:auto:end troubleshooting -->
