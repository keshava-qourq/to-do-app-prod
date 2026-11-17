"""POST /auth/login against the real PostgreSQL."""

import logging
import secrets

from fastapi.testclient import TestClient
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.deps import hash_token

GENERIC = {"detail": "email or password is incorrect"}


def _pw() -> str:
    return secrets.token_urlsafe(12)


def _signup(client: TestClient, email: str, password: str):
    return client.post("/auth/signup", json={"email": email, "password": password})


def _login(client: TestClient, email, password):
    return client.post("/auth/login", json={"email": email, "password": password})


def test_ac011_login_returns_token_that_lists_saved_tasks(client: TestClient, db_session: Session):
    pw = _pw()
    uid = _signup(client, "bob@example.com", pw).json()["user"]["id"]
    db_session.execute(text("insert into tasks (user_id, title) values (:u, 'saved')"), {"u": uid})
    db_session.commit()
    r = _login(client, "bob@example.com", pw)
    assert r.status_code == 200
    body = r.json()
    assert body["user"] == {"id": uid, "email": "bob@example.com"}
    assert "Set-Cookie" not in r.headers
    t = client.get("/tasks", headers={"Authorization": f"Bearer {body['token']}"})
    assert [x["title"] for x in t.json()] == ["saved"]
    assert db_session.execute(text("select count(*) from sessions")).scalar() == 2
    hashes = db_session.execute(text("select token_hash from sessions")).scalars().all()
    assert hash_token(body["token"]) in hashes and body["token"] not in hashes


def test_ac012_login_is_case_insensitive(client: TestClient):
    pw = _pw()
    uid = _signup(client, "bob@example.com", pw).json()["user"]["id"]
    r = _login(client, "  BOB@EXAMPLE.COM ", pw)
    assert r.status_code == 200 and r.json()["user"]["id"] == uid


def test_ac013_nfr004_identical_401_for_unknown_email_and_wrong_password(client: TestClient):
    _signup(client, "bob@example.com", _pw())
    a = _login(client, "nobody@example.com", _pw())
    b = _login(client, "bob@example.com", _pw())
    assert a.status_code == b.status_code == 401
    assert a.json() == b.json() == GENERIC
    assert dict(a.headers).keys() == dict(b.headers).keys()
    assert a.headers["content-length"] == b.headers["content-length"]


def test_ac013_empty_values_give_same_401(client: TestClient):
    _signup(client, "bob@example.com", _pw())
    for email, pw in [("", _pw()), ("bob@example.com", ""), ("  ", "  "), ("", "")]:
        r = _login(client, email, pw)
        assert r.status_code == 401 and r.json() == GENERIC


def test_login_missing_or_malformed_body_422_without_input(client: TestClient):
    for payload in [{}, {"email": "a@example.com"}, {"email": 5, "password": "secretvalue1"}]:
        r = client.post("/auth/login", json=payload)
        assert r.status_code == 422
        assert "input" not in r.text and "secretvalue1" not in r.text


def test_ac014_no_forgot_or_reset_endpoint(client: TestClient):
    paths = client.get("/openapi.json").json()["paths"]
    assert not any("forgot" in p or "reset" in p for p in paths)


def test_ac020_nfr001_password_absent_from_logs_and_responses(client: TestClient, caplog):
    pw = _pw()
    _signup(client, "bob@example.com", pw)
    wrong = _pw()
    with caplog.at_level(logging.DEBUG):
        r1 = _login(client, "bob@example.com", pw)
        r2 = _login(client, "bob@example.com", wrong)
        r3 = _login(client, "x@example.com", wrong)
    assert pw not in r1.text and wrong not in r2.text + r3.text
    assert pw not in caplog.text and wrong not in caplog.text
