"""Sign-up and GET /tasks against the real PostgreSQL."""

import logging
import secrets
from datetime import UTC, datetime, timedelta

from fastapi.testclient import TestClient
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.deps import hash_token


def _pw() -> str:
    return secrets.token_urlsafe(12)


def _signup(client: TestClient, email: str, password: str):
    return client.post("/auth/signup", json={"email": email, "password": password})


def _auth(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def test_ac001_ac004_signup_creates_user_and_session_and_token_lists_tasks(
    client: TestClient, db_session: Session
):
    r = _signup(client, "bob@example.com", _pw())
    assert r.status_code == 201
    body = r.json()
    assert body["user"]["email"] == "bob@example.com"
    assert isinstance(body["user"]["id"], int)
    assert "Set-Cookie" not in r.headers
    assert db_session.execute(text("select count(*) from sessions")).scalar() == 1
    t = client.get("/tasks", headers=_auth(body["token"]))
    assert t.status_code == 200
    assert t.json() == []
    stored = db_session.execute(text("select token_hash from sessions")).scalar()
    assert stored == hash_token(body["token"]) and stored != body["token"]


def test_ac004_tasks_only_of_session_user(client: TestClient, db_session: Session):
    a = _signup(client, "a@example.com", _pw()).json()
    b = _signup(client, "b@example.com", _pw()).json()
    db_session.execute(
        text("insert into tasks (user_id, title) values (:a, 'mine'), (:b, 'theirs')"),
        {"a": a["user"]["id"], "b": b["user"]["id"]},
    )
    db_session.commit()
    rows = client.get("/tasks", headers=_auth(a["token"])).json()
    assert [r["title"] for r in rows] == ["mine"]
    assert set(rows[0]) == {"id", "title", "completed", "created_at"}


def test_ac002_blank_or_missing_fields_422(client: TestClient):
    for payload, field in [
        ({"email": "", "password": _pw()}, "email"),
        ({"email": "   ", "password": _pw()}, "email"),
        ({"password": _pw()}, "email"),
        ({"email": "a@example.com", "password": " " * 10}, "password"),
        ({"email": "a@example.com", "password": ""}, "password"),
        ({"email": "a@example.com"}, "password"),
    ]:
        r = client.post("/auth/signup", json=payload)
        assert r.status_code == 422
        assert any(e["loc"][-1] == field for e in r.json()["detail"])


def test_ac003_short_password_422(client: TestClient):
    r = _signup(client, "a@example.com", "1234567")
    assert r.status_code == 422
    errs = [e for e in r.json()["detail"] if e["loc"][-1] == "password"]
    assert errs and "password must be at least 8 characters long" in errs[0]["msg"]
    assert _signup(client, "a@example.com", "12345678").status_code == 201


def test_ac005_ac006_ac007_duplicate_email_409(client: TestClient, db_session: Session):
    assert _signup(client, "bob@example.com", _pw()).status_code == 201
    r = _signup(client, "  Bob@Example.com ", _pw())
    assert r.status_code == 409
    assert r.json() == {"detail": "email_already_registered"}
    assert db_session.execute(text("select count(*) from users")).scalar() == 1


def test_ac006_unique_index_on_lower_email(client: TestClient, db_session: Session):
    assert _signup(client, "bob@example.com", _pw()).status_code == 201
    idx = (
        db_session.execute(text("select indexdef from pg_indexes where tablename='users'"))
        .scalars()
        .all()
    )
    assert any("lower" in i and "UNIQUE" in i for i in idx)


def test_ac008_bad_email_format_422(client: TestClient):
    for bad in ["nope", "a@", "a@b", "@example.com"]:
        r = _signup(client, bad, _pw())
        assert r.status_code == 422
        assert any(e["loc"] == ["body", "email"] for e in r.json()["detail"])


def test_ac009_both_errors_listed(client: TestClient):
    r = _signup(client, "nope", "short")
    assert r.status_code == 422
    locs = {e["loc"][-1] for e in r.json()["detail"]}
    assert locs == {"email", "password"}


def test_ac018_ac019_password_hashed_with_salt(client: TestClient, db_session: Session):
    pw = _pw()
    _signup(client, "a@example.com", pw)
    _signup(client, "b@example.com", pw)
    hashes = db_session.execute(text("select password_hash from users")).scalars().all()
    assert all(h.startswith("$2") and pw not in h for h in hashes)
    assert hashes[0] != hashes[1]
    cols = (
        db_session.execute(
            text("select column_name from information_schema.columns where table_name='users'")
        )
        .scalars()
        .all()
    )
    assert set(cols) == {"id", "email", "password_hash", "created_at"}


def test_ac020_password_absent_from_422_and_logs(client: TestClient, caplog):
    pw = "x" + secrets.token_urlsafe(10)
    with caplog.at_level(logging.DEBUG):
        r = _signup(client, "nope", pw[:7])
        r2 = _signup(client, "nope", pw)
    assert r.status_code == 422
    for resp in (r, r2):
        assert pw[:7] not in resp.text
        assert "input" not in resp.text and "ctx" not in resp.text
    assert pw[:7] not in caplog.text


def test_long_password_does_not_500(client: TestClient):
    assert _signup(client, "long@example.com", "a" * 200).status_code == 201


def test_nfr007_cascade_delete(client: TestClient, db_session: Session):
    u = _signup(client, "a@example.com", _pw()).json()
    db_session.execute(
        text("insert into tasks (user_id, title) values (:u, 't')"), {"u": u["user"]["id"]}
    )
    db_session.commit()
    db_session.execute(text("delete from users"))
    db_session.commit()
    assert db_session.execute(text("select count(*) from sessions")).scalar() == 0
    assert db_session.execute(text("select count(*) from tasks")).scalar() == 0


def test_session_token_401_cases(client: TestClient, db_session: Session):
    token = _signup(client, "a@example.com", _pw()).json()["token"]
    assert client.get("/tasks").status_code == 401
    assert client.get("/tasks", headers=_auth("unknown")).status_code == 401
    assert client.get("/tasks", headers=_auth("shared-api-secret")).status_code == 401
    db_session.execute(
        text("update sessions set expires_at = :t"), {"t": datetime.now(UTC) - timedelta(minutes=1)}
    )
    db_session.commit()
    assert client.get("/tasks", headers=_auth(token)).status_code == 401
    db_session.execute(
        text("update sessions set expires_at = :t, revoked_at = now()"),
        {"t": datetime.now(UTC) + timedelta(days=1)},
    )
    db_session.commit()
    assert client.get("/tasks", headers=_auth(token)).status_code == 401
