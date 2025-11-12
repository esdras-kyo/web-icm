import React from "react";
import Sidebar from "./sideBar";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { extractClaimsFromJwt } from "@/utils/auth/extractClaims";

export default async function Layout({ children }: { children: React.ReactNode }) {

  const { userId, getToken } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect_url=/offc");
  }

  const token = await getToken({ template: "member_jwt" });

  if (!token) {
    redirect("/sign-in?redirect_url=/offc");
  }

  const claims = extractClaimsFromJwt(token);

  if (!claims) {
    redirect("/conta");
  }

  const allowed = claims.roles.some(
    (r) => r.role === "ADMIN"
  );
  if (!allowed) {
    redirect("/conta");
  }

  return (
    <div className="flex h-screen overflow-hidden ">
       <Sidebar />
    <div className="flex-col flex flex-1 overflow-auto">
    <div className="max-w-7xl mx-auto w-full flex flex-col">
      <main className="flex-1 p-6">{children}</main>
    </div>
    </div>
    </div>
  );
}