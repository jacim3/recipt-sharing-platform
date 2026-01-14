import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  // 로그인 상태 확인
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 미로그인 시 로그인 페이지로 리디렉션
  if (!session) {
    redirect("/login");
  }

  // 현재 사용자의 프로필 가져오기
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  // 프로필이 없으면 생성 (트리거가 작동하지 않은 경우 대비)
  if (error || !profile) {
    // 프로필이 없으면 기본값으로 생성
    const { data: newProfile } = await supabase
      .from("profiles")
      .insert({
        id: session.user.id,
        username: session.user.email?.split("@")[0] || null,
        full_name: null,
      })
      .select()
      .single();

    if (newProfile) {
      return (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">프로필 설정</h1>
              <ProfileForm profile={newProfile} />
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">프로필 설정</h1>
            <p className="mt-2 text-gray-600">
              프로필 정보를 수정하여 다른 사용자들에게 자신을 소개하세요
            </p>
          </div>

          <div className="mb-6 pb-6 border-b">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profile?.username?.[0]?.toUpperCase() || profile?.full_name?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {profile?.full_name || profile?.username || "이름 없음"}
                </h2>
                <p className="text-gray-600">{session.user.email}</p>
                <p className="text-sm text-gray-400 mt-1">
                  가입일: {new Date(profile?.created_at || "").toLocaleDateString("ko-KR")}
                </p>
              </div>
            </div>
          </div>

          <ProfileForm profile={profile} />
        </div>
      </div>
    </div>
  );
}
