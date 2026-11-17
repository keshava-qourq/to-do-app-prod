"""Database engine, session factory and declarative base.

`DATABASE_URL` is a SQLAlchemy URL for PostgreSQL (postgresql+psycopg://...). The
fallback is a local Postgres matching docker-compose.yml. The schema changes only through
Alembic migrations (backend/alembic), which run on application startup.
"""

import os
from collections.abc import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg://app@localhost:5432/app")

engine = create_engine(DATABASE_URL, pool_pre_ping=True, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    """Declarative base that every model inherits."""


def get_db() -> Iterator[Session]:
    """One session per request, closed even when the handler raises."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
