"""Startup seeding: idempotent, case-insensitive, and silent without settings."""

import dataclasses
import secrets

import pytest
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app import seed
from app.models import User
from app.security import verify_password


def _count(db: Session) -> int:
    return db.scalar(select(func.count()).select_from(User))


def test_seeds_nothing_without_settings(db_session: Session, monkeypatch: pytest.MonkeyPatch):
    blank = dataclasses.replace(
        seed.settings,
        bootstrap_admin_email="",
        bootstrap_admin_password="",
        smoke_test_email="",
        smoke_test_password="",
    )
    monkeypatch.setattr(seed, "settings", blank)

    seed.seed_users(db_session)

    assert _count(db_session) == 0


def test_seeds_both_users_once(db_session: Session, monkeypatch: pytest.MonkeyPatch):
    admin_password = secrets.token_urlsafe()
    smoke_password = secrets.token_urlsafe()
    configured = dataclasses.replace(
        seed.settings,
        bootstrap_admin_email="Admin@example.com",
        bootstrap_admin_password=admin_password,
        smoke_test_email="smoke@example.com",
        smoke_test_password=smoke_password,
    )
    monkeypatch.setattr(seed, "settings", configured)

    seed.seed_users(db_session)
    seed.seed_users(db_session)

    assert _count(db_session) == 2
    admin = db_session.scalar(select(User).where(User.email == "admin@example.com"))
    assert admin is not None
    assert verify_password(admin_password, admin.password_hash)
