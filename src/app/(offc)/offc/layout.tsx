import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { extractClaimsFromJwt } from "@/utils/auth/extractClaims";
import OffcClientShell from "./OffcClientShell";

export default async function OffcLayout({ children }: { children: React.ReactNode }) {
  const { userId, getToken } = await auth();

  if (!userId) redirect("/sign-in?redirect_url=/offc");

  const token = await getToken({ template: "member_jwt" });
  if (!token) redirect("/sign-in?redirect_url=/offc");

  const claims = extractClaimsFromJwt(token);
  if (!claims) redirect("/conta");

  const allowed = claims.roles.some((r) => r.role === "ADMIN");
  if (!allowed) redirect("/conta");

  return <OffcClientShell>{children}</OffcClientShell>;
}