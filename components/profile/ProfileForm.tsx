"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { Profile } from "@/types/database";

export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [username, setUsername] = useState(profile?.username || "");
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUsername(profile?.username || "");
    setFullName(profile?.full_name || "");
  }, [profile]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("로그인이 필요합니다.");
      }

      // username 중복 확인
      if (username && username !== profile?.username) {
        const { data: existing } = await supabase
          .from("profiles")
          .select("id")
          .eq("username", username)
          .single();

        if (existing) {
          throw new Error("이미 사용 중인 사용자명입니다.");
        }
      }

      // 프로필 업데이트
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          username: username || null,
          full_name: fullName || null,
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setMessage("프로필이 성공적으로 업데이트되었습니다!");
      router.refresh();

      // 3초 후 메시지 제거
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setError(err?.message || "프로필 업데이트 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          사용자명 <span className="text-gray-400">(선택사항)</span>
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="사용자명을 입력하세요"
          maxLength={50}
        />
        <p className="mt-1 text-sm text-gray-500">
          다른 사용자들에게 표시될 이름입니다. 비워두면 이메일 주소가 표시됩니다.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          전체 이름 <span className="text-gray-400">(선택사항)</span>
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="실명을 입력하세요"
          maxLength={100}
        />
        <p className="mt-1 text-sm text-gray-500">
          본인의 이름을 입력하세요. 선택사항입니다.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "저장 중..." : "프로필 저장"}
        </button>
        <a
          href="/dashboard"
          className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors inline-block text-center"
        >
          취소
        </a>
      </div>
    </form>
  );
}
