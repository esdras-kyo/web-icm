"use server";

import { auth } from "@clerk/nextjs/server";
import { decodeJwt } from "jose";

import { createSupabaseAdmin } from "@/utils/supabase/admin";

function toIntOrNull(v: FormDataEntryValue | null, min?: number, max?: number) {
  if (v == null || v === "") return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  if (min !== undefined && n < min) return null;
  if (max !== undefined && n > max) return null;
  return Math.trunc(n);
}

export async function createMeetingAction(formData: FormData) {
  const { getToken } = await auth();
  const jwt = await getToken({ template: "member_jwt" });
  if (!jwt) return { success: false, message: "Token ausente." };

  const decoded = decodeJwt(jwt) as {
    claims?: { app_user_id?: string };
  };

  const createdBy = decoded?.claims?.app_user_id;

  const supabase = createSupabaseAdmin();

  const cellId = String(formData.get("cellId") ?? "");
  const occurredAt = String(formData.get("occurred_at") ?? "");

  const notes = (formData.get("notes") as string) || null;

  const leaderUserId = (formData.get("leader_user_id") as string) || null;
  const assistantUserId = (formData.get("assistant_user_id") as string) || null;
  const hostUserId = (formData.get("host_user_id") as string) || null;

  const membersCount = toIntOrNull(formData.get("members_count"), 0);
  const attendeesCount = toIntOrNull(formData.get("attendees_count"), 0);
  const icebreakerRate = toIntOrNull(formData.get("icebreaker_rate"), 0, 5);
  const worshipRate = toIntOrNull(formData.get("worship_rate"), 0, 5);
  const wordRate = toIntOrNull(formData.get("word_rate"), 0, 5);
  const sundayAttendanceCount = toIntOrNull(formData.get("sunday_attendance_count"), 0);
  const visitorsCount = toIntOrNull(formData.get("visitors_count"), 0);

  if (!cellId) return { success: false, message: "Célula inválida." };
  if (!occurredAt) return { success: false, message: "Data da reunião é obrigatória." };
  if (!createdBy) return { success: false, message: "Usuário não identificado." };

  const { error } = await supabase.from("cell_meetings").insert([{
    cell_id: cellId,
    occurred_at: occurredAt,
    notes,
    created_by: createdBy,
    leader_user_id: leaderUserId,
    assistant_user_id: assistantUserId,
    host_user_id: hostUserId,
    members_count: membersCount,
    attendees_count: attendeesCount,
    icebreaker_rate: icebreakerRate,
    worship_rate: worshipRate,
    word_rate: wordRate,
    sunday_attendance_count: sundayAttendanceCount,
    visitors_count: visitorsCount,
  }]);

  if (error) {
    console.error("createMeetingAction error:", error);
    return { success: false, message: "Não foi possível criar o relatório." };
  }

  return { success: true };
}