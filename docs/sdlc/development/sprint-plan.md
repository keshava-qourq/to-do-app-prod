# Sprint Plan

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start sprints -->
## Sprint 1: Sprint 1

Users can create an account and log in, with hashed passwords and explicit sign-up rejections for a duplicate or invalid email

Capacity: 20 points · Committed: 19

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-001 | Story | Sign up with email and password | 8 | backend-agent | — |
| ↳ US-001-T1 | Task | Add users and sessions migration | — | backend-agent | — |
| ↳ US-001-T2 | Task | Implement POST /auth/signup | — | backend-agent | — |
| ↳ US-001-T3 | Task | Build sign-up screen | — | frontend-agent | — |
| US-002 | Story | Explicit rejection when the email is already registered | 2 | backend-agent | US-001 |
| US-003 | Story | Explicit rejection of an invalid email format | 2 | frontend-agent | US-001 |
| US-004 | Story | Log in with email and password | 5 | backend-agent | US-001, US-006 |
| US-006 | Story | Passwords are never recoverable from storage | 2 | security-agent | US-001 |

## Sprint 2: Sprint 2

Protected pages, logout and inactivity expiry are in place, and a signed-in user can see and add their own private tasks

Capacity: 20 points · Committed: 19

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-005 | Story | Log out from any page | 3 | backend-agent | US-004, US-008 |
| US-007 | Story | Sessions expire after inactivity | 5 | security-agent | US-004, US-005 |
| US-008 | Story | Signed-out visitors are redirected to login | 3 | frontend-agent | US-004 |
| US-009 | Story | See only my own tasks | 3 | backend-agent | US-008 |
| US-011 | Story | Add a task with a required title | 5 | backend-agent | US-009 |

## Sprint 3: Sprint 3

Full task management (edit, toggle, delete) with ownership enforced and tested on every endpoint, plus newest-first ordering and the All/Active/Completed filter

Capacity: 20 points · Committed: 19

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-010 | Story | Ownership is checked on every task action | 5 | backend-agent | US-009, US-012, US-013, US-014 |
| US-012 | Story | Edit a task's title | 3 | frontend-agent | US-011 |
| US-013 | Story | Toggle a task between completed and not completed | 3 | frontend-agent | US-011 |
| US-014 | Story | Delete a task after confirming | 3 | frontend-agent | US-011 |
| US-015 | Story | See my tasks newest-first on one page | 2 | backend-agent | US-011 |
| US-016 | Story | Filter by All, Active or Completed | 3 | frontend-agent | US-013, US-015 |

## Sprint 4: Sprint 4

Persistence verified, responsive phone and desktop layout, free-use confirmation, and setup and handover notes

Capacity: 20 points · Committed: 11

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-017 | Story | Tasks are saved server-side and survive refresh and re-login | 2 | qa-agent | US-011, US-012, US-013, US-005 |
| US-018 | Story | Use the task list on a phone or a desktop | 5 | frontend-agent | US-014, US-016 |
| US-019 | Story | Use the whole app without paying | 1 | qa-agent | US-011 |
| US-020 | Story | Hand over with setup and operating notes | 3 | devops-agent | US-007, US-010 |

## Unscheduled

_Nothing unscheduled._
<!-- sdlc:auto:end sprints -->
