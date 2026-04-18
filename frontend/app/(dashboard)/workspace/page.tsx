"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: string;
  created_at: string;
}

interface Project {
  id: string;
  name: string;
  annotation_type: string;
  created_at: string;
}

export default function DashboardPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchWorkspaces(token);
  }, []);

  const fetchWorkspaces = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/workspaces`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setWorkspaces(data);
        if (data.length > 0) {
          setSelectedWorkspace(data[0]);
          fetchProjects(token, data[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch workspaces:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async (token: string, workspaceId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects/workspace/${workspaceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: designSystem.colors.background }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl mb-4 mx-auto animate-pulse" style={{ background: `linear-gradient(135deg, ${designSystem.colors.primary}, ${designSystem.colors.secondary})` }} />
          <span style={{ color: designSystem.colors.muted }}>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: designSystem.colors.background }}>
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b"
        style={{ borderColor: designSystem.colors.border, backgroundColor: "rgba(9, 9, 11, 0.8)" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${designSystem.colors.primary}, ${designSystem.colors.secondary})` }}
            >
              <span className="text-white font-bold">LF</span>
            </div>
            <span className="text-lg font-semibold" style={{ color: designSystem.colors.text }}>
              LabelFlow
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              border: `1px solid ${designSystem.colors.border}`,
              color: designSystem.colors.muted,
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Workspaces */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold" style={{ color: designSystem.colors.text }}>
                Workspaces
              </h2>
              <button
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: `linear-gradient(135deg, ${designSystem.colors.primary}, ${designSystem.colors.secondary})`,
                  color: "white",
                }}
              >
                Create Workspace
              </button>
            </div>

            {workspaces.length === 0 ? (
              <div
                className="p-8 rounded-2xl border text-center"
                style={{
                  background: designSystem.colors.surface,
                  borderColor: designSystem.colors.border,
                }}
              >
                <p style={{ color: designSystem.colors.muted }}>
                  No workspaces yet. Create your first workspace to get started.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setSelectedWorkspace(ws);
                      fetchProjects(localStorage.getItem("token") || "", ws.id);
                    }}
                    className="p-6 rounded-2xl border text-left transition-all"
                    style={{
                      background: selectedWorkspace?.id === ws.id
                        ? `linear-gradient(135deg, ${designSystem.colors.primary}15, ${designSystem.colors.secondary}05)`
                        : designSystem.colors.surface,
                      borderColor: selectedWorkspace?.id === ws.id
                        ? designSystem.colors.primary
                        : designSystem.colors.border,
                      borderWidth: selectedWorkspace?.id === ws.id ? "2px" : "1px",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${designSystem.colors.primary}, ${designSystem.colors.secondary})` }}
                      >
                        <span className="text-white font-bold text-sm">
                          {ws.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold" style={{ color: designSystem.colors.text }}>
                          {ws.name}
                        </div>
                        <div className="text-xs capitalize" style={{ color: designSystem.colors.muted }}>
                          {ws.plan} plan
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Projects */}
          {selectedWorkspace && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold" style={{ color: designSystem.colors.text }}>
                  Projects in {selectedWorkspace.name}
                </h2>
                <button
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${designSystem.colors.primary}, ${designSystem.colors.secondary})`,
                    color: "white",
                  }}
                >
                  New Project
                </button>
              </div>

              {projects.length === 0 ? (
                <div
                  className="p-8 rounded-2xl border text-center"
                  style={{
                    background: designSystem.colors.surface,
                    borderColor: designSystem.colors.border,
                  }}
                >
                  <p style={{ color: designSystem.colors.muted }}>
                    No projects yet. Create your first project to start annotating.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => router.push(`/annotate/${project.id}`)}
                      className="p-6 rounded-2xl border text-left transition-all card-hover"
                      style={{
                        background: designSystem.colors.surface,
                        borderColor: designSystem.colors.border,
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ background: `${designSystem.colors.primary}20` }}
                        >
                          <svg className="w-6 h-6" style={{ color: designSystem.colors.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m0 0v9m0 0v-9m-9 4.5h9M3 3l3 15h9M3 3l3 15h9" />
                          </svg>
                        </div>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                          style={{ backgroundColor: `${designSystem.colors.primary}20`, color: designSystem.colors.accent }}
                        >
                          {project.annotation_type}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2" style={{ color: designSystem.colors.text }}>
                        {project.name}
                      </h3>
                      <p className="text-sm" style={{ color: designSystem.colors.muted }}>
                        Click to open annotation editor
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
