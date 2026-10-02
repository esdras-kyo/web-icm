import "server-only";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

// Conta monitor é única (linha única na tabela monitor_account).
// clerk_user_id identifica a conta; event_id é o evento apontado (null = desativado).
export type MonitorAccount = {
  clerk_user_id: string;
  event_id: string | null;
};

export async function getMonitorAccount(): Promise<MonitorAccount | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("monitor_account")
    .select("clerk_user_id, event_id")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("getMonitorAccount error:", error.message);
    return null;
  }
  return data ?? null;
}

export async function setMonitorEvent(eventId: string | null): Promise<void> {
  const acc = await getMonitorAccount();
  if (!acc) throw new Error("Conta monitor não configurada");

  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("monitor_account")
    .update({ event_id: eventId, updated_at: new Date().toISOString() })
    .eq("clerk_user_id", acc.clerk_user_id);

  if (error) throw new Error(error.message);
}
