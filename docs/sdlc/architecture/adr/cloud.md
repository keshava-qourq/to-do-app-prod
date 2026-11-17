<!-- sdlc:auto:start adr -->
# ADR-0004: Use AWS for Cloud

Status: Accepted  
Date: 2026-11-17

## Context and Problem Statement

Which Cloud technology does the project use? Decided in architecture v2.

## Considered Options

- AWS
- Azure
- GCP

## Decision Outcome

Chosen option: AWS, because One small region covers a static SPA origin, a small API container (ECS Fargate) and managed PostgreSQL (RDS) with encryption at rest, leaving room to grow if excluded features return.

## Consequences

Managed RDS and Fargate add a little fixed cost over a single VM but remove backup and patching toil for a small team.
<!-- sdlc:auto:end adr -->