import { createBrowserClient } from '@supabase/ssr';

/**
 * クライアントサイド（Client Components）で使用するSupabaseクライアントです。
 *
 * ブラウザ環境で動作し、認証情報（Cookie）を自動的に利用してリクエストを行います。
 * シングルトンインスタンスとしてエクスポートされているため、
 * アプリケーション全体で共有されます。
 */
export const supabaseAuthClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);
