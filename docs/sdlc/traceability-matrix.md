# Traceability Matrix

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start legend -->
Built from recorded links, not written by a model: requirement key → plan item (`source_stable_key`) → development ticket (`stable_key`) → the ticket's test steps → the last live deployment that started after the work finished. **AC tests** counts the story's acceptance criteria that have a test case, and those whose test cases all passed in the latest finished E2E run.
<!-- sdlc:auto:end legend -->

<!-- sdlc:auto:start matrix -->
| Requirement | Epic | Title | Plan items | Sprint | Design | Code | Commits | Ticket | Tests | AC tests | Deployed |
|---|---|---|---|---|---|---|---|---|---|---|---|
| US-001 | EPIC-001 | Sign up with email and password | US-001, US-001-T1, US-001-T2, US-001-T3 | 1 | POST /auth/signup, api, db, sessions, spa, users | — | — | not started | not run | 0/4 tested · 0/4 passing | — |
| US-002 | EPIC-001 | Explicit rejection when the email is already registered | US-002 | 1 | POST /auth/signup, api, spa, users | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-003 | EPIC-001 | Explicit rejection of an invalid email format | US-003 | 1 | POST /auth/signup, api, spa, users | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-004 | EPIC-001 | Log in with email and password | US-004 | 1 | GET /auth/me, POST /auth/login, api, sessions, spa, users | — | — | not started | not run | 0/4 tested · 0/4 passing | — |
| US-005 | EPIC-001 | Log out from any page | US-005 | 2 | api, post /auth/logout, sessions, spa | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-006 | EPIC-001 | Passwords are never recoverable from storage | US-006 | 1 | POST /auth/login, POST /auth/signup, api, db, users | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-007 | EPIC-001 | Sessions expire after inactivity | US-007 | 2 | api, db, sessions, spa | — | — | not started | not run | 0/4 tested · 0/4 passing | — |
| US-008 | EPIC-002 | Signed-out visitors are redirected to login | US-008 | 2 | GET /auth/me, api, sessions, spa | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-009 | EPIC-002 | See only my own tasks | US-009 | 2 | GET /tasks, api, db, spa, tasks, users | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-010 | EPIC-002 | Ownership is checked on every task action | US-010 | 3 | DELETE /tasks/{id}, GET /tasks, PATCH /tasks/{id}, POST /tasks, api, tasks | — | — | not started | not run | 0/4 tested · 0/4 passing | — |
| US-011 | EPIC-003 | Add a task with a required title | US-011 | 2 | POST /tasks, api, spa, tasks | — | — | not started | not run | 0/4 tested · 0/4 passing | — |
| US-012 | EPIC-003 | Edit a task's title | US-012 | 3 | PATCH /tasks/{id}, api, spa, tasks | — | — | not started | not run | 0/4 tested · 0/4 passing | — |
| US-013 | EPIC-003 | Toggle a task between completed and not completed | US-013 | 3 | PATCH /tasks/{id}, api, spa, tasks | — | — | not started | not run | 0/4 tested · 0/4 passing | — |
| US-014 | EPIC-003 | Delete a task after confirming | US-014 | 3 | DELETE /tasks/{id}, api, spa, tasks | — | — | not started | not run | 0/4 tested · 0/4 passing | — |
| US-015 | EPIC-004 | See my tasks newest-first on one page | US-015 | 3 | GET /tasks, api, db, spa, tasks | — | — | not started | not run | 0/4 tested · 0/4 passing | — |
| US-016 | EPIC-004 | Filter by All, Active or Completed | US-016 | 3 | GET /tasks, spa, tasks | — | — | not started | not run | 0/4 tested · 0/4 passing | — |
| US-017 | EPIC-004 | Tasks are saved server-side and survive refresh and re-login | US-017 | 4 | GET /tasks, api, db, spa, tasks | — | — | not started | not run | 0/4 tested · 0/4 passing | — |
| US-018 | EPIC-004 | Use the task list on a phone or a desktop | US-018 | 4 | spa | — | — | not started | not run | 0/4 tested · 0/4 passing | — |
| US-019 | EPIC-005 | Use the whole app without paying | US-019 | 4 | api, spa | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-020 | EPIC-005 | Hand over with setup and operating notes | US-020 | 4 | api, db, sessions, spa, tasks, users | — | — | not started | not run | 0/4 tested · 0/4 passing | — |
<!-- sdlc:auto:end matrix -->
