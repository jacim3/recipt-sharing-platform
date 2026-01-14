"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const DIFFICULTY_OPTIONS = ["쉬움", "보통", "어려움"] as const;
const CATEGORY_OPTIONS = [
  "한식",
  "양식",
  "중식",
  "일식",
  "디저트",
  "음료",
  "간식",
  "건강식",
] as const;

export function RecipeForm() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [cookingTime, setCookingTime] = useState<number | "">("");
  const [difficulty, setDifficulty] = useState<"쉬움" | "보통" | "어려움" | "">("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("로그인이 필요합니다.");
      }

      // 필수 필드 검증
      if (!title.trim()) {
        throw new Error("레시피 제목을 입력해주세요.");
      }
      if (!ingredients.trim()) {
        throw new Error("재료를 입력해주세요.");
      }
      if (!instructions.trim()) {
        throw new Error("조리 방법을 입력해주세요.");
      }

      // 레시피 생성
      const insertData = {
        user_id: user.id,
        title: title.trim(),
        ingredients: ingredients.trim(),
        instructions: instructions.trim(),
        cooking_time: cookingTime ? Number(cookingTime) : null,
        difficulty: difficulty || null,
        category: category || null,
      };
      
      const { data, error: insertError } = await ((supabase
        .from("recipes") as any)
        .insert(insertData as any)
        .select()
        .single() as any);

      if (insertError) throw insertError;

      // 성공 시 레시피 상세 페이지로 이동
      router.push(`/recipes/${data.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "레시피 작성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          레시피 제목 <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="예: 토마토 파스타"
          maxLength={100}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          재료 <span className="text-rose-500">*</span>
        </label>
        <textarea
          required
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="예:&#10;토마토 2개&#10;파스타면 200g&#10;올리브오일 2큰술"
          rows={6}
        />
        <p className="mt-1 text-sm text-gray-500">
          각 재료를 줄바꿈으로 구분하여 입력하세요.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          조리 방법 <span className="text-rose-500">*</span>
        </label>
        <textarea
          required
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="예:&#10;1. 물을 끓입니다&#10;2. 파스타면을 넣고 10분간 끓입니다&#10;3. 토마토를 볶아 소스를 만듭니다"
          rows={8}
        />
        <p className="mt-1 text-sm text-gray-500">
          단계별로 줄바꿈하여 입력하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            조리 시간 (분)
          </label>
          <input
            type="number"
            min="1"
            value={cookingTime}
            onChange={(e) =>
              setCookingTime(e.target.value ? Number(e.target.value) : "")
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            난이도
          </label>
          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(
                e.target.value as "쉬움" | "보통" | "어려움" | ""
              )
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">선택 안함</option>
            {DIFFICULTY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            카테고리
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">선택 안함</option>
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "저장 중..." : "레시피 등록"}
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
