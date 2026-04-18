"""
Project endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.models.models import User, Project, Workspace, WorkspaceMember, AnnotationType, WorkspaceRole
from app.schemas.project import (
    ProjectCreate, ProjectUpdate, ProjectResponse, ClassCreate, ClassResponse
)
from app.services.auth import get_current_user_from_token
from app.api.v1.endpoints.workspaces import get_workspace_member
from app.models.models import Class

router = APIRouter(prefix="/projects", tags=["projects"])


@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    workspace_id: UUID,
    data: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_from_token)
):
    """Create a new project in workspace."""
    # Check membership and role
    member = await get_workspace_member(workspace_id, current_user.id, db)
    if not member:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member")
    if member.role not in [WorkspaceRole.OWNER, WorkspaceRole.ADMIN, WorkspaceRole.MANAGER]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Manager+ only")

    project = Project(
        workspace_id=workspace_id,
        name=data.name,
        description=data.description,
        annotation_type=AnnotationType(data.annotation_type),
        created_by_id=current_user.id
    )
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project


@router.get("/workspace/{workspace_id}", response_model=List[ProjectResponse])
async def list_workspace_projects(
    workspace_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_from_token)
):
    """List all projects in workspace."""
    member = await get_workspace_member(workspace_id, current_user.id, db)
    if not member:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member")

    result = await db.execute(
        select(Project).where(Project.workspace_id == workspace_id)
    )
    return result.scalars().all()


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_from_token)
):
    """Get project by ID."""
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    member = await get_workspace_member(project.workspace_id, current_user.id, db)
    if not member:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member")

    return project


@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: UUID,
    data: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_from_token)
):
    """Update project."""
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    member = await get_workspace_member(project.workspace_id, current_user.id, db)
    if not member or member.role not in [WorkspaceRole.OWNER, WorkspaceRole.ADMIN, WorkspaceRole.MANAGER]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Manager+ only")

    if data.name is not None:
        project.name = data.name
    if data.description is not None:
        project.description = data.description

    await db.commit()
    await db.refresh(project)
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_from_token)
):
    """Delete project."""
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    member = await get_workspace_member(project.workspace_id, current_user.id, db)
    if not member or member.role not in [WorkspaceRole.OWNER, WorkspaceRole.ADMIN]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")

    await db.delete(project)
    await db.commit()


# === Classes ===

@router.post("/{project_id}/classes", response_model=ClassResponse, status_code=status.HTTP_201_CREATED)
async def create_class(
    project_id: UUID,
    data: ClassCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_from_token)
):
    """Add class to project."""
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    member = await get_workspace_member(project.workspace_id, current_user.id, db)
    if not member or member.role not in [WorkspaceRole.OWNER, WorkspaceRole.ADMIN, WorkspaceRole.MANAGER]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Manager+ only")

    cls = Class(
        project_id=project_id,
        name=data.name,
        color=data.color,
        shortcut_key=data.shortcut_key,
        parent_id=data.parent_id,
        sort_order=data.sort_order or 0
    )
    db.add(cls)
    await db.commit()
    await db.refresh(cls)
    return cls


@router.get("/{project_id}/classes", response_model=List[ClassResponse])
async def list_classes(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_from_token)
):
    """List classes in project."""
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    member = await get_workspace_member(project.workspace_id, current_user.id, db)
    if not member:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member")

    result = await db.execute(
        select(Class).where(Class.project_id == project_id).order_by(Class.sort_order)
    )
    return result.scalars().all()
