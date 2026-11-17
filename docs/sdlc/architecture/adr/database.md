<!-- sdlc:auto:start adr -->
# ADR-0003: Use PostgreSQL 16 for Database

Status: Accepted  
Date: 2026-11-17

## Context and Problem Statement

Which Database technology does the project use? Decided in architecture v2.

## Considered Options

- PostgreSQL 16
- MySQL
- SQLite

## Decision Outcome

Chosen option: PostgreSQL 16, because Two tables with a task-to-owner foreign key; the database itself enforces ownership and cascade-deletes a user's tasks, and citext (or a lower(email) unique index) enforces one account per email case-insensitively.

## Consequences

A relational database is slightly heavier than a file store but needed for the enforced ownership guarantee and concurrent access at the expected scale.
<!-- sdlc:auto:end adr -->