"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface AnnotationClass {
  id: string;
  name: string;
  color: string;
  shortcut_key: string | null;
}

interface ImageData {
  id: string;
  filename: string;
  s3_key: string;
  status: string;
  width: number;
  height: number;
}

interface Annotation {
  id: string;
  class_id: string;
  annotation_type: string;
  data: any;
  confidence: number | null;
  review_status: string;
}

export default function AnnotatePage() {
  const params = useParams();
  const projectId = params.id as string;
  const router = useRouter();

  const [classes, setClasses] = useState<AnnotationClass[]>([]);
  const [images, setImages] = useState<ImageData[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedTool, setSelectedTool] = useState<"bbox" | "polygon" | "brush" | null>(null);
  const [selectedClass, setSelectedClass] = useState<AnnotationClass | null>(null);
  const [loading, setLoading] = useState(true);

  const designSystem = {
    colors: {
      primary: "#7c3aed",
      secondary: "#a855f7",
      accent: "#c084fc",
      background: "#09090b",
      surface: "#18181b",
      border: "#27272a",
      text: "#fafafa",
      muted: "#71717a",
    },
  };

  const tools = [
    { id: "bbox", key: "B", label: "Bounding Box", color: "#7c3aed" },
    { id: "polygon", key: "P", label: "Polygon", color: "#22c55e" },
    { id: "brush", key: "M", label: "Brush Mask", color: "#f59e0b" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchData(token);
  }, []);

  const fetchData = async (token: string) => {
    try {
      // Fetch classes
      const classesRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects/${projectId}/classes`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (classesRes.ok) {
        const classesData = await classesRes.json();
        setClasses(classesData);
        if (classesData.length > 0) {
          setSelectedClass(classesData[0]);
        }
      }

      // Fetch images
      const imagesRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/images/project/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (imagesRes.ok) {
        const imagesData = await imagesRes.json();
        setImages(imagesData);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  const currentImage = images[currentImageIndex];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: designSystem.colors.background }}>
        <span style={{ color: designSystem.colors.muted }}>Loading project...</span>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: designSystem.colors.background }}>
      {/* Header */}
      <header
        className="h-14 px-4 flex items-center justify-between border-b shrink-0"
        style={{ borderColor: designSystem.colors.border, backgroundColor: "rgba(24, 24, 27, 0.95)" }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/workspace")}
            className="p-2 rounded-lg transition-colors"
            style={{ color: designSystem.colors.muted }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = designSystem.colors.border)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${designSystem.colors.primary}, ${designSystem.colors.secondary})` }}
            >
              <span className="text-white font-bold text-sm">LF</span>
            </div>
            <span className="font-semibold" style={{ color: designSystem.colors.text }}>
              LabelFlow Editor
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm" style={{ color: designSystem.colors.muted }}>
          <span>
            Image {images.length > 0 ? currentImageIndex + 1 : 0}/{images.length}
          </span>
          <span>|</span>
          <span>Zoom: 100%</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              background: `linear-gradient(135deg, ${designSystem.colors.primary}, ${designSystem.colors.secondary})`,
              color: "white",
            }}
          >
            Save
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Classes */}
        <div
          className="w-56 border-r shrink-0 overflow-y-auto p-4"
          style={{ borderColor: designSystem.colors.border, backgroundColor: "rgba(9, 9, 11, 0.5)" }}
        >
          <div className="text-xs uppercase tracking-wider mb-3 font-medium" style={{ color: designSystem.colors.muted }}>
            Classes
          </div>
          <div className="space-y-2">
            {classes.map((cls) => (
              <button
                key={cls.id}
                onClick={() => setSelectedClass(cls)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
                style={{
                  backgroundColor: selectedClass?.id === cls.id ? `${cls.color}15` : "transparent",
                  border: selectedClass?.id === cls.id ? `1px solid ${cls.color}40` : "1px solid transparent",
                }}
              >
                <div className="w-4 h-4 rounded-lg" style={{ backgroundColor: cls.color }} />
                <span className="text-sm font-medium" style={{ color: designSystem.colors.text }}>
                  {cls.name}
                </span>
                {cls.shortcut_key && (
                  <kbd className="ml-auto px-2 py-0.5 rounded text-xs" style={{ backgroundColor: designSystem.colors.surface, color: designSystem.colors.muted }}>
                    {cls.shortcut_key}
                  </kbd>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 relative flex flex-col">
          {/* Toolbar */}
          <div
            className="h-14 px-4 flex items-center gap-4 border-b shrink-0"
            style={{ borderColor: designSystem.colors.border, backgroundColor: "rgba(24, 24, 27, 0.95)" }}
          >
            <div className="flex items-center gap-1">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id as any)}
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold transition-all"
                  style={{
                    backgroundColor: selectedTool === tool.id ? `${tool.color}20` : "transparent",
                    border: selectedTool === tool.id ? `1px solid ${tool.color}` : "1px solid transparent",
                    color: selectedTool === tool.id ? tool.color : designSystem.colors.muted,
                  }}
                  title={`${tool.label} (${tool.key})`}
                >
                  {tool.key}
                </button>
              ))}
            </div>

            <div className="w-px h-8" style={{ backgroundColor: designSystem.colors.border }} />

            <button
              className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${designSystem.colors.primary}, ${designSystem.colors.secondary})`,
                color: "white",
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              SAM 3
            </button>

            <div className="ml-auto flex items-center gap-6 text-sm" style={{ color: designSystem.colors.muted }}>
              <span>Class: {selectedClass?.name || "None"}</span>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: "#09090b" }}>
            {images.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div
                    className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center"
                    style={{ background: designSystem.colors.surface }}
                  >
                    <svg className="w-10 h-10" style={{ color: designSystem.colors.muted }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-18-5.159l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m0 0l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-18-5.159l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium mb-2" style={{ color: designSystem.colors.text }}>
                    No images in project
                  </p>
                  <p className="text-sm mb-4" style={{ color: designSystem.colors.muted }}>
                    Upload images to start annotating
                  </p>
                  <button
                    className="px-6 py-2 rounded-xl text-sm font-medium"
                    style={{
                      background: `linear-gradient(135deg, ${designSystem.colors.primary}, ${designSystem.colors.secondary})`,
                      color: "white",
                    }}
                  >
                    Upload Images
                  </button>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="relative w-full max-w-4xl">
                  {/* Grid background */}
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      backgroundImage: `
                        linear-gradient(${designSystem.colors.border}20 1px, transparent 1px),
                        linear-gradient(90deg, ${designSystem.colors.border}20 1px, transparent 1px)
                      `,
                      backgroundSize: "40px 40px",
                    }}
                  />

                  {/* Image placeholder */}
                  <div
                    className="h-96 rounded-2xl flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${designSystem.colors.surface}, #0f0f12)`,
                      border: `1px solid ${designSystem.colors.border}`,
                    }}
                  >
                    <span style={{ color: designSystem.colors.muted }}>
                      {currentImage?.filename || "Select an image"}
                    </span>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-4">
                    <button
                      onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                      disabled={currentImageIndex === 0}
                      className="px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                      style={{
                        border: `1px solid ${designSystem.colors.border}`,
                        color: designSystem.colors.text,
                      }}
                    >
                      Previous
                    </button>
                    <span style={{ color: designSystem.colors.muted }}>
                      {currentImage?.filename}
                    </span>
                    <button
                      onClick={() => setCurrentImageIndex(Math.min(images.length - 1, currentImageIndex + 1))}
                      disabled={currentImageIndex === images.length - 1}
                      className="px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                      style={{
                        border: `1px solid ${designSystem.colors.border}`,
                        color: designSystem.colors.text,
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div
            className="h-10 px-4 flex items-center gap-6 text-sm border-t shrink-0"
            style={{ borderColor: designSystem.colors.border, backgroundColor: "rgba(24, 24, 27, 0.8)" }}
          >
            <span style={{ color: designSystem.colors.muted }}>Auto-saved</span>
            <span style={{ color: designSystem.colors.border }}>|</span>
            <span style={{ color: designSystem.colors.muted }}>Ctrl+Z to undo</span>
            <span style={{ color: designSystem.colors.border }}>|</span>
            <span style={{ color: designSystem.colors.muted }}>Press ? for shortcuts</span>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div
          className="w-60 border-l shrink-0 overflow-y-auto p-4"
          style={{ borderColor: designSystem.colors.border, backgroundColor: "rgba(9, 9, 11, 0.5)" }}
        >
          <div className="text-xs uppercase tracking-wider mb-3 font-medium" style={{ color: designSystem.colors.muted }}>
            Properties
          </div>

          <div className="space-y-5">
            <div>
              <div className="text-sm mb-1" style={{ color: designSystem.colors.muted }}>Selected</div>
              <div className="font-semibold" style={{ color: designSystem.colors.text }}>None</div>
            </div>

            <div>
              <div className="text-sm mb-2" style={{ color: designSystem.colors.muted }}>Annotations</div>
              <div className="text-2xl font-bold" style={{ color: designSystem.colors.text }}>
                {annotations.length}
              </div>
            </div>

            <div>
              <div className="text-sm mb-2" style={{ color: designSystem.colors.muted }}>Actions</div>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: "rgba(34, 197, 94, 0.15)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    color: "#22c55e",
                  }}
                >
                  Approve
                </button>
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "#ef4444",
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
