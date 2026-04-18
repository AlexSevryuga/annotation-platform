"""
API v1 router.
Collects all endpoint routers.
"""
from fastapi import APIRouter

api_router = APIRouter()

# Import endpoints to register routes
from app.api.v1.endpoints import auth, workspaces, projects, images, annotations
