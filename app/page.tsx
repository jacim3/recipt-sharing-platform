export default function Home() {
  // 샘플 레시피 데이터 (나중에 Supabase에서 가져올 예정)
  const sampleRecipes = [
    {
      id: 1,
      title: "토마토 파스타",
      author: "요리왕",
      image: "🍝",
      time: "30분",
      difficulty: "쉬움",
    },
    {
      id: 2,
      title: "치킨 커리",
      author: "맛있는집",
      image: "🍛",
      time: "45분",
      difficulty: "보통",
    },
    {
      id: 3,
      title: "초콜릿 케이크",
      author: "베이킹마스터",
      image: "🍰",
      time: "60분",
      difficulty: "어려움",
    },
    {
      id: 4,
      title: "샐러드 볼",
      author: "건강한식",
      image: "🥗",
      time: "15분",
      difficulty: "쉬움",
    },
    {
      id: 5,
      title: "스테이크",
      author: "미트러버",
      image: "🥩",
      time: "25분",
      difficulty: "보통",
    },
    {
      id: 6,
      title: "초밥",
      author: "일식장인",
      image: "🍣",
      time: "40분",
      difficulty: "어려움",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-orange-600">🍳 RecipeShare</h1>
            </div>
            <nav className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                레시피 찾기
              </button>
              <button className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                로그인
              </button>
              <button className="bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-700 transition-colors">
                회원가입
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-4">맛있는 레시피를 공유하세요</h2>
          <p className="text-xl mb-8 text-orange-50">
            전 세계 요리사들과 함께 나만의 특별한 레시피를 공유하고 발견하세요
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
              레시피 올리기
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors">
              레시피 둘러보기
            </button>
          </div>
        </div>
      </section>

      {/* Recipe Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">인기 레시피</h3>
          <p className="text-gray-600">커뮤니티에서 가장 인기 있는 레시피들을 만나보세요</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-6xl">
                {recipe.image}
              </div>
              <div className="p-5">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{recipe.title}</h4>
                <p className="text-gray-600 text-sm mb-3">작성자: {recipe.author}</p>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>⏱️ {recipe.time}</span>
                  <span>📊 {recipe.difficulty}</span>
                </div>
              </div>
            </div>
          ))}
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
