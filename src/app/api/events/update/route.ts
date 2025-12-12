import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { z } from "zod";

// Se seus valores forem outros, ajuste aqui:
const StatusEnum = z.enum(["ATIVO", "DESATIVADO"]).optional(); // status é nullable
const VisibilityEnum = z.enum(["ORG", "GLOBAL", "INTERNAL"]);  // USER-DEFINED no banco

const FieldCfg = z.object({ enabled: z.boolean(), required: z.boolean() });
const RegistrationFieldsSchema = z.object({
  name: FieldCfg,
  cpf: FieldCfg,
  number: FieldCfg,
  camisa: FieldCfg,
  isMember: FieldCfg,
  idade: FieldCfg,
});

// Aceita ISO ou datetime-local
function toIsoOrNull(input: string | null | undefined) {
  if (input == null || input === "") return null;
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

const UpdateSchema = z.object({
  id: z.string().min(1),

  title: z.string().min(1),
  description: z.string().nullable().optional(),

  starts_at: z.string().min(1),
  ends_at: z.string().min(1),

  capacity: z.number().int().nonnegative().nullable().optional(),

  price: z.number().nonnegative(), // real NOT NULL

  status: z.string().nullable().optional(), // se quiser travar enum, use StatusEnum.nullable().optional()

  visibility: VisibilityEnum,

  registration_starts_at: z.string().nullable().optional(),
  registration_ends_at: z.string().nullable().optional(),

  address: z.string().nullable().optional(),

  registration_fields: RegistrationFieldsSchema, // NOT NULL

  payment_note: z.string().nullable().optional(),
});

export async function PATCH(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = UpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Payload inválido", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const v = parsed.data;

    // whitelist EXATA (nem + nem -)
    const updatePayload = {
      title: v.title,
      description: v.description ?? null,

      starts_at: toIsoOrNull(v.starts_at)!, // required
      ends_at: toIsoOrNull(v.ends_at)!,     // required

      capacity: v.capacity ?? null,

      price: v.price,

      status: v.status ?? null,

      visibility: v.visibility,

      registration_starts_at: toIsoOrNull(v.registration_starts_at),
      registration_ends_at: toIsoOrNull(v.registration_ends_at),

      address: v.address ?? null,

      registration_fields: v.registration_fields,

      payment_note: v.payment_note ?? null,
    };

    // Segurança extra: se starts_at/ends_at inválidos, toIsoOrNull vira null
    if (!updatePayload.starts_at || !updatePayload.ends_at) {
      return NextResponse.json(
        { error: "starts_at e ends_at precisam ser datas válidas" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    const { data, error } = await supabase
      .from("events")
      .update(updatePayload)
      .eq("id", v.id)
      .select(
        "id,title,description,starts_at,ends_at,capacity,price,status,visibility,registration_starts_at,registration_ends_at,address,registration_fields,payment_note"
      )
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}