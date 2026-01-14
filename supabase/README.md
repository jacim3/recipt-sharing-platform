# Supabase 데이터베이스 설정 가이드

## 📋 설정 방법

1. Supabase 대시보드에 로그인
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **SQL Editor** 클릭
4. `schema.sql` 파일의 전체 내용을 복사하여 SQL Editor에 붙여넣기
5. **Run** 버튼 클릭하여 실행

## 🗄️ 데이터베이스 구조

### 테이블

1. **profiles** - 사용자 프로필 정보
   - `id` (UUID, Primary Key) - Supabase Auth의 users 테이블과 연결
   - `username` (TEXT, UNIQUE) - 사용자명
   - `full_name` (TEXT) - 전체 이름
   - `created_at` (TIMESTAMP) - 생성일시
   - `updated_at` (TIMESTAMP) - 수정일시

2. **recipes** - 레시피 정보
   - `id` (UUID, Primary Key) - 레시피 ID
   - `created_at` (TIMESTAMP) - 생성일시
   - `user_id` (UUID) - 작성자 ID (auth.users 참조)
   - `title` (TEXT) - 레시피 제목
   - `ingredients` (TEXT) - 재료 목록 (JSON 문자열 또는 텍스트)
   - `instructions` (TEXT) - 조리 방법 (JSON 문자열 또는 텍스트)
   - `cooking_time` (INTEGER) - 조리 시간 (분 단위)
   - `difficulty` (TEXT) - 난이도 ('쉬움', '보통', '어려움')
   - `category` (TEXT) - 카테고리 (예: '한식', '양식', '중식' 등)

## 🔒 보안 설정 (RLS)

모든 테이블에 Row Level Security (RLS)가 활성화되어 있습니다:

- **조회**: 모든 사용자가 레시피와 프로필 조회 가능
- **작성**: 인증된 사용자만 레시피 작성 가능
- **수정/삭제**: 작성자만 자신의 레시피 수정/삭제 가능

## ⚙️ 자동 기능

- **updated_at 자동 업데이트**: 프로필 수정 시 자동으로 updated_at 갱신

## 📝 데이터 저장 형식 예시

### ingredients (재료)
JSON 배열 형식으로 저장하거나 텍스트로 저장 가능:
```json
[
  {"name": "토마토", "amount": "2개"},
  {"name": "파스타면", "amount": "200g"},
  {"name": "올리브오일", "amount": "2큰술"}
]
```

또는 단순 텍스트:
```
토마토 2개, 파스타면 200g, 올리브오일 2큰술
```

### instructions (조리 방법)
JSON 배열 형식으로 저장하거나 텍스트로 저장 가능:
```json
[
  {"step": 1, "instruction": "물을 끓입니다"},
  {"step": 2, "instruction": "파스타면을 넣고 10분간 끓입니다"},
  {"step": 3, "instruction": "토마토를 볶아 소스를 만듭니다"}
]
```

또는 단순 텍스트:
```
1. 물을 끓입니다
2. 파스타면을 넣고 10분간 끓입니다
3. 토마토를 볶아 소스를 만듭니다
```

## 📝 다음 단계

1. SQL 스크립트 실행 완료 후
2. Supabase 클라이언트 라이브러리 설치:
   ```bash
   npm install @supabase/supabase-js
   ```
3. 환경 변수 설정 (`.env.local`):
   - 예시 파일: `supabase/env.example`
   - 실제 파일(로컬): `.env.local`
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## 🔍 확인 방법

SQL Editor에서 다음 쿼리로 테이블 생성 확인:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

테이블 구조 확인:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'recipes';
```
