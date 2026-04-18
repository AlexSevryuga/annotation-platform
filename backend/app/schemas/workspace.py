"""
Workspace schemas.
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from app.models.models import WorkspaceRole


class WorkspaceBase(BaseModel):
    name: str
    slug: str = Field(..., min_length=3, max_length=50, pattern=r"^[a-z0-9-]+$")


class WorkspaceCreate(WorkspaceBase):
    plan: Optional[str] = "free"


class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    plan: Optional[str] = None


class WorkspaceMemberUser(BaseModel):
    id: UUID
    email: str
    name: str
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True


class WorkspaceResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    plan: str
    owner_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class WorkspaceMemberResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    user_id: UUID
    role: WorkspaceRole
    created_at: datetime
    user: WorkspaceMemberUser

    class Config:
        from_attributes = True


class WorkspaceMemberAdd(BaseModel):
    email: str
    role: WorkspaceRole
