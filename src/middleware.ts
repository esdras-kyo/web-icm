import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/leader(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {

    const { userId, getToken } = await auth(); 
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (req.nextUrl.pathname.startsWith("/leader")) {
      // const jwt = await getToken({ template: "member_jwt" });
      // if (!jwt) {
      //   return NextResponse.redirect(new URL("/test", req.url));
      // }

      // const [, payloadPart] = jwt.split(".");
      // const payloadJson = Buffer.from(
      //   payloadPart.replace(/-/g, "+").replace(/_/g, "/"),
      //   "base64"
      // ).toString("utf-8");
      // const payload = JSON.parse(payloadJson);

      // const hasLeader =
      //   payload?.claims?.roles?.some((r: any) => r.role === "LEADER") ?? false;

      // if (!hasLeader) {
      //   return NextResponse.redirect(new URL("/conta", req.url));
      // }
      console.log("tem que descomentar parça ❗️")
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*|api/webhooks/clerk).*)"],
};