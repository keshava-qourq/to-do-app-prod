"""Test fixtures: the real PostgreSQL the sandbox runs (DATABASE_URL), migrated once per
run and emptied before every test, so a row one test writes is never seen by the next.

Models use PostgreSQL types (citext, uuid), so there is no SQLite stand-in.
"""

from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import SessionLocal, engine, get_db
from app.main import app
from app.migrate import upgrade_to_head


@pytest.fixture(scope="session", autouse=True)
def _migrated() -> None:
    upgrade_to_head()


@pytest.fixture
def db_session(_migrated: None) -> Iterator[Session]:
    """A session on an empty database; tables are truncated before the test runs."""
    with engine.begin() as conn:
        conn.execute(text("TRUNCATE users, sessions, tasks RESTART IDENTITY CASCADE"))
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client(db_session: Session) -> Iterator[TestClient]:
    """The application, talking to this test's database and nothing else."""

    def _get_db() -> Iterator[Session]:
        yield db_session

    app.dependency_overrides[get_db] = _get_db
    try:
        yield TestClient(app)
    finally:
        app.dependency_overrides.clear()
