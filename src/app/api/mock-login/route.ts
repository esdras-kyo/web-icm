// app/api/mock-login/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const mockUser = process.env.MOCK_LOGIN_USER ?? "admin";
  const mockPass = process.env.MOCK_LOGIN_PASS ?? "1234";

  const ok = username === mockUser && password === mockPass;

  const res = NextResponse.json({ ok }, { status: ok ? 200 : 401 });

  if (ok) {
    // cookie HttpOnly para o middleware ler
    res.cookies.set("mock_auth", "1", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 dia
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return res;
}