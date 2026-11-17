"""Acceptance checks for login against the real PostgreSQL."""

import logging
import secrets

from fastapi.testclient import TestClient
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.security import hash_password

GENERIC = {"detail": "email or password is incorrect"}


def _pw() -> str:
    return secrets.token_urlsafe(12)


def _login(client: TestClient, email: str, password: str):
    return client.post("/auth/login", json={"email": email, "password": password})


def _insert_user(db: Session, email: str, password: str) -> int:
    uid = db.execute(
        text("insert into users (email, password_hash) values (:e, :h) returning id"),
        {"e": email, "h": hash_password(password)},
    ).scalar()
    db.commit()
    return uid


def test_ac011_login_lists_exactly_db_inserted_tasks(client: TestClient, db_session: Session):
    pw = _pw()
    uid = _insert_user(db_session, "ac011@example.com", pw)
    other = _insert_user(db_session, "other011@example.com", _pw())
    for u, t in [(uid, "one"), (uid, "two"), (other, "not mine")]:
        db_session.execute(
            text("insert into tasks (user_id, title) values (:u, :t)"), {"u": u, "t": t}
        )
    db_session.commit()
    r = _login(client, "ac011@example.com", pw)
    assert r.status_code == 200
    tasks = client.get("/tasks", headers={"Authorization": f"Bearer {r.json()['token']}"}).json()
    assert sorted(t["title"] for t in tasks) == ["one", "two"]


def test_ac012_uppercase_email_same_user_id(client: TestClient, db_session: Session):
    pw = _pw()
    uid = _insert_user(db_session, "ac012@example.com", pw)
    r = _login(client, "AC012@EXAMPLE.COM", pw)
    assert r.status_code == 200 and r.json()["user"]["id"] == uid


def test_ac013_nfr004_unknown_email_and_wrong_password_identical(
    client: TestClient, db_session: Session
):
    _insert_user(db_session, "ac013@example.com", _pw())
    a = _login(client, "ghost@example.com", _pw())
    b = _login(client, "ac013@example.com", _pw())
    assert a.status_code == b.status_code == 401
    assert a.json() == b.json() == GENERIC
    assert a.text == b.text


def test_ac020_password_absent_from_login_responses_and_logs(
    client: TestClient, db_session: Session, caplog
):
    caplog.set_level(logging.DEBUG)
    pw = _pw()
    wrong = _pw()
    _insert_user(db_session, "ac020@example.com", pw)
    ok = _login(client, "ac020@example.com", pw)
    bad = _login(client, "ac020@example.com", wrong)
    unk = _login(client, "ghost020@example.com", wrong)
    missing = client.post("/auth/login", json={"password": wrong})
    assert ok.status_code == 200 and bad.status_code == 401 and unk.status_code == 401
    assert missing.status_code == 422
    for r in (ok, bad, unk, missing):
        assert pw not in r.text and wrong not in r.text
    assert pw not in caplog.text and wrong not in caplog.text


def test_nfr007_only_email_personal_data(db_session: Session):
    cols = {
        r[0]
        for r in db_session.execute(
            text("select column_name from information_schema.columns where table_name='users'")
        )
    }
    assert cols == {"id", "email", "password_hash", "created_at"}
