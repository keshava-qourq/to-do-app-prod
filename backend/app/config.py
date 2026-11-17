"""Settings the platform provides, each read with a working local default.

Read at import so every module sees the same values. Nothing here is a credential
literal: local defaults are either empty or obviously non-secret.
"""

import os
from dataclasses import dataclass, field


def _origins() -> list[str]:
    raw = os.getenv("ALLOWED_ORIGINS", "")
    parsed = [o.strip() for o in raw.split(",") if o.strip()]
    return parsed or ["http://localhost:5173", "http://127.0.0.1:5173"]


@dataclass(frozen=True)
class Settings:
    # Frontend origin(s) for CORS.
    allowed_origins: list[str] = field(default_factory=_origins)
    # Shared API bearer the generated frontend sends. Public: never sign anything with it.
    secret_key: str = os.getenv("SECRET_KEY", "")
    # Private; signs anything that must not be forgeable.
    jwt_secret_key: str = os.getenv("JWT_SECRET_KEY", "")
    # Writable directory that survives redeploys.
    media_root: str = os.getenv("MEDIA_ROOT", "./media")
    # First user, created on startup only when both are set.
    bootstrap_admin_email: str = os.getenv("BOOTSTRAP_ADMIN_EMAIL", "")
    bootstrap_admin_password: str = os.getenv("BOOTSTRAP_ADMIN_PASSWORD", "")
    # A normal user for smoke tests, created on startup only when both are set.
    smoke_test_email: str = os.getenv("SMOKE_TEST_EMAIL", "")
    smoke_test_password: str = os.getenv("SMOKE_TEST_PASSWORD", "")


settings = Settings()
