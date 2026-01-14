"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const title = mode === "login" ? "로그인" : "회원가입";
  const submitLabel = mode === "login" ? "로그인" : "회원가입";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push("/dashboard");
        router.refresh();
        return;
      }

      // signup
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // 이메일 확인 링크를 누르면 이 경로로 돌아오게 설정
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (signUpError) throw signUpError;

      setMessage("가입 요청을 보냈어요. 이메일에서 인증 링크를 확인해주세요.");
    } catch (err: any) {
      setError(err?.message ?? "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <div className="mb-6">
          <Link href="/" className="text-orange-600 font-bold text-lg">
            ← RecipeShare
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">{title}</h1>
          <p className="mt-1 text-sm text-gray-600">
            {mode === "login"
              ? "이메일/비밀번호로 로그인합니다."
              : "이메일 인증을 통해 계정을 활성화합니다."}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="6자 이상"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-sm text-rose-800">
              {error}
            </div>
          )}
          {message && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-800">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white rounded-lg py-2 font-semibold hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "처리 중..." : submitLabel}
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600">
          {mode === "login" ? (
            <p>
              계정이 없나요?{" "}
              <Link href="/signup" className="text-orange-600 font-semibold">
                회원가입
              </Link>
            </p>
          ) : (
            <p>
              이미 계정이 있나요?{" "}
              <Link href="/login" className="text-orange-600 font-semibold">
                로그인
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

