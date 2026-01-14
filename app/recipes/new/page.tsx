import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { RecipeForm } from "@/components/recipes/RecipeForm";

export default async function NewRecipePage() {
  // 로그인 상태 확인
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 미로그인 시 로그인 페이지로 리디렉션
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">새 레시피 작성</h1>
            <p className="mt-2 text-gray-600">
              맛있는 레시피를 공유해주세요!
            </p>
          </div>
          <RecipeForm />
        </div>
      </div>
    </div>
  );
}
