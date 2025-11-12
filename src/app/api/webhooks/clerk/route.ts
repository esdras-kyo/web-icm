import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Webhook} from "svix";
import { createClient } from "@supabase/supabase-js";
import { clerkClient, type WebhookEvent } from "@clerk/nextjs/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-side
);
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const payload = await req.text();
  const hdrs = await headers();
  const svixId = hdrs.get("svix-id");
  const svixTimestamp = hdrs.get("svix-timestamp");
  const svixSignature = hdrs.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  let evt: WebhookEvent
  try {
    evt = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const u = evt.data;
    const email = u.email_addresses?.[0]?.email_address ?? null;
    const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || null;
    const image_url = u.image_url ?? null;

    const { data: userRow, error: upsertErr } = await supabase
      .from("users")
      .upsert(
        { clerk_user_id: u.id, email, name, image_url },
        { onConflict: "clerk_user_id" }
      )
      .select("id, public_code")
      .single();
    if (upsertErr || !userRow) {
      console.error(upsertErr);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    if (evt.type === "user.created") {
      const { error: roleErr } = await supabase
        .from("role_assignments")
        .insert({
          user_id: userRow.id,
          role: "VISITANT",
          scope_type: "ORG",
          department_id: null,
        });

      if (roleErr && roleErr.code !== "23505") {
        console.error(roleErr);
        return NextResponse.json({ ok: false }, { status: 500 });
      }
    }

    const { data: rolesFromDb, error: rolesErr } = await supabase
      .from("role_assignments")
      .select("role, scope_type, department_id")
      .eq("user_id", userRow.id);

    if (rolesErr) {
      console.error("Erro ao buscar roles:", rolesErr);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    const { data: membershipRows, error: membershipErr } = await supabase
      .from("cell_memberships")
      .select("cell_id, role")
      .eq("user_id", userRow.id)
      .limit(1);

    if (membershipErr) {
      console.error("Erro ao buscar membership de célula:", membershipErr);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    const membership = Array.isArray(membershipRows) && membershipRows.length > 0 ? membershipRows[0] : null;
    const primary_cell_id = membership?.cell_id ?? null;
    const cell_role = membership?.role ?? null;

    try {
      await (await clerkClient()).users.updateUser(u.id, {
        publicMetadata: {
          app_user_id: userRow.id,
          public_code: userRow.public_code,
          roles: (rolesFromDb ?? []).map((r) => ({
            role: r.role,
            scope_type: r.scope_type,
            department_id: r.department_id,
          })),
          app_meta_version: 1,
          primary_cell_id,
          cell_role,
        },
      });
    } catch (e) {
      console.error("clerkClient.users.updateUser error:", e);
      // Não derruba o webhook se o Supabase já foi gravado
    }
  }

  return NextResponse.json({ ok: true });
}