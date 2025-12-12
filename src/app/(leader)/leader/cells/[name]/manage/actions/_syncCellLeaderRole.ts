"use server";

import { createSupabaseAdmin } from "@/utils/supabase/admin";

export async function syncCellLeaderRole(userId: string) {
  const supabase = createSupabaseAdmin();

  const { data: rows, error: qErr } = await supabase
    .from("cell_memberships")
    .select("id")
    .eq("user_id", userId)
    .eq("role", "LEADER")
    .limit(1);

  if (qErr) {
    console.error("syncCellLeaderRole: query error", qErr);
    return;
  }

  const stillLeader = !!rows?.length;

  if (stillLeader) {
    const { error: insErr } = await supabase.from("role_assignments").insert({
      user_id: userId,
      role: "LEADER",
      scope_type: "CELL",
      department_id: null,
    });

    if (insErr) {

      console.warn("syncCellLeaderRole: insert role failed (ignorado se duplicado)", insErr);
    }
  } else {

    const { error: delErr } = await supabase
      .from("role_assignments")
      .delete()
      .eq("user_id", userId)
      .eq("role", "LEADER")
      .eq("scope_type", "CELL");

    if (delErr) {
      console.error("syncCellLeaderRole: delete role failed", delErr);
    }
  }
}