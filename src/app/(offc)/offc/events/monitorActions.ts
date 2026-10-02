"use server";

import { resolveEventAccess } from "@/utils/auth/resolveEventAccess";
import { getMonitorAccount, setMonitorEvent } from "@/utils/monitor/monitorAccount";

async function assertAdmin() {
  const access = await resolveEventAccess();
  if (access.kind !== "admin") throw new Error("Não autorizado");
}

export async function isMonitorOnEvent(eventId: string): Promise<boolean> {
  await assertAdmin();
  const acc = await getMonitorAccount();
  return !!acc && acc.event_id === eventId;
}

export async function setMonitorForEvent(
  eventId: string | null
): Promise<{ configured: boolean; activeEventId: string | null }> {
  await assertAdmin();
  const acc = await getMonitorAccount();
  if (!acc) return { configured: false, activeEventId: null };
  await setMonitorEvent(eventId);
  return { configured: true, activeEventId: eventId };
}
