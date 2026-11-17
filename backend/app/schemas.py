"""Pydantic request and response models."""

from datetime import datetime

from pydantic import BaseModel, EmailStr, field_validator


class SignupRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator("email", mode="before")
    @classmethod
    def _normalise_email(cls, value: object) -> object:
        return value.strip().lower() if isinstance(value, str) else value

    @field_validator("password")
    @classmethod
    def _check_password(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("password must not be blank")
        if len(value) < 8:
            raise ValueError("the password must be at least 8 characters long")
        return value


class UserOut(BaseModel):
    id: int
    email: str


class SignupResponse(BaseModel):
    token: str
    user: UserOut


class TaskOut(BaseModel):
    id: int
    title: str
    completed: bool
    created_at: datetime

    model_config = {"from_attributes": True}
