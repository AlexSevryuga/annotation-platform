"""
Image endpoints: upload, list, get, delete.
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from uuid import UUID
import uuid
import aiofiles
import os

from app.core.database import get_db
from app.core.config import settings
from app.models.models import User, Image, Project, ImageStatus, WorkspaceRole
from app.schemas.image import ImageResponse, ImageUploadResponse
from app.services.auth import get_current_user_from_token
from app.api.v1.endpoints.workspaces import get_workspace_member

router = APIRouter(prefix="/images", tags=["images"])

# Max upload size: 50MB
MAX_FILE_SIZE = 50 * 1024 * 1024


@router.post("/project/{project_id}/upload", response_model=ImageUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_image(
    project_id: UUID,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_from_token)
):
    """Upload an image to project."""
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image"
        )

    # Get project
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    # Check role
    member = await get_workspace_member(project.workspace_id, current_user.id, db)
    if not member or member.role not in [WorkspaceRole.OWNER, WorkspaceRole.ADMIN, WorkspaceRole.MANAGER, WorkspaceRole.ANNOTATOR]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Annotator+ only")

    # Read file content
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File too large (max 50MB)")

    # Generate S3 key
    file_ext = os.path.splitext(file.filename or "")[1] or ".jpg"
    s3_key = f"projects/{project_id}/images/{uuid.uuid4()}{file_ext}"

    # TODO: Upload to S3/MinIO
    # For now, store locally
    local_path = f"/tmp/{s3_key.replace('/', '_')}"
    async with aiofiles.open(local_path, "wb") as f:
        await f.write(content)

    # Create image record
    image = Image(
        project_id=project_id,
        filename=file.filename or "unknown",
        s3_key=s3_key,
        width=0,  # TODO: extract from image
        height=0,
        size_bytes=len(content),
        mime_type=file.content_type,
        status=ImageStatus.UNANNOTATED,
    )
    db.add(image)
    await db.commit()
    await db.refresh(image)

    return {
        "id": image.id,
        "filename": image.filename,
        "status": image.status,
        "uploaded_at": image.uploaded_at
    }


@router.get("/project/{project_id}", response_model=List[ImageResponse])
async def list_project_images(
    project_id: UUID,
    status_filter: Optional[ImageStatus] = None,
    assigned_to: Optional[UUID] = None,
    limit: int = 100,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_from_token)
):
    """List images in project."""
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    member = await get_workspace_member(project.workspace_id, current_user.id, db)
    if not member:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member")

    query = select(Image).where(Image.project_id == project_id)
    if status_filter:
        query = query.where(Image.status == status_filter)
    if assigned_to:
        query = query.where(Image.assigned_to_id == assigned_to)

    query = query.order_by(Image.uploaded_at.desc()).offset(offset).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{image_id}", response_model=ImageResponse)
async def get_image(
    image_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_from_token)
):
    """Get image by ID."""
    result = await db.execute(select(Image).where(Image.id == image_id))
    image = result.scalar_one_or_none()
    if not image:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found")

    result = await db.execute(select(Project).where(Project.id == image.project_id))
    project = result.scalar_one_or_none()

    member = await get_workspace_member(project.workspace_id, current_user.id, db)
    if not member:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member")

    return image


@router.delete("/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_image(
    image_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_from_token)
):
    """Delete image."""
    result = await db.execute(select(Image).where(Image.id == image_id))
    image = result.scalar_one_or_none()
    if not image:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found")

    result = await db.execute(select(Project).where(Project.id == image.project_id))
    project = result.scalar_one_or_none()

    member = await get_workspace_member(project.workspace_id, current_user.id, db)
    if not member or member.role not in [WorkspaceRole.OWNER, WorkspaceRole.ADMIN]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")

    await db.delete(image)
    await db.commit()


@router.patch("/{image_id}/assign", response_model=ImageResponse)
async def assign_image(
    image_id: UUID,
    user_id: Optional[UUID] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_from_token)
):
    """Assign image to user."""
    result = await db.execute(select(Image).where(Image.id == image_id))
    image = result.scalar_one_or_none()
    if not image:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found")

    result = await db.execute(select(Project).where(Project.id == image.project_id))
    project = result.scalar_one_or_none()

    member = await get_workspace_member(project.workspace_id, current_user.id, db)
    if not member or member.role not in [WorkspaceRole.OWNER, WorkspaceRole.ADMIN, WorkspaceRole.MANAGER]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Manager+ only")

    image.assigned_to_id = user_id
    await db.commit()
    await db.refresh(image)
    return image
