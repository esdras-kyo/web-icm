import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { extractClaimsFromJwt } from "@/utils/auth/extractClaims";
import LeaderClientShell from "./layoutClient";

export default async function Layout({ children }: { children: React.ReactNode }) {

  const { userId, getToken } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect_url=/leader");
  }

  const token = await getToken({ template: "member_jwt" });
  if (!token) {
    redirect("/sign-in?redirect_url=/leader");
  }

  const claims = extractClaimsFromJwt(token);
  if (!claims) {
    redirect("/conta");
  }

  const allowed = claims.roles.some(
    (r) => r.role === "LEADER" || r.role === "ADMIN"
  );
  if (!allowed) {
    redirect("/conta");
  }

  return (
    <LeaderClientShell>{children}</LeaderClientShell>
  );
}