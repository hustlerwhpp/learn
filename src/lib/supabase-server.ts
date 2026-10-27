import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/* Серверный клиент Supabase для реестра номеров сертификатов.
   Ключ — service role, он обходит RLS и НЕ должен попадать в клиентский
   бандл: переменные без префикса NEXT_PUBLIC_ доступны только на сервере.
   Если переменные не заданы (например, владелец ещё не настроил проект),
   возвращает null — маршруты ответят 503, а сертификат сгенерируется
   без номера, а не упадёт с ошибкой. */
export function getServiceClient(): SupabaseClient | null {
  const url = process.env.LEARN_SUPABASE_URL;
  const key = process.env.LEARN_SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
