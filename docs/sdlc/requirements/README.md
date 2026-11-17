# Product Requirements

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
## Summary

### REQ-STACK · approved · source: requirements:technology-stack

The product owner approved the technology stack. It must be designed against exactly as listed, with no substitutions.

- Backend: FastAPI 0.115
  - Hashes passwords and holds a secure session cookie.
  - Filters every task query to the logged-in user in one layer.
  - Built-in request validation covers the title rules (required, trimmed, 255 characters) and rejects bad email formats without extra libraries.
  - It is the platform default, and nothing in the brief argued against it.
- Cloud: AWS
  - One small region, one web app, one database, no integrations.
  - Leaves room to grow without re-platforming if excluded features (password reset, email, sharing) return to scope.
  - It is the platform default.
- Database: PostgreSQL 16
  - Two tables: users and tasks.
  - Each task is tied to its owner by a foreign key, enforced in the database.
  - Deleting an account removes its tasks automatically.
  - Enforces one account per email, case-insensitively (Bob@x.com and bob@x.com cannot both register).
- Frontend: React 19
  - Suits one interactive screen with live list editing: add, rename inline, tick off, delete with confirmation, and filter All/Active/Completed without reloading.
  - The same code gives a responsive phone and desktop layout, with no separate mobile build.
  - It is the platform default.
- Conflict recorded (both versions kept):
  - The stack rationale and the in-scope capability list say the session is held in a secure cookie that expires after inactivity.
  - NFR-003 says the session mechanism is left to implementation. The web pages and the API are served from different web addresses, so a shared browser cookie cannot be assumed.

**Related:** REQ-SERVICES, NFR-003, NFR-005, NFR-006

### REQ-SERVICES · approved · source: requirements:technology-stack (Cloud: AWS)

The app runs on AWS as a small container for the API and a managed PostgreSQL database. It has no third-party integrations.

- Hosting:
  - AWS, single region.
  - A small container for the FastAPI API.
  - Managed PostgreSQL 16.
- Web front end: one React web app serving phone and desktop. It is served from a different web address than the API (per NFR-003).
- No integrations: no outbound email, no email delivery service, no payment provider and no third-party credentials.
- Deployment shape: single region, English language, low scale (hundreds of users).

**Related:** REQ-STACK, NFR-011

### REQ-SCOPE · approved · source: requirements:scope

The approved scope (version 1, lightweight delivery) covers email/password accounts, a private server-stored task list with add, edit, toggle, delete and filter, and handover notes. Recovery, collaboration, native apps, admin tools and richer task fields are excluded.

Delivery scope: lightweight. Requirements version: 1.

In scope:
- Email and password sign-up.
- Explicit sign-up rejection for an already-registered or invalid email.
- Email and password login.
- Logout available from any page.
- Login-protected to-do pages, with a redirect for signed-out visitors.
- A private task list showing only the signed-in user's own tasks.
- A server-side ownership check on every task action.
- Add a task with a required title.
- Edit a task's title.
- Toggle a task between completed and not completed.
- Delete a task after an in-page confirmation.
- Filter the list by All, Active or Completed.
- Tasks saved server-side and preserved across refresh and re-login.
- A responsive task list screen for phone and desktop.
- Setup and handover notes.
- Passwords stored only as salted hashes (bcrypt or argon2).
- Sign-in session kept in a secure cookie that expires after inactivity.
- Minimum password length of 8 characters.
- Case-insensitive email addresses for sign-up and login.
- A generic "email or password is incorrect" message on failed login.
- Tasks shown newest-first on a single page.
- Titles trimmed, rejected if empty, and capped at 255 characters.
- New tasks start as not completed.
- Delete is permanent, with no undo and no trash.
- The filter defaults to All and is not remembered after logout.
- No password reset or forgotten-password route.
- Entirely free: no billing, plans or usage limits.

Out of scope (do not design or build):
- Due dates, priorities, notes/descriptions, tags, subtasks and task reordering.
- Sharing tasks or lists, teams, and any collaboration features.
- Password reset/forgot-password, email verification, social/SSO login and two-factor authentication.
- Native mobile or desktop apps, offline use and push notifications.
- Admin dashboard, user management console, and reporting/analytics screens.

**Related:** REQ-FG-01, REQ-FG-02, REQ-FG-03, REQ-FG-04, REQ-FG-05

### REQ-FG-01 · approved · source: requirements:feature:Sign-up & login

Visitors create an account with an email and a password of at least 8 characters, and registered users log in. The group also covers form validation, explicit duplicate and invalid-email messages, a generic login failure message, no recovery link, and logout from every page.

- Create an account:
  - A signed-out visitor gives an email and a password of at least 8 characters.
  - The visitor is then signed in immediately and taken to their own empty task list.
- Sign-up form checks:
  - A blank email or password field is flagged as required, and no account is created.
  - A password under 8 characters is refused with an 'at least 8 characters' message.
  - Several problems with one submission are reported together on the same page.
- Email already taken:
  - Sign-up is refused with a plain 'already registered' message that points to the login page.
  - Matching is case-insensitive.
  - Nothing about the existing account is shown beyond the fact that it exists.
- Invalid email format:
  - An address with no @ or no domain is refused with an 'invalid format' message.
  - No account is created.
- Log in:
  - The user signs in with email and password and sees previously saved tasks.
  - The email is case-insensitive.
- Same message for any login failure: an unregistered email and a wrong password both produce exactly "email or password is incorrect".
- No password recovery link: the login page offers no forgotten-password or reset link.
- Log out from any page:
  - The control is reachable on every page, on phone and desktop.
  - Logging out ends the session and returns to the login page with a logged-out confirmation.

**Related:** NFR-001, NFR-002, NFR-004, NFR-006, NFR-014, NFR-015

### REQ-FG-02 · approved · source: requirements:feature:Protected pages

All to-do pages and task API calls require a valid session. Sessions expire after inactivity, and the server checks ownership on every task action.

- Signed-out visitors sent to login:
  - Opening a to-do page without a valid session shows no task content and redirects to login.
  - Task requests without a valid session are refused with no data returned.
  - This also holds after logout or when using the browser back button.
- Skip login when already signed in: a signed-in user opening the login or sign-up page goes to the task list.
- Session ends after inactivity:
  - After the configured inactivity period, the next page open or task action sends the user to login.
  - Continued use within the period keeps the session alive.
- Ownership checked on every action:
  - The server refuses reading, editing, completing or deleting another user's task.
  - It answers with not-found or forbidden and leaves the task untouched.

**Related:** NFR-003, NFR-005, NFR-013

### REQ-FG-03 · approved · source: requirements:feature:Task list

A private, newest-first, single-page task list with All/Active/Completed filtering. Tasks are stored on the server, and the layout is responsive on phone and desktop.

- Only my tasks:
  - The list contains only the signed-in user's tasks, under every filter.
  - A user with no tasks sees an empty-list message.
- Newest first on one page:
  - Tasks are ordered by creation, newest at the top.
  - New tasks appear at the top immediately.
  - There are no paging controls.
  - A plain message is shown when there are no tasks.
- Filter by All, Active or Completed:
  - The chosen control is shown as selected.
  - The page opens on All, and the selection is not remembered after logout.
- Tasks kept on the server:
  - Tasks and their completed states survive a refresh, logout and login, cleared browser storage, and another browser or device.
- Works on phone and desktop:
  - The add box, filters, titles and complete/edit/delete controls are visible and usable at phone width and adapt to desktop width.
  - Long titles wrap or truncate without breaking the layout or hiding controls.

**Related:** NFR-005, NFR-009, NFR-010, NFR-011, NFR-017

### REQ-FG-04 · approved · source: requirements:feature:Managing tasks

Users add tasks, edit titles, toggle completion and delete tasks after an in-page confirmation. The same title rules apply when adding and when editing.

- Add a task:
  - The user types a title and submits it.
  - The task is saved to the account and appears at the top as not completed.
  - The input box is cleared.
- Title rules (add and edit):
  - Surrounding spaces are removed.
  - An empty or spaces-only title is refused with a 'title is required' message.
  - A title over 255 characters is refused with a message stating the limit. It is never silently shortened.
- Edit a task title:
  - The new title is stored and shown, and the completed state is unchanged.
  - Cancelling leaves the original title on screen and in storage.
- Mark done or not done:
  - The task can be toggled any number of times, and each change survives a refresh.
  - Under the Active filter, a task just marked completed drops out of view.
- Delete after confirming:
  - An in-page confirmation names the task.
  - Confirming removes the task permanently. Cancelling leaves it unchanged.
  - No undo or trash is offered.

**Related:** NFR-005, NFR-006, NFR-016

### REQ-FG-05 · approved · source: requirements:feature:Setup & handover

The app is free throughout. Written notes cover setup, configuration, operator procedures and the agreed scope exclusions.

- Free to use throughout:
  - No pricing, plan, upgrade, trial or payment element appears anywhere.
  - No quota or usage limit applies.
  - No card or payment detail is requested at sign-up.
- Setup and configuration notes:
  - Install dependencies, create and migrate the database, and run the app end to end on a clean machine.
  - Every required setting is listed by name with its purpose, including the database connection and the session inactivity period.
  - Example values are placeholders such as <database-password>.
- Operating and scope notes:
  - State that there is no password reset route.
  - Give the manual operator steps to help a user who lost their password.
  - Give the manual steps to remove an account together with its tasks.
  - List the agreed exclusions so a future maintainer knows they were deliberate.

**Related:** NFR-008, NFR-012, NFR-015, NFR-007

### NFR-001 · approved · source: requirements:NFR-001

Security: passwords can never be read back from storage.

- Passwords are stored only as a salted one-way hash (bcrypt or argon2), never as plain text or in any reversible form.
- Two users with the same password have different stored values.
- A submitted password never appears in application logs, error reports or server responses.

**Related:** REQ-FG-01

### NFR-002 · approved · source: requirements:NFR-002

Security: the minimum password length is 8 characters.

- Sign-up accepts a password only if it has at least 8 characters.
- No other complexity rule applies.
- Target: at least 8 characters.

**Related:** REQ-FG-01

### NFR-003 · approved · source: requirements:NFR-003

Security: sessions end by themselves and cannot be reused.

- A session ends after a configured period of inactivity.
- Logging out ends the session immediately.
- Replaying an expired or ended session is rejected, and no task data is returned.
- The mechanism is left to implementation. The web pages and the API are served from different web addresses, so a shared browser cookie cannot be assumed.
- Conflict: the stack rationale and the capability list say 'secure session cookie'. Both versions are recorded.

**Related:** REQ-FG-02, REQ-STACK

### NFR-004 · approved · source: requirements:NFR-004

Security: a failed login never reveals whether an email is registered.

- An unregistered email and a wrong password both produce the identical message "email or password is incorrect".

**Related:** REQ-FG-01

### NFR-005 · approved · source: requirements:NFR-005

Privacy: tasks are only ever served to their owner.

- Every task read and write is filtered on the server by the signed-in user's identifier.
- Each task is tied to its owner in the database (foreign key).
- The app never relies on the screen to hide rows.
- A request for someone else's task returns no data and makes no change.

**Related:** REQ-FG-02, REQ-FG-03, REQ-FG-04

### NFR-006 · approved · source: requirements:NFR-006

Security: the server re-checks every input rule.

- The server enforces again: email format, the required and trimmed title, and the 255-character title limit.
- Requests that bypass the browser checks are still rejected.

**Related:** REQ-FG-01, REQ-FG-04

### NFR-007 · approved · source: requirements:NFR-007

Privacy: the email address is the only personal data held about a user.

- Only the email address is stored as personal data.
- Removing an account removes its tasks, leaving no orphaned personal data when an operator deletes an account on request.

**Related:** REQ-FG-05

### NFR-008 · approved · source: requirements:NFR-008

Compliance: no payment or card details are collected.

- The app is free throughout.
- No card or payment detail is ever requested or stored.
- No quota or paywall applies.

**Related:** REQ-FG-05

### NFR-009 · approved · source: requirements:NFR-009

Scalability: the single page stays usable at the expected volume.

- The single unpaginated task list and its server remain usable at the agreed scale.
- Target: hundreds of users, with hundreds of tasks per user.

**Related:** REQ-FG-03

### NFR-010 · approved · source: requirements:NFR-010

Usability: the app is comfortable to use on a phone screen.

- Every control is visible and operable at phone width without horizontal scrolling or zooming.
- The complete, edit and delete touch targets are large enough to hit reliably.
- Titles near 255 characters wrap or truncate without breaking the layout.

**Related:** REQ-FG-03

### NFR-011 · approved · source: requirements:NFR-011

Compatibility: one responsive web app, with no separate build.

- The same web app serves phone-width and desktop-width browsers.
- Single English-language, single-region deployment.
- No separate mobile build.

**Related:** REQ-FG-03, REQ-SERVICES

### NFR-012 · approved · source: requirements:NFR-012

Maintainability: settings are documented and changeable without code.

- Every required setting is listed by name with its purpose in the handover notes, including the database connection and the session inactivity period.
- Settings can be changed without altering code.
- Example values are placeholders such as <database-password>.

**Related:** REQ-FG-05

### NFR-013 · approved · source: requirements:NFR-013

Maintainability: every task action is tested for ownership.

- Each task read and write endpoint has an automated test proving that a non-owner cannot read or change the task.

**Related:** REQ-FG-02

### NFR-014 · approved · source: requirements:NFR-014

Security (accepted risk): sign-up reveals that an email is already registered.

- Sign-up deliberately says an address is already registered, which allows account enumeration.
- Accepted as a trade-off of clarity over protection, for a to-do app holding no sensitive data.
- Failed login still gives a single generic message.

**Related:** REQ-FG-01, NFR-004

### NFR-015 · approved · source: requirements:NFR-015

Availability (accepted risk): there is no self-service password recovery.

- There is no password reset or forgotten-password route.
- A user who forgets their password needs an operator to intervene manually against the database.
- Accepted for this version.

**Related:** REQ-FG-01, REQ-FG-05

### NFR-016 · approved · source: requirements:NFR-016

Usability (accepted risk): deleting a task cannot be undone.

- A confirmed delete is permanent: no undo, trash or archive.
- The in-page confirmation is the only protection against a mistaken delete.
- Accepted.

**Related:** REQ-FG-04

### NFR-017 · approved · source: requirements:NFR-017

Usability (accepted risk): the filter choice is not remembered.

- The All/Active/Completed selection is transient view state.
- It returns to All after logging out and back in.
- Accepted.

**Related:** REQ-FG-03
<!-- sdlc:auto:end narrative -->

<!-- sdlc:auto:start summary -->
**Requirements version:** v1  
**Delivery scope:** lightweight  
**Approved:** 2026-11-17

**Capabilities in scope:** Email and password sign-up, Explicit sign-up rejection for an already-registered or invalid email, Email and password login, Logout available from any page, Login-protected to-do pages with redirect for signed-out visitors, Private task list showing only the signed-in user's own tasks, Server-side ownership check on every task action, Add a task with a required title, Edit a task's title, Toggle a task between completed and not completed, Delete a task after an in-page confirmation, Filter the list by All, Active or Completed, Tasks saved server-side and preserved across refresh and re-login, Responsive task list screen for phone and desktop, Setup and handover notes for the app, Passwords stored only as salted hashes (bcrypt or argon2), Sign-in session kept in a secure cookie that expires after inactivity, Minimum password length of 8 characters, Email addresses treated as case-insensitive for sign-up and login, Generic "email or password is incorrect" message on failed login, Tasks shown newest-first on a single page, Task titles trimmed, rejected if empty, capped at 255 characters, New tasks start as not completed, Delete is permanent — no undo and no trash, Filter defaults to All and is not remembered after logout, No password reset or forgotten-password route, Entirely free to use — no billing, plans or usage limits

**Approved technology stack:**

| Layer | Choice | Rationale |
|---|---|---|
| backend | FastAPI | The server's real job is small but must be done strictly: hash passwords, hold a secure session cookie, and make sure every task query is filtered to the logged-in user rather than relying on the screen to hide things. FastAPI gives a clean place to enforce that one rule in one layer, and its built-in request validation covers your title rules (required, trimmed, 255 characters) and email-format rejection without extra libraries. It is the platform default and nothing you told me argues against it. |
| cloud | AWS | You need one small region, one web app, one database, no integrations — AWS covers that with a managed PostgreSQL and a small container for the API, and leaves you room to grow without re-platforming if the list of excluded features (password reset, email, sharing) ever comes back into scope. It is the platform default and nothing in your brief points elsewhere. |
| database | PostgreSQL | This matches the assumption already recorded for your project. Your data is two tables — users and tasks — with each task tied to its owner by a foreign key; PostgreSQL enforces that link in the database itself, so a user's tasks genuinely cannot be served to someone else, and deleting an account removes its tasks automatically as you asked. It also enforces one account per email case-insensitively, so Bob@x.com and bob@x.com cannot both register. |
| frontend | React | Your whole product is one interactive screen — a task list you add to, rename inline, tick off, delete with a confirmation, and filter by All/Active/Completed without the page reloading. React handles exactly that kind of live list editing, and the same code gives you the responsive layout you asked for on phone and desktop, so there is no separate mobile build. No assumption argued for anything else, and this is the platform default. |
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start epics -->
## EPIC-001: Account Creation and Sign-In

Self-service sign-up and login with email and password for a single user role: the individual owner of a private task list.

Open assumptions carried from the confirmed understanding, to be corrected if wrong:
- Sign-up deliberately discloses that an email address is already registered. This is a conscious, accepted trade-off of usability over account-enumeration protection, judged appropriate for a general-purpose to-do app holding no sensitive data. Failed LOGIN still uses a single generic message. Say so if you want login errors to be specific too.
- Minimum password length is 8 characters; no other complexity rule is assumed.
- Email addresses are treated case-insensitively for uniqueness and for login, so Bob@example.com and bob@example.com are the same account.
- There is NO password reset, forgotten-password route, email verification, social/SSO login or two-factor authentication. A user who forgets their password therefore cannot recover their account without manual intervention by whoever operates the database. Flag this now if it is unacceptable.
- No outbound email of any kind is sent, so no email delivery service or API credential is required.
- Personal data held about a user is limited to the email address.

### US-001: Sign up with email and password

**Priority:** critical

> As a new visitor, I want to create an account with my email address and a password, so that I can keep a private to-do list that is saved for me.

| ID | Given | When | Then |
|---|---|---|---|
| AC-001 | I am on the sign-up page and not signed in | I submit an email address that is not yet registered, in a valid format, together with a password of at least 8 characters | my account is created, I am signed in, and I am taken to my (empty) task list |
| AC-002 | I am on the sign-up page | I submit the form with the email field or the password field left blank | no account is created and the blank field is flagged with a message saying it is required |
| AC-003 | I am on the sign-up page | I submit a password shorter than 8 characters | no account is created and I see a message stating that the password must be at least 8 characters long |
| AC-004 | I have just created an account | I look at my task list | it contains no tasks and shows an empty-list message rather than any other user's tasks |

### US-002: Explicit rejection when the email is already registered

**Priority:** high

> As a new visitor, I want to be told plainly that my email address already has an account, so that I know to log in instead of creating a duplicate account.

| ID | Given | When | Then |
|---|---|---|---|
| AC-005 | an account already exists for bob@example.com | I submit the sign-up form with bob@example.com | no second account is created and I see an explicit message saying that this email address is already registered |
| AC-006 | an account already exists for bob@example.com | I submit the sign-up form with Bob@Example.com | it is treated as the same address, no account is created, and I see the same explicit already-registered message |
| AC-007 | I have been shown the already-registered message | I read the page | it points me to the login page, and it does not disclose the existing account's password or any other detail beyond the fact that the address is registered |

### US-003: Explicit rejection of an invalid email format

**Priority:** high

> As a new visitor, I want to be told when the address I typed is not a valid email address, so that I can correct my typing instead of guessing what went wrong.

| ID | Given | When | Then |
|---|---|---|---|
| AC-008 | I am on the sign-up page | I submit an address that is not a valid email format, such as one with no @ sign or no domain part | no account is created and I see an explicit message saying the email address format is invalid |
| AC-009 | I submit both an invalid email format and a password shorter than 8 characters | the form is validated | both problems are reported on the same page so I can fix them in one pass |
| AC-010 | email format validation passes in the browser | the same request reaches the server | the server re-validates the format and rejects an invalid address even if the browser check was bypassed |

### US-004: Log in with email and password

**Priority:** critical

> As a registered user, I want to log in with my email address and password, so that I can get back to my saved task list.

| ID | Given | When | Then |
|---|---|---|---|
| AC-011 | I have a registered account | I submit my correct email address and password on the login page | I am signed in and taken to my task list showing the tasks I saved previously |
| AC-012 | I registered as bob@example.com | I log in as BOB@EXAMPLE.COM with the correct password | I am signed in to the same account |
| AC-013 | I am on the login page | I submit an email address that is not registered, or a registered address with the wrong password | I am not signed in and I see the single generic message "email or password is incorrect", identical in both cases |
| AC-014 | I am on the login page | I look for a way to recover a forgotten password | no forgotten-password or reset link is offered, because password reset is out of scope for this version (open assumption: a user who forgets their password cannot self-recover) |

### US-005: Log out from any page

**Priority:** high

> As a signed-in user, I want a log-out control on every page of the app, so that I can end my session from wherever I am, including on a shared device.

| ID | Given | When | Then |
|---|---|---|---|
| AC-015 | I am signed in | I view any page of the app on either a phone or a desktop browser | a log-out control is reachable from that page |
| AC-016 | I am signed in | I choose log out | my session is ended and I am taken to the login page with a confirmation that I have been logged out |
| AC-017 | I have just logged out | I use the browser back button or paste the task-list address directly | the ended session is not accepted and I am sent to the login page instead of seeing any task |

### US-006: Passwords are never recoverable from storage

**Priority:** critical

> As a user, I want my password to be stored only in a form that cannot be read back, so that my password is not exposed if the database is ever seen by someone else.

| ID | Given | When | Then |
|---|---|---|---|
| AC-018 | an account has been created with a password | the stored user record is inspected directly in the database | no plain-text or reversibly encrypted password is present; only a salted one-way hash produced by bcrypt or argon2 is stored |
| AC-019 | two different users choose the same password | their stored password values are compared | the stored values differ, confirming a per-account salt |
| AC-020 | a password is submitted at sign-up or login | application logs, error reports and server responses are inspected | the password value appears in none of them |

### US-007: Sessions expire after inactivity

**Priority:** high

> As a user, I want my signed-in session to end by itself once I have been inactive for a while, so that an unattended browser does not leave my task list open to anyone who walks up to it.

| ID | Given | When | Then |
|---|---|---|---|
| AC-021 | I am signed in and then leave the app untouched for longer than the configured inactivity period | I next try to open a to-do page or act on a task | I am treated as signed out and sent to the login page |
| AC-022 | I am signed in and using the app | I keep acting within the inactivity period | my session stays valid and I am not interrupted |
| AC-023 | a session has expired or been ended by logging out | the same session identifier is replayed to the server | the server rejects it and returns no task data (open assumption: the session mechanism is left to implementation; the web pages and the API are served from different web addresses, so a browser cookie shared between them cannot be assumed) |
| AC-024 | the handover notes are read | the inactivity period is looked up | the configured value is stated there and can be changed without a code change |

## EPIC-002: Protected Pages and Private Data

Every to-do page requires a signed-in session, and every task read or write is scoped server-side to the session user.

Open assumptions carried from the confirmed understanding:
- Tasks are linked to their owning user by a foreign key in a PostgreSQL database, and every query filters on the session user. Hiding other users' tasks in the UI alone is not sufficient.
- There is a single role only: the self-service individual. There is no admin role, no organisation or tenant concept, and no user-management console.
- No self-service account deletion screen was agreed for this version. The data model is nevertheless expected to remove an account's tasks when the account record is removed, so that manual deletion on request leaves no orphaned personal data.

### US-008: Signed-out visitors are redirected to login

**Priority:** critical

> As a visitor who is not signed in, I want to be sent to the login page when I try to open a to-do page, so that no one can reach a task list without an account.

| ID | Given | When | Then |
|---|---|---|---|
| AC-025 | I have no valid session | I open any to-do page address directly in the browser | no task content is rendered and I am redirected to the login page |
| AC-026 | I have no valid session | a task request is sent to the server without a valid session | the server refuses it with an authentication error and returns no task data |
| AC-027 | I am already signed in | I open the login or sign-up page | I am taken to my task list rather than being asked to sign in again |

### US-009: See only my own tasks

**Priority:** critical

> As a signed-in user, I want my task list to contain only the tasks I created, so that my list stays private to me.

| ID | Given | When | Then |
|---|---|---|---|
| AC-028 | user A and user B each have tasks | user A opens the task list | only user A's tasks are returned and displayed, under any filter setting |
| AC-029 | user A is signed in | the server builds the task list response | the query is filtered by the session user's identifier rather than relying on the browser to hide other rows |
| AC-030 | user A has no tasks while user B has several | user A opens the task list | an empty-list message is shown and none of user B's tasks appear |

### US-010: Ownership is checked on every task action

**Priority:** critical

> As a user, I want the server to refuse any edit, toggle or delete of a task I do not own, so that another user cannot change or destroy my tasks by guessing an identifier.

| ID | Given | When | Then |
|---|---|---|---|
| AC-031 | user A is signed in and user B owns task X | a request is sent to edit the title of task X | the server refuses it with a not-found or forbidden response and task X is unchanged |
| AC-032 | user A is signed in and user B owns task X | a request is sent to toggle the completed state of task X | the server refuses it and task X's state is unchanged |
| AC-033 | user A is signed in and user B owns task X | a request is sent to delete task X | the server refuses it and task X still exists for user B |
| AC-034 | any task read or write endpoint | it is exercised in testing | each one is covered by a test proving a non-owner cannot read or change the task |

## EPIC-003: Task Management

Creating, editing, completing and deleting tasks. A task has exactly two attributes: a required title and a completed / not-completed state.

Open assumptions carried from the confirmed understanding:
- Titles are trimmed of surrounding whitespace, rejected if empty after trimming, and capped at 255 characters.
- New tasks start as not completed.
- Delete is a permanent hard delete after an in-page confirmation prompt. There is no undo and no trash or archive.

Explicitly excluded from a task in this version: due dates, priorities, notes or descriptions, tags, subtasks, manual reordering, and any sharing with another user.

### US-011: Add a task with a required title

**Priority:** critical

> As a signed-in user, I want to add a task by typing its title, so that I can capture something I need to do.

| ID | Given | When | Then |
|---|---|---|---|
| AC-035 | I am on my task list | I enter a title of between 1 and 255 characters and submit it | the task is saved to my account, appears at the top of the list as not completed, and the input is cleared ready for the next entry |
| AC-036 | I am on my task list | I submit an empty title, or a title consisting only of spaces | no task is created and I see a message saying the title is required |
| AC-037 | I type a title with leading and trailing spaces | the task is saved | the stored and displayed title has the surrounding whitespace removed |
| AC-038 | I submit a title longer than 255 characters | the server validates it | the task is rejected with a message stating the 255-character limit, and no truncated task is silently created |

### US-012: Edit a task's title

**Priority:** high

> As a signed-in user, I want to change the title of a task I already created, so that I can correct or reword it without deleting and retyping.

| ID | Given | When | Then |
|---|---|---|---|
| AC-039 | I own a task | I edit its title to a valid new value and save | the new title is stored and shown in the list, and the task's completed state is unchanged |
| AC-040 | I am editing a task title | I clear it to empty or to spaces only and save | the change is rejected with a title-is-required message and the previous title is retained |
| AC-041 | I am editing a task title | I cancel the edit | the original title remains unchanged in the list and in storage |
| AC-042 | I save an edited title with surrounding whitespace or more than 255 characters | the server validates it | the title is trimmed, and a title still over 255 characters after trimming is rejected with a message stating the limit |

### US-013: Toggle a task between completed and not completed

**Priority:** critical

> As a signed-in user, I want to mark a task completed and to un-complete it again, so that I can track what I have finished and correct mistakes.

| ID | Given | When | Then |
|---|---|---|---|
| AC-043 | I own a task that is not completed | I toggle it | it is stored as completed and shown in the list as completed |
| AC-044 | I own a task that is completed | I toggle it again | it is stored as not completed and shown as active again |
| AC-045 | I have toggled a task | I refresh the page | the task still shows the state I set, confirming the change was saved server-side |
| AC-046 | the Active filter is selected and I toggle a task to completed | the list refreshes | the task leaves the Active view, consistent with the selected filter |

### US-014: Delete a task after confirming

**Priority:** high

> As a signed-in user, I want to delete a task, but only after confirming in the page, so that I can clear out tasks I no longer need without losing one by a stray click.

| ID | Given | When | Then |
|---|---|---|---|
| AC-047 | I own a task | I choose delete | an in-page confirmation prompt appears naming the task, and nothing is deleted yet |
| AC-048 | the confirmation prompt is showing | I confirm | the task is permanently removed from storage and disappears from my list |
| AC-049 | the confirmation prompt is showing | I cancel or dismiss it | the task remains unchanged in my list and in storage |
| AC-050 | I have confirmed a delete | I look for a way to restore the task | none is offered, because the delete is permanent with no undo and no trash (open assumption carried from the confirmed understanding) |

## EPIC-004: Task List View, Filtering and Persistence

How the list is presented on phone and desktop, how it is filtered, and the guarantee that it is stored server-side.

Open assumptions carried from the confirmed understanding:
- Tasks are listed newest-first on a single page, with no pagination, at the expected scale of hundreds of tasks per user.
- The All / Active / Completed filter is transient view state. It defaults to All and does not need to survive a logout.
- Tasks live in a PostgreSQL database on the server, not in browser storage, so they survive a refresh, a new browser or a logout and login.

### US-015: See my tasks newest-first on one page

**Priority:** high

> As a signed-in user, I want my tasks listed with the most recently added first on a single page, so that what I just captured is where I expect it.

| ID | Given | When | Then |
|---|---|---|---|
| AC-051 | I have added several tasks at different times | I open my task list | the tasks appear in descending order of creation time, newest at the top |
| AC-052 | I add a new task | the list updates | the new task appears at the top of the list |
| AC-053 | I have hundreds of tasks | I open my task list | all of my tasks that match the current filter are shown on one page with no pagination control (open assumption: a single page is adequate at the agreed scale) |
| AC-054 | I have no tasks at all | I open my task list | a plain empty-state message is shown instead of an empty table |

### US-016: Filter by All, Active or Completed

**Priority:** high

> As a signed-in user, I want to switch the list between All, Active and Completed, so that I can focus on what is left to do or review what I have finished.

| ID | Given | When | Then |
|---|---|---|---|
| AC-055 | I am on my task list | the page first loads | the All filter is selected and every one of my tasks is shown |
| AC-056 | I have both completed and not-completed tasks | I select Active | only my not-completed tasks are listed and the Active control is shown as selected |
| AC-057 | I have both completed and not-completed tasks | I select Completed | only my completed tasks are listed and the Completed control is shown as selected |
| AC-058 | I have selected Active and then log out and log back in | my task list loads | the filter is back to All, because the selection is transient view state that need not survive logout (open assumption carried from the confirmed understanding) |

### US-017: Tasks are saved server-side and survive refresh and re-login

**Priority:** critical

> As a signed-in user, I want my tasks kept on the server rather than in my browser, so that they are still there after a refresh, a logout or a move to another device.

| ID | Given | When | Then |
|---|---|---|---|
| AC-059 | I have added, edited and completed some tasks | I refresh the page | every task and its completed state is exactly as I left it |
| AC-060 | I have tasks saved | I log out and log back in | the same tasks with the same states are listed again |
| AC-061 | I have tasks saved | I sign in from a different browser or device with the same account | the same tasks are listed, confirming they are not held only in local browser storage |
| AC-062 | browser storage for the site is cleared | I sign in again | my tasks are still present |

### US-018: Use the task list on a phone or a desktop

**Priority:** high

> As a signed-in user, I want the task list to lay out usably on a small phone screen and on a wide desktop screen, so that I can manage my tasks wherever I am without a native app.

| ID | Given | When | Then |
|---|---|---|---|
| AC-063 | I open the task list on a phone-width screen | the page renders | the add field, the filter controls, each task title and its complete/edit/delete controls are all visible and operable without horizontal scrolling or zooming |
| AC-064 | I open the same page on a desktop-width screen | the page renders | the layout adapts to the wider screen and all the same controls remain available |
| AC-065 | I am on a touch screen | I tap the complete, edit or delete control on a task | the intended control is activated, with targets large enough to hit reliably |
| AC-066 | a long task title near the 255-character limit | it is shown on a phone-width screen | it wraps or truncates within the layout without breaking the page or hiding the task's controls |

## EPIC-005: Free Use, Setup and Handover

What is needed to stand the app up and hand it over, and the confirmation that it costs nothing to use.

Open assumptions carried from the confirmed understanding:
- The app is entirely free: no billing, no paid plan, no usage limit and no payment provider integration. No epic is written for payments because none exists in this product.
- No third-party integrations and no outbound email, so no email delivery service, API key or third-party credential is needed.
- Single-region, English-language deployment at low scale (hundreds of users). No industry-specific regulatory regime applies; standard data hygiene is assumed, with personal data limited to the email address.
- No admin dashboard, user-management console, reporting or analytics screen is in scope, so operational tasks such as removing an account are performed manually against the database by whoever operates the app.

### US-019: Use the whole app without paying

**Priority:** medium

> As a user, I want every feature available at no cost, so that I am never blocked or asked for payment while managing my tasks.

| ID | Given | When | Then |
|---|---|---|---|
| AC-067 | I am using any page of the app | I look at the interface | there is no pricing, plan, upgrade, trial or payment element anywhere |
| AC-068 | I have added a large number of tasks | I add another | it is accepted with no quota, usage limit or paywall applied |
| AC-069 | I sign up | I complete the sign-up form | no payment or card detail is requested or stored |

### US-020: Hand over with setup and operating notes

**Priority:** medium

> As a person who will run or take over this app, I want written notes covering how to set it up, configure it and operate it, so that I can deploy it and support users without reverse-engineering the code.

| ID | Given | When | Then |
|---|---|---|---|
| AC-070 | the handover notes | I follow them on a clean machine | I can install dependencies, create and migrate the PostgreSQL database, and run the app locally end to end |
| AC-071 | the handover notes | I read the configuration section | every required setting is listed by name with its purpose, including the database connection and the session inactivity period, and all example values are placeholders such as <database-password> rather than real-looking credentials |
| AC-072 | the handover notes | I read the operating section | it states that there is no password reset route and describes the manual steps an operator must take to help a user who has lost their password, and the manual steps to remove an account along with its tasks |
| AC-073 | the handover notes | I read the scope section | it lists the agreed exclusions for this version (password reset, email verification, social/SSO login, two-factor authentication, due dates, priorities, notes, tags, subtasks, reordering, sharing, admin dashboard and analytics, native apps, offline use and push notifications) so a future maintainer knows they were deliberate |
<!-- sdlc:auto:end epics -->
