"use client";

import { useState } from "react";

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      title: "AI-Assisted Labeling",
      description: "SAM 3 click-to-segment with human-in-the-loop quality control. 10x faster annotation.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611l-4.4.768a2.25 2.25 0 01-2.38-.054l-3.528-3.528a2.25 2.25 0 01-.054-2.38l.768-4.4a2.25 2.25 0 013.611-1.067l1.402 1.402" />
        </svg>
      ),
    },
    {
      title: "Human + AI Workforce",
      description: "Combine automated AI annotation with expert human labelers for enterprise-grade quality.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      title: "One-Click Model Training",
      description: "Train YOLO, DETR models directly on your annotated data. No ML expertise needed.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259 1.035a3.375 3.375 0 01-2.455-2.456L14.25 9l.259-1.035a3.375 3.375 0 012.455-2.456L18 5.25l.259 1.035a3.375 3.375 0 012.456 2.456L20.25 9l-.259 1.035a3.375 3.375 0 01-2.456 2.456zM16.894 20.567L16.5 21.75l-.394 1.183a2.25 2.25 0 01-1.973 1.557H9.427a2.25 2.25 0 01-1.973-1.557L7.5 21.75l-.394-1.183a2.25 2.25 0 111.973-3.138l.394-1.183.394 1.183a2.25 2.25 0 011.973 1.557h1.557a2.25 2.25 0 011.973-1.557z" />
        </svg>
      ),
    },
    {
      title: "Deploy to Production",
      description: "Export trained models with one click. REST API for real-time inference at scale.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
        </svg>
      ),
    },
  ];

  const annotationTools = [
    { name: "Bounding Box", key: "B", color: "#7c3aed" },
    { name: "Polygon", key: "P", color: "#22c55e" },
    { name: "Brush Mask", key: "M", color: "#f59e0b" },
    { name: "Magic Wand", key: "W", color: "#ec4899" },
    { name: "Keypoints", key: "K", color: "#06b6d4" },
    { name: "Auto AI", key: "A", color: "#8b5cf6" },
  ];

  const stats = [
    { value: "50M+", label: "Images Labeled" },
    { value: "10K+", label: "Models Deployed" },
    { value: "99.9%", label: "Accuracy SLA" },
    { value: "<500ms", label: "Inference Time" },
  ];

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
    effects: {
      shadow: "0 4px 20px rgba(124, 58, 237, 0.15)",
      radius: "12px",
    },
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: designSystem.colors.background }}>
      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b"
        style={{ borderColor: designSystem.colors.border, backgroundColor: "rgba(9, 9, 11, 0.8)" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
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

            <div className="hidden md:flex items-center gap-8">
              {["Features", "How It Works", "Pricing", "Enterprise", "Docs"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="text-sm transition-colors"
                  style={{ color: designSystem.colors.muted }}
                  onMouseEnter={(e) => (e.target.style.color = designSystem.colors.text)}
                  onMouseLeave={(e) => (e.target.style.color = designSystem.colors.muted)}
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                className="text-sm font-medium transition-colors"
                style={{ color: designSystem.colors.muted }}
                onMouseEnter={(e) => (e.target.style.color = designSystem.colors.text)}
                onMouseLeave={(e) => (e.target.style.color = designSystem.colors.muted)}
              >
                Sign In
              </button>
              <button
                className="px-5 py-2.5 rounded-xl font-medium text-sm transition-all"
                style={{
                  background: `linear-gradient(135deg, ${designSystem.colors.primary}, ${designSystem.colors.secondary})`,
                  color: "white",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = designSystem.effects.shadow;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{
              background: `linear-gradient(135deg, ${designSystem.colors.primary}20, ${designSystem.colors.secondary}20)`,
              border: `1px solid ${designSystem.colors.primary}40`,
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#22c55e" }} />
            <span className="text-sm font-medium" style={{ color: "#a78bfa" }}>
              Now with SAM 3 + Human Workforce
            </span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
            style={{ color: designSystem.colors.text }}
          >
            From Images to
            <br />
            <span
              style={{
                background: `linear-gradient(135deg, ${designSystem.colors.primary}, ${designSystem.colors.secondary}, ${designSystem.colors.accent})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Production-Ready Models
            </span>
          </h1>

          <p className="text-xl max-w-2xl mx-auto mb-10" style={{ color: designSystem.colors.muted }}>
            The complete training data platform. Label images with AI assistance,
            train computer vision models, and deploy to production — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              className="px-8 py-4 rounded-2xl font-semibold text-lg transition-all"
              style={{
                background: `linear-gradient(135deg, ${designSystem.colors.primary}, ${designSystem.colors.secondary})`,
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(124, 58, 237, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Start Free Trial
            </button>
            <button
              className="px-8 py-4 rounded-2xl font-medium text-lg transition-all flex items-center gap-2"
              style={{
                border: `1px solid ${designSystem.colors.border}`,
                color: designSystem.colors.text,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = designSystem.colors.primary;
                e.currentTarget.style.backgroundColor = `${designSystem.colors.primary}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = designSystem.colors.border;
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              View Demo
            </button>
          </div>

          {/* Stats Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="p-6 rounded-2xl border backdrop-blur-sm"
                style={{
                  background: `linear-gradient(135deg, ${designSystem.colors.surface}, ${designSystem.colors.background})`,
                  borderColor: designSystem.colors.border,
                }}
              >
                <div className="text-3xl font-bold mb-1" style={{ color: designSystem.colors.text }}>
                  {stat.value}
                </div>
                <div className="text-sm" style={{ color: designSystem.colors.muted }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline Section */}
      <section className="py-20 px-6" style={{ backgroundColor: designSystem.colors.surface }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: designSystem.colors.text }}>
              The Complete Training Data Pipeline
            </h2>
            <p className="text-lg" style={{ color: designSystem.colors.muted }}>
              From raw images to deployed models — all in one platform
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Upload & Label",
                description: "Upload images or connect cloud storage. Use AI-assisted tools for fast annotation.",
                detail: "SAM 3 + Human workforce",
              },
              {
                step: "02",
                title: "Quality Control",
                description: "Multi-review workflow with consensus scoring. Ensure dataset quality.",
                detail: "99.9% accuracy target",
              },
              {
                step: "03",
                title: "Train Models",
                description: "One-click training with YOLO, DETR. Auto-tuning for your data.",
                detail: "No ML expertise needed",
              },
              {
                step: "04",
                title: "Deploy to Prod",
                description: "REST API for real-time inference. Scale to millions of predictions.",
                detail: "< 500ms latency",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative p-6 rounded-2xl border"
                style={{
                  background: `linear-gradient(135deg, ${designSystem.colors.background}, ${designSystem.colors.surface})`,
                  borderColor: designSystem.colors.border,
                }}
              >
                <div
                  className="text-6xl font-bold absolute -top-4 -left-2"
                  style={{ color: designSystem.colors.primary, opacity: 0.15 }}
                >
                  {item.step}
                </div>
                <div className="relative pt-6">
                  <h3 className="text-xl font-semibold mb-2" style={{ color: designSystem.colors.text }}>
                    {item.title}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: designSystem.colors.muted }}>
                    {item.description}
                  </p>
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: `${designSystem.colors.primary}15`,
                      border: `1px solid ${designSystem.colors.primary}30`,
                      color: designSystem.colors.accent,
                    }}
                  >
                    {item.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: designSystem.colors.text }}>
              Everything You Need for Computer Vision
            </h2>
            <p className="text-lg" style={{ color: designSystem.colors.muted }}>
              AI-assisted labeling, workforce management, and model deployment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border transition-all cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${designSystem.colors.surface}, ${designSystem.colors.background})`,
                  borderColor: designSystem.colors.border,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = designSystem.colors.primary;
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 12px 40px rgba(124, 58, 237, 0.15)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = designSystem.colors.border;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{
                    background: `linear-gradient(135deg, ${designSystem.colors.primary}20, ${designSystem.colors.secondary}20)`,
                    color: designSystem.colors.primary,
                  }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: designSystem.colors.text }}>
                  {feature.title}
                </h3>
                <p className="text-sm" style={{ color: designSystem.colors.muted }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Canvas Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: designSystem.colors.text }}>
              Professional Annotation Tools
            </h2>
            <p className="text-lg" style={{ color: designSystem.colors.muted }}>
              Figma-like experience with AI superpowers
            </p>
          </div>

          <div
            className="rounded-3xl overflow-hidden border"
            style={{
              borderColor: designSystem.colors.border,
              backgroundColor: designSystem.colors.surface,
            }}
          >
            {/* Toolbar */}
            <div
              className="h-16 px-6 flex items-center gap-4 border-b"
              style={{ borderColor: designSystem.colors.border, backgroundColor: "rgba(24, 24, 27, 0.95)" }}
            >
              <div className="flex items-center gap-1">
                {annotationTools.map((tool, i) => (
                  <button
                    key={tool.key}
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold transition-all"
                    style={{
                      backgroundColor: activeFeature === i ? `${tool.color}20` : "transparent",
                      border: activeFeature === i ? `1px solid ${tool.color}` : "1px solid transparent",
                      color: activeFeature === i ? tool.color : designSystem.colors.muted,
                    }}
                    title={`${tool.name} (${tool.key})`}
                    onClick={() => setActiveFeature(i)}
                    onMouseEnter={(e) => {
                      if (activeFeature !== i) {
                        e.currentTarget.style.backgroundColor = `${designSystem.colors.border}`;
                        e.currentTarget.style.color = designSystem.colors.text;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeFeature !== i) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = designSystem.colors.muted;
                      }
                    }}
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
                {[
                  { label: "Image", value: "3/120" },
                  { label: "Zoom", value: "150%" },
                  { label: "Class", value: "Car" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span style={{ color: designSystem.colors.muted }}>{item.label}:</span>
                    <span className="font-medium" style={{ color: designSystem.colors.text }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Canvas Area */}
            <div className="flex" style={{ height: "500px" }}>
              {/* Left Sidebar */}
              <div
                className="w-56 p-4 border-r"
                style={{ borderColor: designSystem.colors.border, backgroundColor: "rgba(9, 9, 11, 0.5)" }}
              >
                <div className="text-xs uppercase tracking-wider mb-4 font-medium" style={{ color: designSystem.colors.muted }}>
                  Classes
                </div>
                <div className="space-y-2">
                  {[
                    { name: "Car", color: "#7c3aed" },
                    { name: "Pedestrian", color: "#22c55e" },
                    { name: "Cyclist", color: "#f59e0b" },
                    { name: "Traffic Light", color: "#ef4444" },
                    { name: "Sign", color: "#06b6d4" },
                  ].map((cls, i) => (
                    <div
                      key={cls.name}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all"
                      style={{
                        backgroundColor: i === 0 ? `${cls.color}15` : "transparent",
                        border: i === 0 ? `1px solid ${cls.color}40` : "1px solid transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (i !== 0) e.currentTarget.style.backgroundColor = designSystem.colors.border;
                      }}
                      onMouseLeave={(e) => {
                        if (i !== 0) e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <div className="w-4 h-4 rounded-lg" style={{ backgroundColor: cls.color }} />
                      <span className="text-sm font-medium" style={{ color: designSystem.colors.text }}>
                        {cls.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Center Canvas */}
              <div className="flex-1 relative" style={{ backgroundColor: "#09090b" }}>
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="relative w-full max-w-3xl">
                    <div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        backgroundImage: `
                          linear-gradient(${designSystem.colors.border}20 1px, transparent 1px),
                          linear-gradient(90deg, ${designSystem.colors.border}20 1px, transparent 1px)
                        `,
                        backgroundSize: "40px 40px",
                      }}
                    />
                    <div
                      className="h-80 rounded-2xl flex items-center justify-center relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${designSystem.colors.surface}, #0f0f12)`,
                        border: `1px solid ${designSystem.colors.border}`,
                      }}
                    >
                      <span style={{ color: designSystem.colors.muted, fontSize: "18px" }}>
                        Upload your image
                      </span>
                      <div
                        className="absolute rounded-lg"
                        style={{
                          top: "18%",
                          left: "12%",
                          width: "140px",
                          height: "90px",
                          border: "2px solid #7c3aed",
                          background: "linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(124, 58, 237, 0.05))",
                          boxShadow: "0 0 20px rgba(124, 58, 237, 0.3)",
                        }}
                      />
                      <div
                        className="absolute rounded-lg"
                        style={{
                          top: "55%",
                          left: "50%",
                          width: "100px",
                          height: "120px",
                          border: "2px solid #22c55e",
                          background: "linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05))",
                          boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)",
                        }}
                      />
                      <div
                        className="absolute bottom-4 right-4 px-4 py-2 rounded-xl text-sm backdrop-blur-md"
                        style={{
                          background: `linear-gradient(135deg, ${designSystem.colors.primary}30, ${designSystem.colors.secondary}30)`,
                          border: `1px solid ${designSystem.colors.primary}40`,
                          color: "#c084fc",
                        }}
                      >
                        SAM 3 ready — Click to segment
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div
                className="w-60 p-4 border-l"
                style={{ borderColor: designSystem.colors.border, backgroundColor: "rgba(9, 9, 11, 0.5)" }}
              >
                <div className="text-xs uppercase tracking-wider mb-4 font-medium" style={{ color: designSystem.colors.muted }}>
                  Properties
                </div>
                <div className="space-y-5">
                  <div>
                    <div className="text-sm mb-1" style={{ color: designSystem.colors.muted }}>Selected</div>
                    <div className="font-semibold" style={{ color: designSystem.colors.text }}>Car #12</div>
                  </div>
                  <div>
                    <div className="text-sm mb-2" style={{ color: designSystem.colors.muted }}>Confidence</div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: designSystem.colors.border }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: "87%",
                            background: `linear-gradient(90deg, ${designSystem.colors.primary}, ${designSystem.colors.secondary})`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium" style={{ color: designSystem.colors.text }}>87%</span>
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

            {/* Status Bar */}
            <div
              className="h-12 px-6 flex items-center gap-6 text-sm border-t"
              style={{ borderColor: designSystem.colors.border, backgroundColor: "rgba(24, 24, 27, 0.8)" }}
            >
              {["Auto-saved", "Ctrl+Z to undo", "Press ? for shortcuts"].map((item, i) => (
                <div key={i} className="flex items-center gap-2" style={{ color: designSystem.colors.muted }}>
                  {i > 0 && <span style={{ color: designSystem.colors.border }}>•</span>}
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-6 gap-6 text-sm">
            {[
              { key: "V", label: "Select" },
              { key: "B", label: "Box" },
              { key: "P", label: "Polygon" },
              { key: "W", label: "SAM Wand" },
              { key: "D/A", label: "Next/Prev" },
            ].map((item) => (
              <div key={item.key} className="flex items-center gap-2" style={{ color: designSystem.colors.muted }}>
                <kbd
                  className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium"
                  style={{
                    backgroundColor: designSystem.colors.surface,
                    border: `1px solid ${designSystem.colors.border}`,
                    color: designSystem.colors.text,
                  }}
                >
                  {item.key}
                </kbd>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section id="enterprise" className="py-20 px-6" style={{ backgroundColor: designSystem.colors.surface }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 text-sm font-medium"
                style={{
                  background: `${designSystem.colors.primary}15`,
                  border: `1px solid ${designSystem.colors.primary}30`,
                  color: designSystem.colors.accent,
                }}
              >
                Enterprise
              </div>
              <h2 className="text-4xl font-bold mb-6" style={{ color: designSystem.colors.text }}>
                Human + AI Workforce for Enterprise Scale
              </h2>
              <p className="text-lg mb-8" style={{ color: designSystem.colors.muted }}>
                Combine automated AI annotation with our expert human workforce.
                Scale to millions of images with guaranteed quality and security.
              </p>
              <div className="space-y-4">
                {[
                  "Dedicated project managers",
                  "SLA-backed quality control",
                  "SSO/SAML authentication",
                  "Audit logs & compliance",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <svg className="w-5 h-5" style={{ color: "#22c55e" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span style={{ color: designSystem.colors.text }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="p-8 rounded-3xl border"
              style={{
                background: `linear-gradient(135deg, ${designSystem.colors.background}, ${designSystem.colors.surface})`,
                borderColor: designSystem.colors.border,
              }}
            >
              <div className="text-6xl font-bold mb-4" style={{ color: designSystem.colors.primary }}>
                99.9%
              </div>
              <div className="text-xl font-semibold mb-2" style={{ color: designSystem.colors.text }}>
                Quality Assurance SLA
              </div>
              <div className="text-sm" style={{ color: designSystem.colors.muted }}>
                Our human-in-the-loop workflow ensures every dataset meets enterprise quality standards.
                Double-blind consensus scoring, multi-review rounds, and expert validation.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: designSystem.colors.text }}>
              Simple, Scalable Pricing
            </h2>
            <p className="text-lg" style={{ color: designSystem.colors.muted }}>
              Start free, scale as you grow. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$0",
                period: "forever",
                description: "For individuals and small projects",
                features: [
                  "1,000 images/month",
                  "Basic annotation tools",
                  "SAM 3 assistance",
                  "Export to COCO/YOLO",
                  "1 project",
                ],
                cta: "Get Started Free",
                highlight: false,
              },
              {
                name: "Pro",
                price: "$49",
                period: "/month",
                description: "For professional teams",
                features: [
                  "Unlimited images",
                  "All annotation types",
                  "Model training (YOLO)",
                  "Team collaboration",
                  "Priority support",
                  "10 projects",
                ],
                cta: "Start 14-Day Trial",
                highlight: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "",
                description: "For large-scale operations",
                features: [
                  "Unlimited everything",
                  "Human workforce access",
                  "Dedicated manager",
                  "SSO/SAML",
                  "SLA + Audit logs",
                  "On-premise option",
                ],
                cta: "Contact Sales",
                highlight: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className="p-8 rounded-3xl border transition-all"
                style={{
                  background: plan.highlight
                    ? `linear-gradient(135deg, ${designSystem.colors.primary}10, ${designSystem.colors.secondary}05)`
                    : `linear-gradient(135deg, ${designSystem.colors.surface}, ${designSystem.colors.background})`,
                  borderColor: plan.highlight ? designSystem.colors.primary : designSystem.colors.border,
                  borderWidth: plan.highlight ? "2px" : "1px",
                }}
              >
                <div className="text-lg font-semibold mb-1" style={{ color: designSystem.colors.text }}>
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold" style={{ color: designSystem.colors.text }}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm" style={{ color: designSystem.colors.muted }}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <div className="text-sm mb-6" style={{ color: designSystem.colors.muted }}>
                  {plan.description}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <svg className="w-5 h-5 flex-shrink-0" style={{ color: "#22c55e" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span style={{ color: designSystem.colors.text }}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-3 rounded-xl font-medium transition-all"
                  style={
                    plan.highlight
                      ? {
                          background: `linear-gradient(135deg, ${designSystem.colors.primary}, ${designSystem.colors.secondary})`,
                          color: "white",
                        }
                      : {
                          border: `1px solid ${designSystem.colors.border}`,
                          color: designSystem.colors.text,
                        }
                  }
                  onMouseEnter={(e) => {
                    if (plan.highlight) {
                      e.currentTarget.style.boxShadow = "0 4px 20px rgba(124, 58, 237, 0.4)";
                    } else {
                      e.currentTarget.style.borderColor = designSystem.colors.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    if (!plan.highlight) {
                      e.currentTarget.style.borderColor = designSystem.colors.border;
                    }
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t" style={{ borderColor: designSystem.colors.border }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
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
            <div className="flex items-center gap-8 text-sm" style={{ color: designSystem.colors.muted }}>
              {["Documentation", "API", "Privacy", "Terms"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="transition-colors"
                  onMouseEnter={(e) => (e.target.style.color = designSystem.colors.text)}
                  onMouseLeave={(e) => (e.target.style.color = designSystem.colors.muted)}
                >
                  {item}
                </a>
              ))}
            </div>
            <div className="text-sm" style={{ color: designSystem.colors.muted }}>
              © 2026 LabelFlow. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
