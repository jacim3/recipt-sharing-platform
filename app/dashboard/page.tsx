import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";

export default async function DashboardPage() {
  // 로그인 상태 확인
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 미로그인 시 로그인 페이지로 리디렉션
  if (!session) {
    redirect("/login");
  }

  // 레시피 데이터 가져오기
  let recipes: any[] | null = null;

  // 1) FK가 설정돼 있으면 조인으로 한 번에 가져오기
  const joined = await supabase
    .from("recipes")
    .select(
      `
      *,
      profile!recipes_user_id_fkey (
        username,
        full_name
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(12);

  if (!joined.error) {
    recipes = joined.data;
  } else {
    // 2) FK/스키마 캐시 문제(PGRST200)면 조인 없이 가져오고 profile을 따로 조회해서 합치기
    if (joined.error.code === "PGRST200") {
      const plain = await supabase
        .from("recipes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(12);

      if (!plain.error) {
        recipes = plain.data;

        const userIds = Array.from(
          new Set((recipes ?? []).map((r) => r.user_id).filter(Boolean))
        );

        if (userIds.length > 0) {
          const profilesRes = await supabase
            .from("profiles")
            .select("id,username,full_name")
            .in("id", userIds);

          if (!profilesRes.error && profilesRes.data) {
            const byId = new Map(profilesRes.data.map((p: any) => [p.id, p]));
            recipes = (recipes ?? []).map((r) => ({
              ...r,
              profile: byId.get(r.user_id) ?? null,
            }));
          }
        }
      }
    }
  }

  // 레시피 데이터 포맷팅
  const displayRecipes =
    recipes && recipes.length > 0
      ? recipes.map((recipe: any) => {
          const profile = Array.isArray(recipe.profile)
            ? recipe.profile[0]
            : recipe.profile;
          return {
            id: recipe.id,
            title: recipe.title,
            author: profile?.username || profile?.full_name || "익명",
            time: recipe.cooking_time ? `${recipe.cooking_time}분` : "시간 미정",
            difficulty: recipe.difficulty || "보통",
            category: recipe.category || "기타",
            created_at: recipe.created_at,
          };
        })
      : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Dashboard Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">레시피 대시보드</h1>
              <p className="mt-2 text-gray-600">
                커뮤니티의 맛있는 레시피를 탐색해보세요
              </p>
            </div>
            <a
              href="/recipes/new"
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              + 레시피 올리기
            </a>
          </div>
        </div>
      </section>

      {/* Recipe Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {displayRecipes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍳</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              아직 등록된 레시피가 없습니다
            </h3>
            <p className="text-gray-600 mb-6">
              첫 번째 레시피를 올려서 커뮤니티를 시작해보세요!
            </p>
            <a
              href="/recipes/new"
              className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              레시피 올리기
            </a>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                최신 레시피 ({displayRecipes.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayRecipes.map((recipe) => (
                <a
                  key={recipe.id}
                  href={`/recipes/${recipe.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                    <span className="text-6xl">
                      {recipe.category === "한식"
                        ? "🍚"
                        : recipe.category === "양식"
                        ? "🍝"
                        : recipe.category === "중식"
                        ? "🥢"
                        : recipe.category === "일식"
                        ? "🍣"
                        : recipe.category === "디저트"
                        ? "🍰"
                        : recipe.category === "음료"
                        ? "🥤"
                        : recipe.category === "간식"
                        ? "🍪"
                        : recipe.category === "건강식"
                        ? "🥗"
                        : "🍳"}
                    </span>
                  </div>
                  <div className="p-5">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      {recipe.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-3">
                      작성자: {recipe.author}
                    </p>
                    <div className="flex gap-4 text-sm text-gray-500 mb-3">
                      <span>⏱️ {recipe.time}</span>
                      <span>📊 {recipe.difficulty}</span>
                      {recipe.category && <span>🏷️ {recipe.category}</span>}
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(recipe.created_at).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
