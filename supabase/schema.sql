-- ============================================
-- 레시피 공유 플랫폼 데이터베이스 스키마
-- Supabase SQL Editor에서 실행하세요
-- ============================================

-- 1. 사용자 프로필 테이블 (Supabase Auth의 users와 연결)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 2. 레시피 테이블
CREATE TABLE IF NOT EXISTS recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  ingredients TEXT NOT NULL, -- JSON 문자열 또는 텍스트로 저장
  instructions TEXT NOT NULL, -- JSON 문자열 또는 텍스트로 저장
  cooking_time INTEGER, -- 분 단위
  difficulty TEXT CHECK (difficulty IN ('쉬움', '보통', '어려움')),
  category TEXT -- 카테고리 (예: '한식', '양식', '중식' 등)
);

-- recipes.user_id -> profiles.id 관계 (PostgREST 조인용)
-- NOTE: constraint 이름을 recipes_user_id_fkey 로 맞춰서
-- `profiles!recipes_user_id_fkey(...)` 형태의 select 힌트가 동작하게 합니다.
ALTER TABLE recipes
  ADD CONSTRAINT recipes_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES profiles(id)
  ON DELETE CASCADE;

-- ============================================
-- 인덱스 생성 (성능 최적화)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);

-- ============================================
-- RLS (Row Level Security) 정책 설정
-- ============================================

-- 프로필 테이블 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "프로필은 모든 사용자가 조회 가능"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "사용자는 자신의 프로필만 수정 가능"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "사용자는 자신의 프로필만 삽입 가능"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 레시피 테이블 RLS
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "레시피는 모든 사용자가 조회 가능"
  ON recipes FOR SELECT
  USING (true);

CREATE POLICY "인증된 사용자만 레시피 작성 가능"
  ON recipes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "작성자만 자신의 레시피 수정 가능"
  ON recipes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "작성자만 자신의 레시피 삭제 가능"
  ON recipes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 함수 및 트리거 (자동 업데이트)
-- ============================================

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- profiles 테이블의 updated_at 자동 업데이트
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 프로필 자동 생성 트리거 (회원가입 시)
-- ============================================

-- 회원가입 시 profile 테이블에 자동으로 레코드 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- auth.users에 새 사용자가 생성될 때 트리거
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
