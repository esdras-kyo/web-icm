import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/leader(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  // 🔒 MOCK AUTH — proteção simples se ativado
  if (process.env.NEXT_PUBLIC_MOCK_LOGIN === "1") {
    const cookie = req.cookies.get("mock_auth")?.value;
    const { pathname, search } = req.nextUrl;

    // ✅ rotas públicas (não forçar redirect para a própria tela de login)
    const isPublic =
      pathname.startsWith("/test-login") || // <-- adicionado
      pathname.startsWith("/mock-login") ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.match(/\.(.*)$/);

    if (!isPublic && cookie !== "1") {
      const loginUrl = new URL("/test-login", req.url);
      // define o destino UMA vez, já codificado
      const dest = pathname + (search || "");
      loginUrl.searchParams.set("to", encodeURIComponent(dest));
      return NextResponse.redirect(loginUrl);
    }
  }

  // --- SUA LÓGICA ORIGINAL COM CLERK ---
  if (isProtectedRoute(req)) {
    const { userId /*, getToken*/ } = await auth();
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
      console.log("tem que descomentar parça ❗️");
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*|api/webhooks/clerk).*)"],
};