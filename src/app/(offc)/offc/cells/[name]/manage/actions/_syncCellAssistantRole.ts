"use server";

import { createSupabaseAdmin } from "@/utils/supabase/admin";

export async function syncCellAssistantRole(userId: string) {
  const supabase = createSupabaseAdmin();

  const { data: rows, error: qErr } = await supabase
    .from("cell_memberships")
    .select("id")
    .eq("user_id", userId)
    .eq("role", "ASSISTANT")
    .limit(1);

  if (qErr) {
    console.error("syncCellAssistantRole: query error", qErr);
    return;
  }

  const stillAssistant = !!rows?.length;

  if (stillAssistant) {
    const { error: insErr } = await supabase.from("role_assignments").insert({
      user_id: userId,
      role: "ASSISTANT",
      scope_type: "CELL",
      department_id: null,
    });

    if (insErr) {
      console.warn("syncCellAssistantRole: insert role failed (ignorado se duplicado)", insErr);
    }
  } else {
    const { error: delErr } = await supabase
      .from("role_assignments")
      .delete()
      .eq("user_id", userId)
      .eq("role", "ASSISTANT")
      .eq("scope_type", "CELL");

    if (delErr) {
      console.error("syncCellAssistantRole: delete role failed", delErr);
    }
  }
}
