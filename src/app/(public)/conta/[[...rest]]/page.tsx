import { auth } from "@clerk/nextjs/server";
import { extractClaimsFromJwt } from "@/utils/auth/extractClaims";
import ContaPageClient from "./ContaPageClient";

export default async function ContaPage() {
  const { getToken } = await auth();
  const token = await getToken({ template: "member_jwt" });
  const claims = token ? extractClaimsFromJwt(token) : null;

  return <ContaPageClient claims={claims} />;
}
