"""Shared dependencies: the session-token lookup other routers reuse."""

import hashlib
from datetime import UTC, datetime
from typing import Annotated

from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.orm import Session as DbSession

from app.database import get_db
from app.models import Session, User

_bearer = HTTPBearer(auto_error=False)


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def get_current_user(
    creds: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
    db: Annotated[DbSession, Depends(get_db)],
) -> User:
    """The user owning a live session token; 401 for anything else (fails closed)."""
    unauthorized = HTTPException(status_code=401, detail="Not authenticated")
    if creds is None or not creds.credentials:
        raise unauthorized
    row = db.scalar(select(Session).where(Session.token_hash == hash_token(creds.credentials)))
    if row is None or row.revoked_at is not None or row.expires_at <= datetime.now(UTC):
        raise unauthorized
    user = db.get(User, row.user_id)
    if user is None:
        raise unauthorized
    return user
