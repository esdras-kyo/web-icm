import React from "react";
import Sidebar from "./sideBar";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import type { UserClaims, JwtEnvelope  } from "@/types/UserClaims";

function isUserClaims(value: unknown): value is UserClaims {
  if (!value || typeof value !== "object") return false;
  const v = value as UserClaims;
  const rolesOk =
    Array.isArray(v.roles) &&
    v.roles.every(
      (r) =>
        r &&
        (r.role === "VISITANT" ||
          r.role === "MEMBER" ||
          r.role === "LEADER" ||
          r.role === "ADMIN") &&
        (r.scope_type === "ORG" || r.scope_type === "DEPARTMENT")
    );
  return (
    typeof v.app_user_id === "string" &&
    typeof v.public_code === "string" &&
    typeof v.app_meta_version === "number" &&
    rolesOk
  );
}


export default async function Layout({ children }: { children: React.ReactNode }) {


  const { sessionClaims } = await auth();

  if (!sessionClaims) {
    redirect("/sign-in");
  }

  const claims = (sessionClaims as JwtEnvelope | null)?.claims;

  if (!isUserClaims(claims)) {
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