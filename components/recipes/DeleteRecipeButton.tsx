"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function DeleteRecipeButton({ recipeId }: { recipeId: string }) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("로그인이 필요합니다.");
      }

      // 레시피 삭제
      const { error: deleteError } = await supabase
        .from("recipes")
        .delete()
        .eq("id", recipeId)
        .eq("user_id", user.id); // 작성자 확인

      if (deleteError) {
        // 작성자가 아닌 경우 또는 다른 오류
        if (deleteError.code === "PGRST116") {
          throw new Error("삭제할 레시피를 찾을 수 없거나 권한이 없습니다.");
        }
        throw deleteError;
      }

      // 성공 시 대시보드로 이동
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "레시피 삭제 중 오류가 발생했습니다.");
      setLoading(false);
    }
  }

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
      >
        삭제
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-gray-900 mb-4">레시피 삭제</h3>
        <p className="text-gray-600 mb-6">
          정말로 이 레시피를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "삭제 중..." : "삭제"}
          </button>
          <button
            onClick={() => {
              setShowConfirm(false);
              setError(null);
            }}
            disabled={loading}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
