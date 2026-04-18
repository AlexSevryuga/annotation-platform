# LabelFlow — Training Data Platform

## Overview
Платформа для аннотации изображений с AI-ассистированной разметкой (SAM 3).
Complete training data pipeline: annotation → quality control → model training → deployment.

**Аналоги:** Roboflow, Scale AI

**Stack:**
- Frontend: Next.js 15, TypeScript, Tailwind CSS v3
- Backend: Python 3.12, FastAPI, SQLAlchemy 2.0 (async), Alembic
- ML: SAM 3 (Meta), PyTorch, YOLO (ultralytics)
- DB: PostgreSQL 16
- Storage: S3 (MinIO dev / Cloudflare R2 prod)
- Queue: Redis + Celery
- Auth: JWT (python-jose)

## Architecture

```
ai-studio/
├── frontend/               # Next.js 15 (App Router)
│   ├── app/
│   │   ├── (auth)/        # login, register
│   │   ├── (dashboard)/   # workspace overview
│   │   ├── projects/[id]/ # project detail
│   │   ├── annotate/[id]/  # annotation editor (main canvas)
│   │   ├── datasets/[id]/  # dataset management
│   │   ├── models/         # model registry & marketplace
│   │   └── settings/       # workspace settings
│   ├── components/
│   │   ├── canvas/         # annotation canvas (Fabric.js / Konva.js)
│   │   ├── toolbar/         # annotation tools
│   │   ├── sidebar/         # classes, layers, properties
│   │   └── ui/             # shadcn components
│   └── lib/
│       ├── api.ts          # typed API client
│       └── canvas-engine.ts
├── backend/                # FastAPI
│   ├── app/
│   │   ├── api/v1/         # REST endpoints
│   │   ├── models/         # SQLAlchemy
│   │   ├── schemas/        # Pydantic
│   │   ├── services/       # business logic
│   │   ├── ml/            # SAM 3, YOLO
│   │   └── tasks/         # Celery
│   └── alembic/           # migrations
└── docker-compose.yml
```

## Data Model

### Core Entities
- **workspaces**: multi-tenant隔离, RBAC
- **users**: auth providers
- **workspace_members**: roles (owner|admin|manager|annotator|reviewer|viewer)
- **projects**: annotation_type (bbox|polygon|segmentation|keypoint|classification)
- **classes**: name, color, shortcut_key, hierarchy
- **images**: s3_key, dimensions, status, assignee
- **annotations**: JSONB (bbox|polygon|mask|keypoint), review_status

### Dataset & Models
- **datasets**: versioned snapshots
- **trained_models**: YOLO, RF-DETR, model cards

## Annotation Types
1. **Bounding Box** — rectangular selection
2. **Polygon** — point-by-point contour
3. **Brush/Mask** — freeform mask (SAM 3)
4. **Keypoints** — named points (pose estimation)
5. **Classification** — image-level label

## Implementation Phases

### Phase 1 — Core + Enterprise Foundation
- Multi-tenant schema (workspaces, users, RBAC)
- Projects CRUD, classes management
- Image upload → S3
- Canvas annotator: bbox, polygon, brush
- Annotations CRUD with auto-save
- Auth (NextAuth: GitHub + email)

### Phase 2 — SAM 3 Integration
- SAM 3 inference server
- Click-to-segment on canvas
- Text prompt segmentation
- Auto-segment entire image
- Embedding cache (Redis)

### Phase 3 — Dataset Management
- Dataset versioning
- Export: COCO, YOLO, VOC, CreateML, masks
- Train/Val/Test stratified split
- Augmentation pipeline

### Phase 4 — Collaboration & QA
- Annotation workflow (assign → review)
- Review UI (approve/reject)
- Team progress dashboard
- Consensus scoring

### Phase 5 — Training Pipeline
- YOLO/RF-DETR training (Celery)
- Real-time metrics (WebSocket)
- Model card

### Phase 6 — Marketplace
- Model registry
- Dataset sharing
- Search & filters

### Phase 7 — Enterprise
- SSO/SAML
- Audit logs
- Kubernetes, billing

## Quality Requirements
- TypeScript strict mode
- Python type hints everywhere
- Pydantic validation
- SQLAlchemy 2.0
- API response schemas
- Error handling
- Logging (structlog)
- Health checks
- Docker + health checks
- Unit tests (pytest)
- E2E tests (Playwright)