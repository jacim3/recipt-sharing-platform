import { notFound } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { DeleteRecipeButton } from "@/components/recipes/DeleteRecipeButton";
import type { Database } from "@/types/database";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  // 레시피 가져오기
  let recipe: any = null;
  let profile: any = null;

  // 1) FK가 설정돼 있으면 조인으로 한 번에 가져오기
  const joined = (await supabase
    .from("recipes")
    .select(
      `
      *,
      profiles!recipes_user_id_fkey (
        username,
        full_name
      )
    `
    )
    .eq("id", id)
    .single()) as any;

  if (!joined.error && joined.data) {
    recipe = joined.data;
    profile = Array.isArray(recipe.profiles)
      ? recipe.profiles[0]
      : recipe.profiles;
  } else {
    // 2) FK/스키마 캐시 문제면 조인 없이 가져오고 profile을 따로 조회
    if (joined.error?.code === "PGRST200" || joined.error) {
      const plain = (await supabase
        .from("recipes")
        .select("*")
        .eq("id", id)
        .single()) as {
        data: Database["public"]["Tables"]["recipes"]["Row"] | null;
        error: any;
      };

      if (!plain.error && plain.data) {
        recipe = plain.data;

        const profileRes = (await supabase
          .from("profiles")
          .select("username,full_name")
          .eq("id", recipe.user_id)
          .single()) as {
          data: Database["public"]["Tables"]["profiles"]["Row"] | null;
          error: any;
        };

        if (!profileRes.error && profileRes.data) {
          profile = profileRes.data;
        }
      }
    }
  }

  if (!recipe) {
    notFound();
  }

  // 현재 사용자 확인 (수정/삭제 버튼 표시용)
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isOwner = session?.user?.id === recipe.user_id;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* 헤더 */}
          <div className="mb-6 pb-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {recipe.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>작성자: {profile?.username || profile?.full_name || "익명"}</span>
                  <span>•</span>
                  <span>
                    {new Date(recipe.created_at).toLocaleDateString("ko-KR")}
                  </span>
                </div>
              </div>
              {isOwner && (
                <div className="flex gap-2">
                  <a
                    href={`/recipes/${id}/edit`}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors"
                  >
                    수정
                  </a>
                  <DeleteRecipeButton recipeId={id} />
                </div>
              )}
            </div>
          </div>

          {/* 메타 정보 */}
          <div className="mb-8 flex flex-wrap gap-4">
            {recipe.cooking_time && (
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-xl">⏱️</span>
                <span>{recipe.cooking_time}분</span>
              </div>
            )}
            {recipe.difficulty && (
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-xl">📊</span>
                <span>{recipe.difficulty}</span>
              </div>
            )}
            {recipe.category && (
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-xl">🏷️</span>
                <span>{recipe.category}</span>
              </div>
            )}
          </div>

          {/* 재료 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">재료</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                {recipe.ingredients}
              </pre>
            </div>
          </div>

          {/* 조리 방법 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">조리 방법</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                {recipe.instructions}
              </pre>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="pt-6 border-t">
            <a
              href="/dashboard"
              className="text-orange-600 hover:text-orange-700 font-semibold"
            >
              ← 대시보드로 돌아가기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
