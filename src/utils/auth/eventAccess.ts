// Decisão pura de autorização de evento — sem imports de runtime, testável isolada.
// (resolveEventAccess.ts faz o lado "sujo": auth() + DB e devolve um EventAccess.)

export type EventAccess =
  | { kind: "admin" } // ADMIN → todos os eventos
  | { kind: "staff" } // LEADER/ASSISTANT → todos (comportamento atual, inalterado)
  | { kind: "monitor"; eventId: string | null } // monitor → só o evento apontado
  | { kind: "none" };

/** Pode ler inscritos / detalhes / timeline de `eventId`? */
export function canReadEvent(access: EventAccess, eventId: string | null): boolean {
  switch (access.kind) {
    case "admin":
    case "staff":
      return true;
    case "monitor":
      return !!eventId && eventId === access.eventId;
    case "none":
      return false;
  }
}

/** Marcar pago/não-pago tem o mesmo escopo de leitura. */
export const canSetStatus = canReadEvent;

/** Deletar inscrito: só admin/staff. Monitor nunca deleta. */
export function canDeleteRegistration(access: EventAccess): boolean {
  return access.kind === "admin" || access.kind === "staff";
}
