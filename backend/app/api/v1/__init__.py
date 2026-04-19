"""
API v1 router.
Collects all endpoint routers.
"""
from fastapi import APIRouter

api_router = APIRouter()

# Import endpoints and include routers
from app.api.v1.endpoints import auth, workspaces, projects, images, annotations

api_router.include_router(auth.router)
api_router.include_router(workspaces.router)
api_router.include_router(projects.router)
api_router.include_router(images.router)
api_router.include_router(annotations.router)
