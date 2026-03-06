"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

async function assertCanManageDepartments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

const DepartmentNameSchema = z.object({
  name: z.string().min(2),
});

export async function createDepartment(formData: FormData) {
  await assertCanManageDepartments();

  const payload = DepartmentNameSchema.parse({
    name: formData.get("name"),
  });

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("departments").insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath("/offc/departments");
  return { ok: true };
}

export async function updateDepartment(id: string, formData: FormData) {
  await assertCanManageDepartments();

  const payload = DepartmentNameSchema.parse({
    name: formData.get("name"),
  });

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("departments").update(payload).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/offc/departments");
  return { ok: true };
}

export async function deleteDepartment(id: string) {
  await assertCanManageDepartments();

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("departments").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/offc/departments");
  return { ok: true };
}

