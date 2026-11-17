"""Startup seeding of the first user and the smoke-test user.

The app has no roles, so both are ordinary users. Each is created only when both of its
settings are present and no user with that email exists (idempotent); otherwise nothing
is seeded.
"""

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.config import settings
from app.models import User
from app.security import hash_password


def _ensure_user(db: Session, email: str, password: str) -> None:
    if not email or not password:
        return
    email = email.strip().lower()
    if db.scalar(select(User.id).where(func.lower(User.email) == email)) is not None:
        return
    db.add(User(email=email, password_hash=hash_password(password)))
    db.commit()


def seed_users(db: Session) -> None:
    _ensure_user(db, settings.bootstrap_admin_email, settings.bootstrap_admin_password)
    _ensure_user(db, settings.smoke_test_email, settings.smoke_test_password)
