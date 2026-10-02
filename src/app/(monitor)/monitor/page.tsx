import EventInscricoesView from "@/app/(offc)/offc/events/EventInscricoesView";
import { getMonitorAccount } from "@/utils/monitor/monitorAccount";

export const dynamic = "force-dynamic";

export default async function MonitorPage() {
  const acc = await getMonitorAccount();
  const eventId = acc?.event_id ?? null;

  if (!eventId) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-xl font-semibold text-white">Nenhum evento ativo</h1>
          <p className="mt-2 text-sm text-white/60">
            Nenhum evento está liberado para monitoramento no momento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <EventInscricoesView eventId={eventId} canEdit={false} canDelete={false} />
  );
}
