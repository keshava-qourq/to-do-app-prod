# Planning

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### EPIC-001 · approved · source: planning:EPIC-001

Self-service sign-up and login with email and password for a single user role: the individual owner of a private task list.

Goal: account creation, sign-in, logout, secure password storage and session inactivity expiry.

Open assumptions (to be corrected if wrong):
- Sign-up explicitly discloses an already-registered email. This is an accepted usability trade-off over enumeration protection, since the app holds no sensitive data.
- Failed login uses one generic message.
- Minimum password length is 8 characters, with no other complexity rule.
- Email is case-insensitive for uniqueness and login.
- There is no password reset, email verification, social/SSO login or 2FA. A user who forgets their password needs manual database intervention by the operator.
- No outbound email is sent, so no email service or credential is needed.
- Personal data is limited to the email address.

Plan data:
- Story points: US-001=8, US-002=2, US-003=2, US-004=5, US-005=3, US-006=2, US-007=5. Total 27.
- Roles: backend-agent (US-001, US-002, US-004, US-005), frontend-agent (US-003), security-agent (US-006, US-007).
- Epic role is unassigned.
- US-001 is broken into 3 tasks (US-001-T1, US-001-T2, US-001-T3) with no points set.

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-007

### EPIC-002 · approved · source: planning:EPIC-002

Every to-do page requires a signed-in session. Every task read or write is scoped server-side to the session user.

Goal: protected pages and private, server-enforced task ownership.

Open assumptions:
- Tasks link to their owner by a foreign key in PostgreSQL, and every query filters on the session user. Hiding tasks in the UI alone is not sufficient.
- There is a single self-service role, with no admin, tenant or user-management console.
- There is no self-service account deletion. The data model is still expected to remove an account's tasks when the account is removed manually, so no orphaned personal data is left.

Plan data:
- Story points: US-008=3, US-009=3, US-010=5. Total 11.
- Roles: frontend-agent (US-008), backend-agent (US-009, US-010).
- Epic role is unassigned.

**Related:** US-008, US-009, US-010

### EPIC-003 · approved · source: planning:EPIC-003

Creating, editing, completing and deleting tasks. A task has exactly two attributes: a required title and a completed/not-completed state.

Goal: the core task lifecycle.

Open assumptions:
- Titles are trimmed, rejected if empty after trimming, and capped at 255 characters.
- New tasks start as not completed.
- Delete is a permanent hard delete after an in-page confirmation, with no undo, trash or archive.

Explicitly excluded: due dates, priorities, notes/descriptions, tags, subtasks, manual reordering and sharing.

Plan data:
- Story points: US-011=5, US-012=3, US-013=3, US-014=3. Total 14.
- Roles: backend-agent (US-011), frontend-agent (US-012, US-013, US-014).
- Epic role is unassigned.

**Related:** US-011, US-012, US-013, US-014

### EPIC-004 · approved · source: planning:EPIC-004

How the task list is presented on phone and desktop, how it is filtered, and the guarantee that tasks are stored server-side.

Goal: list presentation, filtering and persistence.

Open assumptions:
- Tasks are listed newest-first on a single page with no pagination, at a scale of hundreds of tasks per user.
- The All/Active/Completed filter is transient view state. It defaults to All and does not need to survive logout.
- Tasks are stored in PostgreSQL on the server, not in browser storage, so they survive a refresh, a new browser or a re-login.

Plan data:
- Story points: US-015=2, US-016=3, US-017=2, US-018=5. Total 12.
- Roles: backend-agent (US-015), frontend-agent (US-016, US-018), qa-agent (US-017).
- Epic role is unassigned.

**Related:** US-015, US-016, US-017, US-018

### EPIC-005 · approved · source: planning:EPIC-005

What is needed to stand the app up and hand it over, and confirmation that the app costs nothing to use.

Goal: free-use confirmation plus setup, configuration and operating handover notes.

Open assumptions:
- The app is entirely free, with no billing, paid plan, usage limit or payment provider. No payments epic exists.
- There are no third-party integrations or outbound email, so no API keys or third-party credentials are needed.
- Deployment is single-region, English-language and low scale (hundreds of users).
- No industry-specific regulation applies. Standard data hygiene is assumed, with personal data limited to email.
- There is no admin dashboard, user management, reporting or analytics. Operational tasks such as account removal are done manually against the database.

Plan data:
- Story points: US-019=1, US-020=3. Total 4.
- Roles: qa-agent (US-019), devops-agent (US-020).
- Epic role is unassigned.

**Related:** US-019, US-020

### SPRINT-1 · draft · source: plan:Sprint 1

Sprint 1 delivers account creation and login, with hashed passwords and explicit sign-up rejections for a duplicate or invalid email.

- Goal (verbatim): Users can create an account and log in, with hashed passwords and explicit sign-up rejections for a duplicate or invalid email.
- Capacity: 20.
- Plan status: generated, version 1 (not stated as approved).
- Story links are inferred from the goal wording; the plan does not assign items to sprints. Inferred stories: US-001, US-002, US-003, US-004, US-006, totalling 19 points. US-001 tasks T1 to T3 would fall here.
- Needs confirmation by the planner.

**Related:** EPIC-001, US-001, US-002, US-003, US-004, US-006

### SPRINT-2 · draft · source: plan:Sprint 2

Sprint 2 delivers protected pages, logout and inactivity expiry, and lets a signed-in user see and add their own private tasks.

- Goal (verbatim): Protected pages, logout and inactivity expiry are in place, and a signed-in user can see and add their own private tasks.
- Capacity: 20.
- Plan status: generated, version 1.
- Story links are inferred from the goal wording; the plan does not assign items to sprints. Inferred stories: US-005, US-007, US-008, US-009, US-011, totalling 19 points.
- Needs confirmation by the planner.

**Related:** EPIC-001, EPIC-002, EPIC-003, US-005, US-007, US-008, US-009, US-011

### SPRINT-3 · draft · source: plan:Sprint 3

Sprint 3 delivers full task management with ownership enforced and tested on every endpoint, plus newest-first ordering and the All/Active/Completed filter.

- Goal (verbatim): Full task management (edit, toggle, delete) with ownership enforced and tested on every endpoint, plus newest-first ordering and the All/Active/Completed filter.
- Capacity: 20.
- Plan status: generated, version 1.
- Story links are inferred from the goal wording; the plan does not assign items to sprints. Inferred stories: US-010, US-012, US-013, US-014, US-015, US-016, totalling 19 points.
- Needs confirmation by the planner.

**Related:** EPIC-002, EPIC-003, EPIC-004, US-010, US-012, US-013, US-014, US-015, US-016

### SPRINT-4 · draft · source: plan:Sprint 4

Sprint 4 covers persistence verification, the responsive phone and desktop layout, free-use confirmation, and setup and handover notes.

- Goal (verbatim): Persistence verified, responsive phone and desktop layout, free-use confirmation, and setup and handover notes.
- Capacity: 20.
- Plan status: generated, version 1.
- Story links are inferred from the goal wording; the plan does not assign items to sprints. Inferred stories: US-017, US-018, US-019, US-020, totalling 11 points.
- Needs confirmation by the planner.

**Related:** EPIC-004, EPIC-005, US-017, US-018, US-019, US-020
<!-- sdlc:auto:end narrative -->
