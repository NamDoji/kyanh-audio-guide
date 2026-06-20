"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Compass, Eye, EyeOff, Lock } from "lucide-react";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/admin";

  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push(redirect);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({})) as { message?: string };
      setError(data.message ?? "Đăng nhập thất bại");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl bg-[var(--ocean)] text-white shadow-xl">
            <Compass className="size-8" />
          </div>
          <h1 className="text-2xl font-black text-[var(--ink)]">Admin Panel</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Địa đạo Kỳ Anh Audio Guide</p>
        </div>

        {/* Card */}
        <form
          onSubmit={submit}
          className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-2xl backdrop-blur"
        >
          <label className="mb-2 block text-sm font-black text-[var(--ink)]">
            <Lock className="mr-1 inline size-4" />
            Mật khẩu Admin
          </label>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu..."
              autoFocus
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 pr-12 text-base focus:border-[var(--ocean)] focus:outline-none"
              aria-label="Admin password"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--muted)]"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>

          {error && (
            <p role="alert" className="mt-3 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="mt-5 w-full min-h-12 rounded-2xl bg-[var(--ocean)] text-base font-black text-white shadow-lg transition hover:bg-[var(--teal)] disabled:opacity-50"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[var(--muted)]">
          Chỉ dành cho quản trị viên hệ thống
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
