# API Reference

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start endpoints -->
| Method | Path | Handler | Source | Summary |
|---|---|---|---|---|
| POST | /auth/login | login | `backend/app/routers/auth.py:23` | — |
| POST | /auth/signup | signup | `backend/app/routers/auth.py:46` | — |
| GET | /health | health | `backend/app/main.py:67` | Liveness probe. |
| GET | /tasks | list_tasks | `backend/app/routers/tasks.py:17` | — |
<!-- sdlc:auto:end endpoints -->

<!-- sdlc:auto:start drift -->
**Designed but missing:**

- DELETE /tasks/{id}
- GET /auth/me
- PATCH /tasks/{id}
- POST /auth/logout
- POST /tasks
<!-- sdlc:auto:end drift -->

<!-- sdlc:auto:start source -->
Generated from commit `436ee33`
<!-- sdlc:auto:end source -->
