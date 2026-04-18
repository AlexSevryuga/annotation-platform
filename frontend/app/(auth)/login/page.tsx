"use client";

import { useState } from "react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Something went wrong");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      window.location.href = "/workspace";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#09090b" }}>
      <div
        className="w-full max-w-md p-8 rounded-3xl border"
        style={{
          background: "linear-gradient(135deg, #18181b, #09090b)",
          borderColor: "#27272a",
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
          >
            <span className="text-white font-bold text-lg">LF</span>
          </div>
          <span className="text-2xl font-bold" style={{ color: "#fafafa" }}>
            LabelFlow
          </span>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 rounded-xl p-1" style={{ backgroundColor: "#27272a" }}>
          <button
            onClick={() => setIsLogin(true)}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: isLogin ? "#7c3aed" : "transparent",
              color: isLogin ? "white" : "#71717a",
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: !isLogin ? "#7c3aed" : "transparent",
              color: !isLogin ? "white" : "#71717a",
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm mb-2" style={{ color: "#71717a" }}>
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border outline-none transition-all"
                style={{
                  backgroundColor: "#18181b",
                  borderColor: "#27272a",
                  color: "#fafafa",
                }}
                placeholder="Your name"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-sm mb-2" style={{ color: "#71717a" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border outline-none transition-all"
              style={{
                backgroundColor: "#18181b",
                borderColor: "#27272a",
                color: "#fafafa",
              }}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: "#71717a" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border outline-none transition-all"
              style={{
                backgroundColor: "#18181b",
                borderColor: "#27272a",
                color: "#fafafa",
              }}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div
              className="p-3 rounded-xl text-sm"
              style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#ef4444" }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-lg transition-all"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              color: "white",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Demo hint */}
        <div className="mt-6 p-4 rounded-xl text-sm" style={{ backgroundColor: "#18181b" }}>
          <span style={{ color: "#71717a" }}>Demo mode: Use any email/password to register</span>
        </div>
      </div>
    </div>
  );
}
