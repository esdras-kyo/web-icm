"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

// Se quiser, troque por uma checagem real no seu RBAC
async function assertCanManageAgenda() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  // TODO: checar roles no Clerk JWT ou na sua tabela (ADMIN/LEADER)
  return userId;
}

const UpsertSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  event_time: z.string().regex(/^\d{2}:\d{2}$/).optional(), // HH:mm
  visibility: z.enum(["GLOBAL", "INTERNAL"]).default("GLOBAL"),
  department_id: z.string().uuid().nullable().optional(),
});

export async function createAgendaItem(formData: FormData) {
  await assertCanManageAgenda();

  const payload = UpsertSchema.parse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    event_date: formData.get("event_date"),
    event_time: (formData.get("event_time") as string | null) || undefined,
    visibility: (formData.get("visibility") as "GLOBAL" | "INTERNAL") ?? "GLOBAL",
    department_id: (formData.get("department_id") as string) || null,
  });

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("agenda_events").insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/agenda");
  return { ok: true };
}

export async function deleteAgendaItem(id: string) {
  await assertCanManageAgenda();

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("agenda_events").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/agenda");
  return { ok: true };
}