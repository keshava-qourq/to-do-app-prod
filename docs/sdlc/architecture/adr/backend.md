<!-- sdlc:auto:start adr -->
# ADR-0002: Use FastAPI 0.115 for Backend

Status: Accepted  
Date: 2026-11-17

## Context and Problem Statement

Which Backend technology does the project use? Decided in architecture v2.

## Considered Options

- FastAPI 0.115
- Django REST Framework
- Flask

## Decision Outcome

Chosen option: FastAPI 0.115, because Built-in Pydantic validation enforces email format, password length and the trimmed/required/255-char title rules in one layer, and a single dependency enforces the 'filter every task by the session user' rule the app depends on.

## Consequences

Server-side session store and token revocation must be implemented explicitly in PostgreSQL since no shared-origin cookie is available across the two origins.
<!-- sdlc:auto:end adr -->