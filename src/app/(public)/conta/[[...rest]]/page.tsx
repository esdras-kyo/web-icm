import { auth } from "@clerk/nextjs/server";
import { extractClaimsFromJwt } from "@/utils/auth/extractClaims";
import { createClient } from "@supabase/supabase-js";
import ContaPageClient from "./ContaPageClient";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function ContaPage() {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "member_jwt" });
  const claims = token ? extractClaimsFromJwt(token) : null;

  let initialPhone: string | null = null;
  if (userId) {
    const { data } = await supabase
      .from("users")
      .select("phone")
      .eq("clerk_user_id", userId)
      .single();
    initialPhone = data?.phone ?? null;
  }

  return <ContaPageClient claims={claims} initialPhone={initialPhone} />;
}
