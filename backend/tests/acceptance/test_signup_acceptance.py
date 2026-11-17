"""Acceptance checks for sign-up against the real PostgreSQL."""

import logging
import secrets

from fastapi.testclient import TestClient
from sqlalchemy import text
from sqlalchemy.orm import Session


def _pw() -> str:
    return secrets.token_urlsafe(12)


def _post(client: TestClient, email: str, password: str):
    return client.post("/auth/signup", json={"email": email, "password": password})


def _count(db: Session, table: str) -> int:
    return db.execute(text(f"select count(*) from {table}")).scalar()


def test_ac010_nfr006_invalid_email_422_no_row(client: TestClient, db_session: Session):
    for bad in ["nope", "a@b", "@example.com", "a b@example.com", ""]:
        assert _post(client, bad, _pw()).status_code == 422
    assert _count(db_session, "users") == 0


def test_ac018_ac019_nfr001_bcrypt_hash_and_salt(client: TestClient, db_session: Session):
    pw = _pw()
    assert _post(client, "one@example.com", pw).status_code == 201
    assert _post(client, "two@example.com", pw).status_code == 201
    hashes = [r[0] for r in db_session.execute(text("select password_hash from users order by id"))]
    assert len(hashes) == 2
    for h in hashes:
        assert h.startswith(("$2a$", "$2b$", "$2y$"))
        assert pw not in h
    assert hashes[0] != hashes[1]


def test_ac020_password_absent_from_422_409_and_logs(client: TestClient, caplog):
    caplog.set_level(logging.DEBUG)
    pw = _pw()
    short = "x" * 7
    r422 = _post(client, "bad-email", pw)
    r422b = _post(client, "ok@example.com", short)
    assert _post(client, "dup@example.com", pw).status_code == 201
    r409 = _post(client, "DUP@example.com", pw)
    assert r422.status_code == 422 and r422b.status_code == 422 and r409.status_code == 409
    assert pw not in r422.text and short not in r422b.text and pw not in r409.text
    assert pw not in caplog.text and short not in caplog.text


def test_nfr002_password_length_boundary(client: TestClient):
    assert _post(client, "p7@example.com", "abcdefg").status_code == 422
    assert _post(client, "p8@example.com", "abcdefgh").status_code == 201
    # no other complexity rule
    assert _post(client, "p9@example.com", "aaaaaaaa").status_code == 201


def test_ac004_no_task_leak_between_accounts(client: TestClient, db_session: Session):
    a = _post(client, "a@example.com", _pw()).json()
    db_session.execute(
        text("insert into tasks (user_id, title) values (:u, 'secret')"), {"u": a["user"]["id"]}
    )
    db_session.commit()
    b = _post(client, "b@example.com", _pw()).json()
    hb = {"Authorization": f"Bearer {b['token']}"}
    assert client.get("/tasks", headers=hb).json() == []
    ha = {"Authorization": f"Bearer {a['token']}"}
    assert [t["title"] for t in client.get("/tasks", headers=ha).json()] == ["secret"]


def test_nfr007_deleting_user_removes_tasks_and_sessions(client: TestClient, db_session: Session):
    a = _post(client, "del@example.com", _pw()).json()
    uid = a["user"]["id"]
    db_session.execute(text("insert into tasks (user_id, title) values (:u, 't')"), {"u": uid})
    db_session.commit()
    assert _count(db_session, "sessions") == 1 and _count(db_session, "tasks") == 1
    db_session.execute(text("delete from users where id = :u"), {"u": uid})
    db_session.commit()
    assert _count(db_session, "tasks") == 0
    assert _count(db_session, "sessions") == 0
