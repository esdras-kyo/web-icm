import "server-only";
import { auth } from "@clerk/nextjs/server";
import { extractClaimsFromJwt } from "./extractClaims";
import { getMonitorAccount } from "@/utils/monitor/monitorAccount";
import type { EventAccess } from "./eventAccess";

// Resolve, por request, o que o chamador pode fazer com eventos.
// Monitor é identificado pela linha de monitor_account (antes de olhar claims),
// então funciona mesmo sem role/claims válidos.
export async function resolveEventAccess(): Promise<EventAccess> {
  const { userId, getToken } = await auth();
  if (!userId) return { kind: "none" };

  const monitor = await getMonitorAccount();
  if (monitor && monitor.clerk_user_id === userId) {
    return { kind: "monitor", eventId: monitor.event_id };
  }

  const token = await getToken({ template: "member_jwt" });
  if (!token) return { kind: "none" };

  const claims = extractClaimsFromJwt(token);
  if (!claims) return { kind: "none" };

  if (claims.roles.some((r) => r.role === "ADMIN")) return { kind: "admin" };
  if (claims.roles.some((r) => r.role === "LEADER" || r.role === "ASSISTANT")) {
    return { kind: "staff" };
  }
  return { kind: "none" };
}
