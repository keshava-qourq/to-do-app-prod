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
from app.schemas import SignupRequest, SignupResponse, UserOut
from app.security import hash_password

router = APIRouter()

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
