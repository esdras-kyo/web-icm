import { auth } from "@clerk/nextjs/server";
export async function GET() {
  const { userId, getToken } = await auth();
  const jwt = await getToken({ template: "member_jwt" }); // <-- seu nome real
  return new Response(JSON.stringify({ userId, hasJwt: !!jwt }), {
    headers: { "content-type": "application/json" },
  });
}