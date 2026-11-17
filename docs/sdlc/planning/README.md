# Planning

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### EPIC-001 · approved · source: planning:EPIC-001

Account Creation and Sign-In: self-service sign-up and login with email and password for a single user role, the owner of a private task list.

Open assumptions carried forward, to be corrected if wrong:
- Sign-up discloses already-registered emails (accepted trade-off). Login errors stay generic.
- Minimum password length is 8, with no other complexity rule.
- Emails are case-insensitive for uniqueness and login.
- There is no password reset, email verification, social/SSO or 2FA. Forgotten passwords need manual operator intervention.
- No outbound email, so no email service or credential is needed.
- Personal data is limited to the email address.

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-007

### EPIC-002 · approved · source: planning:EPIC-002

Protected Pages and Private Data: every to-do page requires a signed-in session, and every task read or write is scoped server-side to the session user.

Open assumptions carried forward:
- Tasks are linked to their owner by a PostgreSQL foreign key, and every query filters on the session user. Hiding tasks in the UI alone is insufficient.
- There is a single role only: no admin, organisation/tenant or user-management console.
- There is no self-service account deletion screen. Removing an account record must remove its tasks.

**Related:** US-008, US-009, US-010

### EPIC-003 · approved · source: planning:EPIC-003

Task Management: creating, editing, completing and deleting tasks. A task has exactly two attributes: a required title and a completed state.

Open assumptions carried forward:
- Titles are trimmed, rejected if empty, and capped at 255 characters.
- New tasks start as not completed.
- Delete is a permanent hard delete after an in-page confirmation, with no undo, trash or archive.
- Excluded from tasks: due dates, priorities, notes/descriptions, tags, subtasks, manual reordering and sharing.

**Related:** US-011, US-012, US-013, US-014

### EPIC-004 · approved · source: planning:EPIC-004

Task List View, Filtering and Persistence: how the list is presented on phone and desktop, how it is filtered, and the guarantee that it is stored server-side.

Open assumptions carried forward:
- Tasks are listed newest-first on a single page, with no pagination, at hundreds of tasks per user.
- The All/Active/Completed filter is transient, defaults to All and is not kept across logout.
- Tasks live in PostgreSQL on the server, not in browser storage.

**Related:** US-015, US-016, US-017, US-018

### EPIC-005 · approved · source: planning:EPIC-005

Free Use, Setup and Handover: what is needed to stand the app up and hand it over, plus confirmation that it costs nothing to use.

Open assumptions carried forward:
- The app is entirely free: no billing, paid plan, usage limit or payment provider.
- No third-party integrations or outbound email, so no API keys or third-party credentials.
- Single-region, English-language deployment at low scale. No industry-specific regulatory regime applies, and personal data is limited to the email address.
- There is no admin dashboard, user management, reporting or analytics. Account removal is done manually against the database by the operator.
- No sprint plan was provided in the input.

**Related:** US-019, US-020
<!-- sdlc:auto:end narrative -->
