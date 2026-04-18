"""
Annotation endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.models.models import (
    User, Annotation, Image, Project, Class,
    AnnotationType, ReviewStatus, WorkspaceRole
)
from app.schemas.annotation import (
    AnnotationCreate, AnnotationUpdate, AnnotationResponse,
    AnnotationBatchCreate
)
from app.services.auth import get_current_user_from_token
from app.api.v1.endpoints.workspaces import get_workspace_member

router = APIRouter(prefix="/annotations", tags=["annotations"])


@router.post("/", response_model=AnnotationResponse, status_code=status.HTTP_201_CREATED)
async def create_annotation(
    data: AnnotationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_from_token)
):
    """Create annotation on image."""
    # Get image
    result = await db.execute(select(Image).where(Image.id == data.image_id))
    image = result.scalar_one_or_none()
    if not image:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found")

    # Check role
    result = await db.execute(select(Project).where(Project.id == image.project_id))
    project = result.scalar_one_or_none()
    member = await get_workspace_member(project.workspace_id, current_user.id, db)
    if not member or member.role not in [WorkspaceRole.OWNER, WorkspaceRole.ADMIN, WorkspaceRole.MANAGER, WorkspaceRole.ANNOTATOR]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Annotator+ only")

    # Verify class belongs to project
    result = await db.execute(select(Class).where(Class.id == data.class_id))
    cls = result.scalar_one_or_none()
    if not cls or cls.project_id != image.project_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Class not in project")

    annotation = Annotation(
        image_id=data.image_id,
        class_id=data.class_id,
        annotation_type=AnnotationType(data.annotation_type),
        data=data.data,
        confidence=data.confidence,
        created_by_id=current_user.id,
        review_status=ReviewStatus.PENDING
    )
    db.add(annotation)

    # Update image status
    image.status = image.status  # Keep current status

    await db.commit()
    await db.refresh(annotation)
    return annotation


@router.post("/batch", response_model=List[AnnotationResponse], status_code=status.HTTP_201_CREATED)
async def create_annotations_batch(
    data: AnnotationBatchCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_from_token)
):
    """Create multiple annotations at once."""
    annotations = []
    for item in data.annotations:
        result = await db.execute(select(Image).where(Image.id == item.image_id))
        image = result.scalar_one_or_none()
        if not image:
            continue

        result = await db.execute(select(Project).where(Project.id == image.project_id))
        project = result.scalar_one_or_none()
        member = await get_workspace_member(project.workspace_id, current_user.id, db)
        if not member:
            continue

        annotation = Annotation(
            image_id=item.image_id,
            class_id=item.class_id,
            annotation_type=AnnotationType(item.annotation_type),
            data=item.data,
            confidence=item.confidence,
            created_by_id=current_user.id,
            review_status=ReviewStatus.PENDING
        )
        db.add(annotation)
        annotations.append(annotation)

    await db.commit()
    for ann in annotations:
        await db.refresh(ann)
    return annotations


@router.get("/image/{image_id}", response_model=List[AnnotationResponse])
async def list_image_annotations(
    image_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_from_token)
):
    """List annotations for image."""
    result = await db.execute(select(Image).where(Image.id == image_id))
    image = result.scalar_one_or_none()
    if not image:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found")

    result = await db.execute(select(Project).where(Project.id == image.project_id))
    project = result.scalar_one_or_none()
    member = await get_workspace_member(project.workspace_id, current_user.id, db)
    if not member:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member")

    result = await db.execute(
        select(Annotation).where(Annotation.image_id == image_id)
    )
    return result.scalars().all()


@router.patch("/{annotation_id}", response_model=AnnotationResponse)
async def update_annotation(
    annotation_id: UUID,
    data: AnnotationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_from_token)
):
    """Update annotation."""
    result = await db.execute(select(Annotation).where(Annotation.id == annotation_id))
    annotation = result.scalar_one_or_none()
    if not annotation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Annotation not found")

    result = await db.execute(select(Image).where(Image.id == annotation.image_id))
    image = result.scalar_one_or_none()
    result = await db.execute(select(Project).where(Project.id == image.project_id))
    project = result.scalar_one_or_none()
    member = await get_workspace_member(project.workspace_id, current_user.id, db)

    # Only creator or reviewer can update
    if annotation.created_by_id != current_user.id and member.role not in [WorkspaceRole.OWNER, WorkspaceRole.ADMIN, WorkspaceRole.REVIEWER]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")

    if data.data is not None:
        annotation.data = data.data
    if data.confidence is not None:
        annotation.confidence = data.confidence
    if data.review_status is not None:
        annotation.review_status = ReviewStatus(data.review_status)
        annotation.reviewed_by_id = current_user.id
    if data.review_comment is not None:
        annotation.review_comment = data.review_comment

    await db.commit()
    await db.refresh(annotation)
    return annotation


@router.delete("/{annotation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_annotation(
    annotation_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_from_token)
):
    """Delete annotation."""
    result = await db.execute(select(Annotation).where(Annotation.id == annotation_id))
    annotation = result.scalar_one_or_none()
    if not annotation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Annotation not found")

    result = await db.execute(select(Image).where(Image.id == annotation.image_id))
    image = result.scalar_one_or_none()
    result = await db.execute(select(Project).where(Project.id == image.project_id))
    project = result.scalar_one_or_none()
    member = await get_workspace_member(project.workspace_id, current_user.id, db)

    if annotation.created_by_id != current_user.id and member.role not in [WorkspaceRole.OWNER, WorkspaceRole.ADMIN]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")

    await db.delete(annotation)
    await db.commit()


@router.post("/{annotation_id}/review", response_model=AnnotationResponse)
async def review_annotation(
    annotation_id: UUID,
    status: ReviewStatus,
    comment: str = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_from_token)
):
    """Review annotation (approve/reject)."""
    result = await db.execute(select(Annotation).where(Annotation.id == annotation_id))
    annotation = result.scalar_one_or_none()
    if not annotation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Annotation not found")

    result = await db.execute(select(Image).where(Image.id == annotation.image_id))
    image = result.scalar_one_or_none()
    result = await db.execute(select(Project).where(Project.id == image.project_id))
    project = result.scalar_one_or_none()
    member = await get_workspace_member(project.workspace_id, current_user.id, db)

    if not member or member.role not in [WorkspaceRole.OWNER, WorkspaceRole.ADMIN, WorkspaceRole.REVIEWER]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Reviewer+ only")

    annotation.review_status = status
    annotation.reviewed_by_id = current_user.id
    if comment:
        annotation.review_comment = comment

    await db.commit()
    await db.refresh(annotation)
    return annotation
