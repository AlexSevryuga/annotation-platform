# AI Studio — Annotation Platform Frontend

## Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Canvas:** Konva.js (or Fabric.js)
- **State:** React Query + Zustand
- **Auth:** NextAuth.js v5

## Structure
```
frontend/
├── app/
│   ├── (auth)/              # Auth routes (login, register)
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Dashboard routes
│   │   ├── page.tsx         # Workspace overview
│   │   ├── projects/
│   │   │   ├── page.tsx     # Projects list
│   │   │   └── [id]/
│   │   │       ├── page.tsx  # Project detail
│   │   │       └── settings/
│   │   ├── datasets/
│   │   │   ├── page.tsx     # Datasets list
│   │   │   └── [id]/
│   │   │       └── page.tsx  # Dataset detail
│   │   ├── models/
│   │   │   └── page.tsx     # Model registry
│   │   └── settings/
│   │       ├── page.tsx      # Workspace settings
│   │       └── billing/
│   ├── annotate/
│   │   └── [id]/
│   │       └── page.tsx      # Annotation canvas
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── canvas/
│   │   ├── AnnotationCanvas.tsx
│   │   ├── CanvasToolbar.tsx
│   │   ├── CanvasLayers.tsx
│   │   └── SamOverlay.tsx
│   ├── toolbar/
│   │   ├── ToolPanel.tsx
│   │   ├── UndoRedo.tsx
│   │   └── ZoomControls.tsx
│   ├── sidebar/
│   │   ├── ClassPanel.tsx
│   │   ├── PropertiesPanel.tsx
│   │   ├── ImageList.tsx
│   │   └── LayerPanel.tsx
│   └── ui/                  # shadcn components
├── lib/
│   ├── api.ts               # Typed API client
│   ├── canvas-engine.ts     # Canvas abstraction
│   ├── auth.ts              # NextAuth config
│   └── utils.ts
└── types/
    └── index.ts             # TypeScript interfaces
```

## Annotation Tools
1. **Select (V)** — select/transform objects
2. **Bounding Box (B)** — draw rectangles
3. **Polygon (P)** — point-by-point contours
4. **Brush (M)** — freeform brush mask
5. **Magic Wand (W)** — SAM 3 click-to-segment
6. **Text Prompt (T)** — SAM 3 text-to-segment
7. **Keypoints (K)** — named point placement
8. **Auto-annotate** — SAM 3 full image segmentation
9. **Eraser (E)** — erase mask parts

## Key Features
- Full-screen canvas editor (Figma-like)
- Real-time collaboration (WebSocket)
- SAM 3 integration (click, text, exemplar prompts)
- Auto-save annotations (debounced)
- Undo/redo (command pattern)
- Keyboard shortcuts
- Image navigation (D/A for next/prev)
- Class quick-switch (1-9)
- Zoom/pan (Space+drag, Ctrl+scroll)

## Quality Standards
- TypeScript strict mode
- ESLint + Prettier
- Component unit tests
- E2E tests (Playwright)
- Accessibility (a11y)