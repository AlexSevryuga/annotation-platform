"""
Database models for AI Studio Annotation Platform.
Multi-tenant architecture with RBAC.
"""
from datetime import datetime
from enum import Enum as PyEnum
from typing import Optional, List
from sqlalchemy import (
    Column, Integer, BigInteger, String, Text, DateTime, Boolean,
    ForeignKey, Enum, JSON, UniqueConstraint, Index
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, Mapped, mapped_column
import uuid

from app.core.database import Base


class AnnotationType(str, PyEnum):
    """Types of annotation supported."""
    BBOX = "bbox"
    POLYGON = "polygon"
    SEGMENTATION = "segmentation"
    KEYPOINT = "keypoint"
    CLASSIFICATION = "classification"


class ImageStatus(str, PyEnum):
    """Status of image annotation."""
    UNANNOTATED = "unannotated"
    IN_PROGRESS = "in_progress"
    ANNOTATED = "annotated"
    REVIEWED = "reviewed"


class ReviewStatus(str, PyEnum):
    """Review status for annotations."""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class WorkspaceRole(str, PyEnum):
    """Workspace member roles."""
    OWNER = "owner"
    ADMIN = "admin"
    MANAGER = "manager"
    ANNOTATOR = "annotator"
    REVIEWER = "reviewer"
    VIEWER = "viewer"


class User(Base):
    """User model."""
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    auth_provider: Mapped[str] = mapped_column(String(50), default="email")
    hashed_password: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    owned_workspaces = relationship("Workspace", back_populates="owner")
    memberships = relationship("WorkspaceMember", back_populates="user")
    created_projects = relationship("Project", back_populates="created_by")
    created_annotations = relationship("Annotation", back_populates="created_by_user")
    reviewed_annotations = relationship("Annotation", back_populates="reviewed_by_user")


class Workspace(Base):
    """Workspace for multi-tenancy."""
    __tablename__ = "workspaces"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    plan: Mapped[str] = mapped_column(String(50), default="free")  # free | pro | enterprise
    owner_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    owner = relationship("User", back_populates="owned_workspaces")
    members = relationship("WorkspaceMember", back_populates="workspace", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="workspace", cascade="all, delete-orphan")
    trained_models = relationship("TrainedModel", back_populates="workspace")
    audit_logs = relationship("AuditLog", back_populates="workspace")


class WorkspaceMember(Base):
    """Workspace membership with roles."""
    __tablename__ = "workspace_members"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    role: Mapped[WorkspaceRole] = mapped_column(Enum(WorkspaceRole), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    workspace = relationship("Workspace", back_populates="members")
    user = relationship("User", back_populates="memberships")

    __table_args__ = (
        UniqueConstraint("workspace_id", "user_id", name="uq_workspace_user"),
        Index("idx_workspace_members_workspace", "workspace_id"),
        Index("idx_workspace_members_user", "user_id"),
    )


class Project(Base):
    """Annotation project."""
    __tablename__ = "projects"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    annotation_type: Mapped[AnnotationType] = mapped_column(Enum(AnnotationType), nullable=False)
    created_by_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    workspace = relationship("Workspace", back_populates="projects")
    created_by = relationship("User", back_populates="created_projects")
    classes = relationship("Class", back_populates="project", cascade="all, delete-orphan")
    images = relationship("Image", back_populates="project", cascade="all, delete-orphan")
    datasets = relationship("Dataset", back_populates="project", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_projects_workspace", "workspace_id"),
    )


class Class(Base):
    """Annotation class (label) with hierarchy support."""
    __tablename__ = "classes"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    color: Mapped[str] = mapped_column(String(7), nullable=False)  # hex color e.g. "#FF0000"
    shortcut_key: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)  # e.g. "1", "b", "ctrl+1"
    parent_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    project = relationship("Project", back_populates="classes")
    parent = relationship("Class", remote_side="Class.id", backref="children")
    annotations = relationship("Annotation", back_populates="class_")

    __table_args__ = (
        UniqueConstraint("project_id", "name", name="uq_project_class_name"),
        Index("idx_classes_project", "project_id"),
    )


class Image(Base):
    """Image in a project."""
    __tablename__ = "images"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    filename: Mapped[str] = mapped_column(String(500), nullable=False)
    s3_key: Mapped[str] = mapped_column(String(1000), nullable=False)
    width: Mapped[int] = mapped_column(Integer, nullable=False)
    height: Mapped[int] = mapped_column(Integer, nullable=False)
    size_bytes: Mapped[int] = mapped_column(BigInteger, nullable=False)
    mime_type: Mapped[str] = mapped_column(String(50), default="image/jpeg")
    status: Mapped[ImageStatus] = mapped_column(Enum(ImageStatus), default=ImageStatus.UNANNOTATED)
    assigned_to_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    uploaded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    project = relationship("Project", back_populates="images")
    assigned_to = relationship("User")
    annotations = relationship("Annotation", back_populates="image", cascade="all, delete-orphan")
    dataset_images = relationship("DatasetImage", back_populates="image")

    __table_args__ = (
        Index("idx_images_project", "project_id"),
        Index("idx_images_status", "status"),
    )


class Annotation(Base):
    """Annotation on an image."""
    __tablename__ = "annotations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    image_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("images.id"), nullable=False)
    class_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=False)
    annotation_type: Mapped[AnnotationType] = mapped_column(Enum(AnnotationType), nullable=False)
    data: Mapped[dict] = mapped_column(JSON, nullable=False)  # bbox, polygon, mask, keypoint data
    confidence: Mapped[Optional[float]] = mapped_column(nullable=True)  # AI confidence score
    created_by_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    reviewed_by_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    review_status: Mapped[ReviewStatus] = mapped_column(Enum(ReviewStatus), default=ReviewStatus.PENDING)
    review_comment: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    image = relationship("Image", back_populates="annotations")
    class_ = relationship("Class", back_populates="annotations")
    created_by_user = relationship("User", back_populates="created_annotations")
    reviewed_by_user = relationship("User", back_populates="reviewed_annotations")

    __table_args__ = (
        Index("idx_annotations_image", "image_id"),
        Index("idx_annotations_class", "class_id"),
        Index("idx_annotations_review_status", "review_status"),
    )


class Dataset(Base):
    """Dataset version snapshot."""
    __tablename__ = "datasets"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    version: Mapped[int] = mapped_column(Integer, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    split_config: Mapped[dict] = mapped_column(JSON, default={"train": 70, "val": 20, "test": 10})
    image_count: Mapped[int] = mapped_column(Integer, default=0)
    annotation_count: Mapped[int] = mapped_column(Integer, default=0)
    export_formats: Mapped[List[str]] = mapped_column(JSON, default=[])
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    project = relationship("Project", back_populates="datasets")
    dataset_images = relationship("DatasetImage", back_populates="dataset", cascade="all, delete-orphan")

    __table_args__ = (
        UniqueConstraint("project_id", "version", name="uq_dataset_version"),
        Index("idx_datasets_project", "project_id"),
    )


class DatasetImage(Base):
    """Junction table for dataset-images."""
    __tablename__ = "dataset_images"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    dataset_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("datasets.id"), nullable=False)
    image_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("images.id"), nullable=False)
    split: Mapped[str] = mapped_column(String(20), default="train")  # train | val | test

    # Relationships
    dataset = relationship("Dataset", back_populates="dataset_images")
    image = relationship("Image", back_populates="dataset_images")

    __table_args__ = (
        UniqueConstraint("dataset_id", "image_id", name="uq_dataset_image"),
    )


class TrainedModel(Base):
    """Trained model registry."""
    __tablename__ = "trained_models"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=True)
    workspace_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    architecture: Mapped[str] = mapped_column(String(50), nullable=False)  # yolov8 | yolov11 | rf-detr | custom
    weights_s3_key: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    metrics: Mapped[dict] = mapped_column(JSON, default={})  # {mAP: 0.85, precision: 0.9}
    config: Mapped[dict] = mapped_column(JSON, default={})
    status: Mapped[str] = mapped_column(String(20), default="training")  # training | completed | failed
    is_public: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    project = relationship("Project")
    workspace = relationship("Workspace", back_populates="trained_models")
    versions = relationship("ModelVersion", back_populates="model", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_trained_models_workspace", "workspace_id"),
        Index("idx_trained_models_architecture", "architecture"),
    )


class ModelVersion(Base):
    """Model version for tracking."""
    __tablename__ = "model_versions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    model_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("trained_models.id"), nullable=False)
    version: Mapped[str] = mapped_column(String(50), nullable=False)  # e.g. "1.0.0"
    weights_s3_key: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    metrics: Mapped[dict] = mapped_column(JSON, default={})
    changelog: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    model = relationship("TrainedModel", back_populates="versions")

    __table_args__ = (
        UniqueConstraint("model_id", "version", name="uq_model_version"),
    )


class AuditLog(Base):
    """Audit log for enterprise."""
    __tablename__ = "audit_logs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    action: Mapped[str] = mapped_column(String(100), nullable=False)  # create, update, delete, login
    resource_type: Mapped[str] = mapped_column(String(50), nullable=False)  # project, image, annotation
    resource_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), nullable=True)
    metadata: Mapped[dict] = mapped_column(JSON, default={})
    ip_address: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)  # IPv6 compatible
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    workspace = relationship("Workspace", back_populates="audit_logs")
    user = relationship("User")

    __table_args__ = (
        Index("idx_audit_logs_workspace", "workspace_id"),
        Index("idx_audit_logs_user", "user_id"),
        Index("idx_audit_logs_created", "created_at"),
    )