import { redirect, notFound } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { RecipeEditForm } from "@/components/recipes/RecipeEditForm";

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  // 로그인 상태 확인
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // 레시피 가져오기
  const { data: recipe, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !recipe) {
    notFound();
  }

  // 작성자 확인
  if (recipe.user_id !== session.user.id) {
    redirect(`/recipes/${id}`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">레시피 수정</h1>
            <p className="mt-2 text-gray-600">
              레시피 정보를 수정해주세요
            </p>
          </div>
          <RecipeEditForm recipe={recipe} />
        </div>
      </div>
    </div>
  );
}
