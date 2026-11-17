"""Application entrypoint.

Generated from the approved architecture: one router per component that owns
endpoints, one route per endpoint the API spec declares. Every generated route
is a stub that returns a typed placeholder, so the service starts, serves its
OpenAPI document and passes its tests before a single handler is implemented.
"""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models  # noqa: F401 -- imported so the tables register on Base.metadata
from app.config import settings
from app.database import SessionLocal
from app.migrate import upgrade_to_head
from app.seed import seed_users


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Apply migrations, then seed the bootstrap and smoke-test users (each only when
    its settings are set, and only when no user with that email exists).

    This runs on startup and not at import, so importing the application never opens a
    connection: a deployment whose `DATABASE_URL` names a server that is not up fails
    where you can read the error, not while pytest collects the files.
    """
    upgrade_to_head()
    with SessionLocal() as db:
        seed_users(db)
    yield


app = FastAPI(
    title="To-do-app",
    description="Simple To-Do Web App: sign up, log in, and manage your own tasks.",
    version="0.1.0",
    lifespan=lifespan,
)

# The SPA runs on a different origin than the API, so the browser refuses its calls
# unless that origin is allowed here. In development that is the Vite dev server; when
# deployed, the platform injects the frontend's real URL as ALLOWED_ORIGINS (comma
# separated). Point ALLOWED_ORIGINS at the real thing and nothing else has to change.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict[str, str]:
    """Liveness probe, and the only route here that is not a stub."""
    return {"status": "ok"}
