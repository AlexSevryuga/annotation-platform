"use client";

import { useState } from "react";

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "AI-Powered Segmentation",
      description: "SAM 3 click-to-segment, text prompts, and auto-segmentation for instant annotations",
      icon: "🎯",
    },
    {
      title: "Real-time Collaboration",
      description: "Work together with your team. See cursors, comments, and instant updates",
      icon: "👥",
    },
    {
      title: "Smart Workflow",
      description: "Assign, review, approve. Full pipeline with quality control and consensus scoring",
      icon: "🔄",
    },
    {
      title: "Model Training",
      description: "Train YOLO, RF-DETR models directly on your annotated data with one click",
      icon: "🧠",
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
    { value: "1M+", label: "Images Annotated" },
    { value: "50K+", label: "Projects Created" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "<200ms", label: "SAM Inference" },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-lg font-semibold">AI Studio</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-zinc-400 hover:text-white transition-colors">Features</a>
              <a href="#demo" className="text-zinc-400 hover:text-white transition-colors">Demo</a>
              <a href="#pricing" className="text-zinc-400 hover:text-white transition-colors">Pricing</a>
              <a href="#docs" className="text-zinc-400 hover:text-white transition-colors">Docs</a>
            </div>

            <div className="flex items-center gap-4">
              <button className="text-zinc-400 hover:text-white transition-colors">Sign In</button>
              <button className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg font-medium transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-violet-300">SAM 3 Integration Available</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Annotate Images
            <br />
            <span className="gradient-text">10x Faster</span>
            <br />
            with AI
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            The professional annotation platform with SAM 3 integration,
            real-time collaboration, and one-click model training.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <button className="px-8 py-4 bg-violet-600 hover:bg-violet-700 rounded-xl font-semibold text-lg transition-all hover:scale-105">
              Start Free Trial
            </button>
            <button className="px-8 py-4 border border-zinc-700 hover:border-zinc-600 rounded-xl font-medium text-lg transition-colors">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Canvas Section */}
      <section id="demo" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Professional Annotation Canvas</h2>
            <p className="text-zinc-400 text-lg">Figma-like experience with AI superpowers</p>
          </div>

          {/* Canvas Mock */}
          <div className="canvas-mock aspect-video relative overflow-hidden">
            {/* Toolbar */}
            <div className="absolute top-0 left-0 right-0 h-14 bg-zinc-900/80 border-b border-zinc-800 flex items-center px-4 gap-2">
              <div className="flex items-center gap-1">
                {annotationTools.map((tool) => (
                  <button
                    key={tool.key}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all hover:bg-zinc-800"
                    style={{
                      background: activeFeature === annotationTools.indexOf(tool) ? tool.color + "20" : "transparent",
                      border: activeFeature === annotationTools.indexOf(tool) ? `1px solid ${tool.color}` : "1px solid transparent",
                      color: activeFeature === annotationTools.indexOf(tool) ? tool.color : "#71717a",
                    }}
                    title={`${tool.name} (${tool.key})`}
                  >
                    {tool.key}
                  </button>
                ))}
              </div>

              <div className="w-px h-8 bg-zinc-700 mx-2" />

              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded text-sm bg-violet-600 text-white font-medium">
                  SAM 3
                </button>
              </div>

              <div className="ml-auto flex items-center gap-4 text-sm text-zinc-500">
                <span>Image 3/120</span>
                <span>Zoom: 150%</span>
                <span>Class: Car</span>
              </div>
            </div>

            {/* Canvas Area */}
            <div className="absolute top-14 left-0 right-0 bottom-14 flex">
              {/* Left Sidebar - Classes */}
              <div className="w-48 bg-zinc-900/50 border-r border-zinc-800 p-4">
                <div className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Classes</div>
                <div className="space-y-2">
                  {[
                    { name: "Car", color: "#7c3aed" },
                    { name: "Pedestrian", color: "#22c55e" },
                    { name: "Cyclist", color: "#f59e0b" },
                    { name: "Traffic Light", color: "#ef4444" },
                    { name: "Sign", color: "#06b6d4" },
                  ].map((cls) => (
                    <div
                      key={cls.name}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-800 cursor-pointer"
                    >
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: cls.color }} />
                      <span className="text-sm">{cls.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Center - Image Canvas */}
              <div className="flex-1 relative bg-zinc-950">
                {/* Mock image with annotations */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Background grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,#18181b_25%,transparent_25%)] bg-[length:20px_20px]" />

                    {/* Mock image placeholder */}
                    <div className="w-[600px] h-[400px] bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg flex items-center justify-center border border-zinc-700 relative">
                      <span className="text-zinc-600 text-lg">Upload your image</span>

                      {/* Bounding boxes */}
                      <div className="absolute top-[20%] left-[15%] w-32 h-20 border-2 border-violet-500 rounded bg-violet-500/10" />
                      <div className="absolute top-[60%] left-[55%] w-24 h-28 border-2 border-green-500 rounded bg-green-500/10" />
                      <div className="absolute top-[35%] left-[70%] w-20 h-16 border-2 border-yellow-500 rounded bg-yellow-500/10" />

                      {/* Polygon */}
                      <svg className="absolute top-[45%] left-[25%] w-28 h-20">
                        <polygon
                          points="0,20 28,0 28,20 14,28"
                          fill="none"
                          stroke="#ec4899"
                          strokeWidth="2"
                          className="opacity-50"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* SAM Preview overlay */}
                <div className="absolute bottom-4 right-4 glass rounded-lg p-3 text-xs text-zinc-400">
                  SAM 3 ready • Click to segment
                </div>
              </div>

              {/* Right Sidebar - Properties */}
              <div className="w-56 bg-zinc-900/50 border-l border-zinc-800 p-4">
                <div className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Properties</div>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-zinc-400 mb-1">Selected</div>
                    <div className="text-white font-medium">Car #12</div>
                  </div>

                  <div>
                    <div className="text-sm text-zinc-400 mb-1">Confidence</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-zinc-700 rounded-full overflow-hidden">
                        <div className="w-[87%] h-full bg-violet-500" />
                      </div>
                      <span className="text-sm">87%</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-zinc-400 mb-1">Actions</div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-xs bg-green-500/20 text-green-400 rounded border border-green-500/30">
                        Approve
                      </button>
                      <button className="px-3 py-1.5 text-xs bg-red-500/20 text-red-400 rounded border border-red-500/30">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-zinc-900/80 border-t border-zinc-800 flex items-center px-4 text-xs text-zinc-500">
              <span>Auto-saved</span>
              <span className="mx-4">•</span>
              <span>Ctrl+Z to undo</span>
              <span className="mx-4">•</span>
              <span>Press ? for shortcuts</span>
            </div>
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="flex justify-center mt-6 gap-6 text-sm text-zinc-500">
            <span><kbd className="px-2 py-1 bg-zinc-800 rounded">V</kbd> Select</span>
            <span><kbd className="px-2 py-1 bg-zinc-800 rounded">B</kbd> Box</span>
            <span><kbd className="px-2 py-1 bg-zinc-800 rounded">P</kbd> Polygon</span>
            <span><kbd className="px-2 py-1 bg-zinc-800 rounded">W</kbd> SAM Wand</span>
            <span><kbd className="px-2 py-1 bg-zinc-800 rounded">D/A</kbd> Next/Prev</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-zinc-400 text-lg">From annotation to production in one platform</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 card-hover"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-zinc-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-zinc-400 text-lg">Three simple steps to production-ready data</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload & Organize",
                description: "Upload images or connect to cloud storage. Organize into projects with custom classes.",
              },
              {
                step: "02",
                title: "Annotate with AI",
                description: "Use bounding boxes, polygons, or let SAM 3 auto-segment. Collaborate in real-time.",
              },
              {
                step: "03",
                title: "Train & Deploy",
                description: "Export in any format. Train models with one click. Deploy to production.",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-8xl font-bold text-violet-600/20 absolute -top-4 -left-2">
                  {item.step}
                </div>
                <div className="relative pt-12">
                  <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-zinc-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-zinc-400 text-lg">Start free, scale as you grow</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                description: "For individuals and hobbyists",
                features: ["1,000 images/month", "Basic annotation tools", "1 project", "Export to COCO/YOLO"],
                cta: "Get Started",
                highlight: false,
              },
              {
                name: "Pro",
                price: "$49",
                description: "For professional teams",
                features: ["Unlimited images", "SAM 3 access", "10 projects", "Team collaboration", "Priority support"],
                cta: "Start Trial",
                highlight: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large organizations",
                features: ["Unlimited everything", "SSO/SAML", "Audit logs", "Dedicated support", "On-premise option"],
                cta: "Contact Sales",
                highlight: false,
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl border ${
                  plan.highlight
                    ? "border-violet-500 bg-gradient-to-b from-violet-500/10 to-transparent"
                    : "border-zinc-800 bg-zinc-900/50"
                }`}
              >
                <div className="text-lg font-semibold mb-2">{plan.name}</div>
                <div className="text-4xl font-bold mb-1">{plan.price}</div>
                <div className="text-sm text-zinc-400 mb-6">{plan.description}</div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-xl font-medium transition-all ${
                    plan.highlight
                      ? "bg-violet-600 hover:bg-violet-700"
                      : "border border-zinc-700 hover:border-zinc-600"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-lg font-semibold">AI Studio</span>
            </div>

            <div className="flex items-center gap-8 text-sm text-zinc-500">
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">API</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>

            <div className="text-sm text-zinc-500">
              © 2026 AI Studio. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}