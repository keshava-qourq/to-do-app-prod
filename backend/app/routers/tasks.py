"""GET /tasks."""

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session as DbSession

from app.database import get_db
from app.deps import get_current_user
from app.models import Task, User
from app.schemas import TaskOut

router = APIRouter()


@router.get("/tasks", response_model=list[TaskOut])
def list_tasks(
    user: Annotated[User, Depends(get_current_user)], db: Annotated[DbSession, Depends(get_db)]
) -> list[Task]:
    stmt = (
        select(Task).where(Task.user_id == user.id).order_by(Task.created_at.desc(), Task.id.desc())
    )
    return list(db.scalars(stmt))
