"""POST /auth/signup."""

import secrets
from datetime import UTC, datetime, timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session as DbSession

from app.database import get_db
from app.deps import hash_token
from app.models import Session, User
from app.schemas import LoginRequest, SignupRequest, SignupResponse, UserOut
from app.security import hash_password, verify_password

router = APIRouter()

_DUMMY_HASH = hash_password("dummy-password-for-timing")


@router.post("/auth/login", response_model=SignupResponse)
def login(body: LoginRequest, db: Annotated[DbSession, Depends(get_db)]) -> SignupResponse:
    bad = HTTPException(status_code=401, detail="email or password is incorrect")
    email = body.email.strip().lower()
    user = db.scalar(select(User).where(func.lower(User.email) == email)) if email else None
    ok = verify_password(body.password, user.password_hash if user else _DUMMY_HASH)
    if user is None or not ok or not body.password.strip():
        raise bad
    token = secrets.token_urlsafe(32)
    db.add(
        Session(
            user_id=user.id,
            token_hash=hash_token(token),
            expires_at=datetime.now(UTC) + timedelta(days=SESSION_DAYS),
        )
    )
    db.commit()
    return SignupResponse(token=token, user=UserOut(id=user.id, email=user.email))


SESSION_DAYS = 30


@router.post("/auth/signup", status_code=201, response_model=SignupResponse)
def signup(body: SignupRequest, db: Annotated[DbSession, Depends(get_db)]) -> SignupResponse:
    conflict = HTTPException(status_code=409, detail="email_already_registered")
    if db.scalar(select(User.id).where(func.lower(User.email) == body.email)) is not None:
        raise conflict
    token = secrets.token_urlsafe(32)
    user = User(email=body.email, password_hash=hash_password(body.password))
    try:
        db.add(user)
        db.flush()
        db.add(
            Session(
                user_id=user.id,
                token_hash=hash_token(token),
                expires_at=datetime.now(UTC) + timedelta(days=SESSION_DAYS),
            )
        )
        db.commit()
    except IntegrityError:
        db.rollback()
        raise conflict from None
    return SignupResponse(token=token, user=UserOut(id=user.id, email=user.email))
