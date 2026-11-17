# Tests

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start summary -->
68 tests · Passed 68 · Failed 0 · Skipped 0 · Not run 0

Acceptance criteria covered: 17/73 · passing: 17/73
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start tests -->
## Sprint 1

### US-001: Sign up with email and password

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-001 | Signup > [AC-001] network error shows generic message and re-enables form | Unit | Passed | `frontend/src/screens/Signup.test.tsx` |
| AC-001 | Signup > [AC-001] posts, stores token and navigates | Unit | Passed | `frontend/src/screens/Signup.test.tsx` |
| AC-001 | Signup > [AC-001] submitting disables button and prevents double submit | Unit | Passed | `frontend/src/screens/Signup.test.tsx` |
| AC-002 | Signup > [AC-002] blank fields show required messages, no request | Unit | Passed | `frontend/src/screens/Signup.test.tsx` |
| AC-003 | Signup > [AC-003] server 422 on password shows length message | Unit | Passed | `frontend/src/screens/Signup.test.tsx` |
| AC-003 | Signup > [AC-003] short password blocked, no request | Unit | Passed | `frontend/src/screens/Signup.test.tsx` |
| AC-005, AC-006, AC-007 | Signup > [AC-005] [AC-006] [AC-007] 409 shows registered message and login control | Unit | Passed | `frontend/src/screens/Signup.test.tsx` |
| AC-008 | Signup > [AC-008] bad email format blocked, no request | Unit | Passed | `frontend/src/screens/Signup.test.tsx` |
| AC-008 | Signup > [AC-008] server 422 on email shows format message | Unit | Passed | `frontend/src/screens/Signup.test.tsx` |
| AC-009 | Signup > [AC-009] both messages at once | Unit | Passed | `frontend/src/screens/Signup.test.tsx` |
| AC-004 | Tasks > [AC-004] 401 clears token and goes to login | Unit | Passed | `frontend/src/screens/Tasks.test.tsx` |
| AC-004 | Tasks > [AC-004] renders tasks from GET /tasks | Unit | Passed | `frontend/src/screens/Tasks.test.tsx` |
| AC-004 | Tasks > [AC-004] shows empty message for a new account | Unit | Passed | `frontend/src/screens/Tasks.test.tsx` |
| AC-004 | test_ac004_no_task_leak_between_accounts | Integration | Passed | `backend/tests/acceptance/test_signup_acceptance.py` |
| AC-010, NFR-006 | test_ac010_nfr006_invalid_email_422_no_row | Integration | Passed | `backend/tests/acceptance/test_signup_acceptance.py` |
| AC-018, AC-019, NFR-001 | test_ac018_ac019_nfr001_bcrypt_hash_and_salt | Integration | Passed | `backend/tests/acceptance/test_signup_acceptance.py` |
| AC-020 | test_ac020_password_absent_from_422_409_and_logs | Integration | Passed | `backend/tests/acceptance/test_signup_acceptance.py` |
| NFR-002 | test_nfr002_password_length_boundary | Integration | Passed | `backend/tests/acceptance/test_signup_acceptance.py` |
| NFR-007 | test_nfr007_deleting_user_removes_tasks_and_sessions | Integration | Passed | `backend/tests/acceptance/test_signup_acceptance.py` |
| AC-001, AC-004 | test_ac001_ac004_signup_creates_user_and_session_and_token_lists_tasks | Integration | Passed | `backend/tests/integration/test_signup.py` |
| AC-002 | test_ac002_blank_or_missing_fields_422 | Integration | Passed | `backend/tests/integration/test_signup.py` |
| AC-003 | test_ac003_short_password_422 | Integration | Passed | `backend/tests/integration/test_signup.py` |
| AC-004 | test_ac004_tasks_only_of_session_user | Integration | Passed | `backend/tests/integration/test_signup.py` |
| AC-005, AC-006, AC-007 | test_ac005_ac006_ac007_duplicate_email_409 | Integration | Passed | `backend/tests/integration/test_signup.py` |
| AC-006 | test_ac006_unique_index_on_lower_email | Integration | Passed | `backend/tests/integration/test_signup.py` |
| AC-008 | test_ac008_bad_email_format_422 | Integration | Passed | `backend/tests/integration/test_signup.py` |
| AC-009 | test_ac009_both_errors_listed | Integration | Passed | `backend/tests/integration/test_signup.py` |
| AC-018, AC-019 | test_ac018_ac019_password_hashed_with_salt | Integration | Passed | `backend/tests/integration/test_signup.py` |
| AC-020 | test_ac020_password_absent_from_422_and_logs | Integration | Passed | `backend/tests/integration/test_signup.py` |
| — | test_long_password_does_not_500 | Integration | Passed | `backend/tests/integration/test_signup.py` |
| NFR-007 | test_nfr007_cascade_delete | Integration | Passed | `backend/tests/integration/test_signup.py` |
| — | test_session_token_401_cases | Integration | Passed | `backend/tests/integration/test_signup.py` |
| AC-001, AC-004 | [AC-001] [AC-004] new email signs up, lands on task list with empty message | E2E | Passed | `frontend/e2e/signup.spec.ts` |
| AC-002 | [AC-002] blank email and password show required messages | E2E | Passed | `frontend/e2e/signup.spec.ts` |
| AC-003 | [AC-003] 7-character password shows length message | E2E | Passed | `frontend/e2e/signup.spec.ts` |
| AC-004 | [AC-004] fresh account via API sees empty tasks over the API | E2E | Passed | `frontend/e2e/signup.spec.ts` |
| AC-005, AC-006, AC-007 | [AC-005] [AC-006] [AC-007] duplicate email, exact and different case | E2E | Passed | `frontend/e2e/signup.spec.ts` |
| AC-008 | [AC-008] bad email format shows format message | E2E | Passed | `frontend/e2e/signup.spec.ts` |
| AC-009 | [AC-009] bad email and short password show both messages | E2E | Passed | `frontend/e2e/signup.spec.ts` |

### US-004: Log in with email and password

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-011 | Login > [AC-011] network error shows generic message and re-enables button | Unit | Passed | `frontend/src/screens/Login.test.tsx` |
| AC-011 | Login > [AC-011] posts, stores token and navigates to tasks | Unit | Passed | `frontend/src/screens/Login.test.tsx` |
| AC-011 | Login > [AC-011] sign up link navigates to signup | Unit | Passed | `frontend/src/screens/Login.test.tsx` |
| AC-011 | Login > [AC-011] submitting disables button and prevents double submit | Unit | Passed | `frontend/src/screens/Login.test.tsx` |
| AC-012 | Login > [AC-012] email is sent as typed | Unit | Passed | `frontend/src/screens/Login.test.tsx` |
| AC-013 | Login > [AC-013] 401 shows the generic message, password not echoed | Unit | Passed | `frontend/src/screens/Login.test.tsx` |
| AC-014 | Login > [AC-014] no forgot, reset or recover text | Unit | Passed | `frontend/src/screens/Login.test.tsx` |
| AC-011 | test_ac011_login_lists_exactly_db_inserted_tasks | Integration | Passed | `backend/tests/acceptance/test_login_acceptance.py` |
| AC-012 | test_ac012_uppercase_email_same_user_id | Integration | Passed | `backend/tests/acceptance/test_login_acceptance.py` |
| AC-013, NFR-004 | test_ac013_nfr004_unknown_email_and_wrong_password_identical | Integration | Passed | `backend/tests/acceptance/test_login_acceptance.py` |
| AC-020 | test_ac020_password_absent_from_login_responses_and_logs | Integration | Passed | `backend/tests/acceptance/test_login_acceptance.py` |
| NFR-007 | test_nfr007_only_email_personal_data | Integration | Passed | `backend/tests/acceptance/test_login_acceptance.py` |
| AC-011 | test_ac011_login_returns_token_that_lists_saved_tasks | Integration | Passed | `backend/tests/integration/test_login.py` |
| AC-012 | test_ac012_login_is_case_insensitive | Integration | Passed | `backend/tests/integration/test_login.py` |
| AC-013 | test_ac013_empty_values_give_same_401 | Integration | Passed | `backend/tests/integration/test_login.py` |
| AC-013, NFR-004 | test_ac013_nfr004_identical_401_for_unknown_email_and_wrong_password | Integration | Passed | `backend/tests/integration/test_login.py` |
| AC-014 | test_ac014_no_forgot_or_reset_endpoint | Integration | Passed | `backend/tests/integration/test_login.py` |
| AC-020, NFR-001 | test_ac020_nfr001_password_absent_from_logs_and_responses | Integration | Passed | `backend/tests/integration/test_login.py` |
| — | test_login_missing_or_malformed_body_422_without_input | Integration | Passed | `backend/tests/integration/test_login.py` |
| AC-011 | [AC-011] logged-out user logs in and lands on the task list | E2E | Passed | `frontend/e2e/login.spec.ts` |
| AC-012 | [AC-012] upper-cased email reaches the same account | E2E | Passed | `frontend/e2e/login.spec.ts` |
| AC-013, NFR-004 | [AC-013] [NFR-004] unknown email and wrong password show the same message | E2E | Passed | `frontend/e2e/login.spec.ts` |
| AC-014 | [AC-014] login page has no forgot-password or reset link | E2E | Passed | `frontend/e2e/login.spec.ts` |

## Project setup

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| — | test_seeds_both_users_once | Unit | Passed | `backend/tests/unit/test_seed.py` |
| — | test_seeds_nothing_without_settings | Unit | Passed | `backend/tests/unit/test_seed.py` |
| — | App > renders a screen inside the app shell and shows its menu | Unit | Passed | `frontend/src/App.test.tsx` |
| — | test_health_reports_ok | Integration | Passed | `backend/tests/integration/test_health.py` |
| — | test_the_openapi_document_builds | Integration | Passed | `backend/tests/integration/test_health.py` |
| — | the app loads | E2E | Passed | `frontend/e2e/example.spec.ts` |
<!-- sdlc:auto:end tests -->
