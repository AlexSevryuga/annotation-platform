"""
Annotation schemas.
"""
from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from app.models.models import AnnotationType, ReviewStatus


class AnnotationBase(BaseModel):
    image_id: UUID
    class_id: UUID
    annotation_type: str
    data: dict
    confidence: Optional[float] = None


class AnnotationCreate(AnnotationBase):
    pass


class AnnotationUpdate(BaseModel):
    data: Optional[dict] = None
    confidence: Optional[float] = None
    review_status: Optional[str] = None
    review_comment: Optional[str] = None


class AnnotationResponse(BaseModel):
    id: UUID
    image_id: UUID
    class_id: UUID
    annotation_type: AnnotationType
    data: dict
    confidence: Optional[float]
    created_by_id: UUID
    reviewed_by_id: Optional[UUID]
    review_status: ReviewStatus
    review_comment: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AnnotationBatchItem(BaseModel):
    image_id: UUID
    class_id: UUID
    annotation_type: str
    data: dict
    confidence: Optional[float] = None


class AnnotationBatchCreate(BaseModel):
    annotations: List[AnnotationBatchItem]
