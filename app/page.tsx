import { redirect } from "next/navigation";
import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";

export default async function Home() {
  // 로그인 상태 확인
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 로그인한 사용자는 대시보드로 리디렉션
  if (session) {
    redirect("/dashboard");
  }

  // 로그인하지 않은 사용자만 랜딩 페이지 표시
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-4">맛있는 레시피를 공유하세요</h2>
          <p className="text-xl mb-8 text-orange-50">
            전 세계 요리사들과 함께 나만의 특별한 레시피를 공유하고 발견하세요
          </p>
          <div className="flex justify-center">
            <Link
              href="/signup"
              className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              지금 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">RecipeShare</h4>
              <p className="text-sm">
                맛있는 레시피를 공유하고 발견하는 플랫폼입니다.
              </p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">탐색</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">인기 레시피</a></li>
                <li><a href="#" className="hover:text-white">최신 레시피</a></li>
                <li><a href="#" className="hover:text-white">카테고리</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">커뮤니티</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">레시피 올리기</a></li>
                <li><a href="#" className="hover:text-white">요리사들</a></li>
                <li><a href="#" className="hover:text-white">토론</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">정보</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">이용약관</a></li>
                <li><a href="#" className="hover:text-white">개인정보처리방침</a></li>
                <li><a href="#" className="hover:text-white">문의하기</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>© 2024 RecipeShare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
