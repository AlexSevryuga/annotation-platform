"""
Project schemas.
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from app.models.models import AnnotationType


class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None


class ProjectCreate(ProjectBase):
    annotation_type: str = Field(..., pattern=r"^(bbox|polygon|segmentation|keypoint|classification)$")


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class ProjectResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    name: str
    description: Optional[str]
    annotation_type: AnnotationType
    created_by_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ClassCreate(BaseModel):
    name: str
    color: str = Field(..., pattern=r"^#[0-9A-Fa-f]{6}$")
    shortcut_key: Optional[str] = None
    parent_id: Optional[UUID] = None
    sort_order: Optional[int] = 0


class ClassResponse(BaseModel):
    id: UUID
    project_id: UUID
    name: str
    color: str
    shortcut_key: Optional[str]
    parent_id: Optional[UUID]
    sort_order: int
    created_at: datetime

    class Config:
        from_attributes = True
