import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

/**
 * 서버에서만 사용하세요.
 * - Service Role Key가 필요합니다 (절대 NEXT_PUBLIC로 노출 금지).
 * - 예: 관리자 작업, 백그라운드 배치, 웹훅 처리
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them to .env.local (server-only)."
    );
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

