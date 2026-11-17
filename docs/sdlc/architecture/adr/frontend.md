<!-- sdlc:auto:start adr -->
# ADR-0001: Use React 19 for Frontend

Status: Accepted  
Date: 2026-11-17

## Context and Problem Statement

Which Frontend technology does the project use? Decided in architecture v2.

## Considered Options

- React 19
- Vue
- Svelte

## Decision Outcome

Chosen option: React 19, because The whole product is one interactive screen — add, inline-rename, toggle, delete-with-confirm, and filter without reloading — which React handles directly; one responsive codebase covers phone and desktop with no separate mobile build. The SPA stores the bearer token and sends it as Authorization on every call.

## Consequences

A SPA needs the token kept client-side and the API base URL injected via VITE_API_BASE_URL at deploy, rather than a same-origin cookie flow.
<!-- sdlc:auto:end adr -->