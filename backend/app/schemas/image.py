"""
Image schemas.
"""
from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime
from app.models.models import ImageStatus


class ImageResponse(BaseModel):
    id: UUID
    project_id: UUID
    filename: str
    s3_key: str
    width: int
    height: int
    size_bytes: int
    mime_type: str
    status: ImageStatus
    assigned_to_id: Optional[UUID]
    uploaded_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ImageUploadResponse(BaseModel):
    id: UUID
    filename: str
    status: ImageStatus
    uploaded_at: datetime
