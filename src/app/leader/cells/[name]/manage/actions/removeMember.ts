// /app/leader/cells/[id]/manage/actions/removeMember.ts
"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { clerkClient } from "@clerk/nextjs/server";

type Feedback ={
  success: boolean,
  message: string,
  data?: {
    id: string
  }
}

export async function removeMemberAction(formData: FormData): Promise<Feedback>  {
  const supabase = createSupabaseAdmin();

  const membershipId = String(formData.get("membershipId") ?? "");
  const cellId = String(formData.get("cellId") ?? "");

  if (!membershipId || !cellId) {
    return { success: false, message: "Identificador inválido." };
  }

  const { data: deletedRow, error: delErr } = await supabase
    .from("cell_memberships")
    .delete()
    .eq("id", membershipId)
    .select("user_id")
    .single();

  if (delErr) {
    console.error("removeMemberAction delete error:", delErr);
    return { success: false, message: "Não foi possível remover o membro." };
  }

  if (!deletedRow) {
    revalidatePath(`/leader/cells/${cellId}/manage`);
    return { success: true, message: "Nada a remover (já não existia)." };
  }

  const removedUserId = deletedRow.user_id as string;

  try {
    const { data: userData, error: userErr } = await supabase
      .from("users")
      .select("clerk_user_id")
      .eq("id", removedUserId)
      .single();

    if (userErr) {
      console.error("Erro ao buscar clerk_user_id:", userErr);
    } else if (userData?.clerk_user_id) {
      const client = await clerkClient();
      await client.users.updateUser(userData.clerk_user_id, {
        publicMetadata: {
          primary_cell_id: null,
          cell_role: null,
        },
      });
    }
  } catch (err) {
    console.error("Erro ao atualizar Clerk publicMetadata:", err);
  }

  revalidatePath(`/leader/cells/${cellId}/manage`);
  return { success: true, message: "Membro removido com sucesso." };
}