// Self-check da lógica de autorização (pura). Roda sem framework:
//   node --experimental-strip-types src/utils/auth/eventAccess.check.ts
import assert from "node:assert";
import {
  canReadEvent,
  canSetStatus,
  canDeleteRegistration,
  type EventAccess,
} from "./eventAccess.ts";

const EV = "event-1";
const OTHER = "event-2";

const admin: EventAccess = { kind: "admin" };
const staff: EventAccess = { kind: "staff" };
const monitorHere: EventAccess = { kind: "monitor", eventId: EV };
const monitorOff: EventAccess = { kind: "monitor", eventId: null };
const none: EventAccess = { kind: "none" };

// admin/staff leem qualquer evento
assert.equal(canReadEvent(admin, EV), true);
assert.equal(canReadEvent(admin, OTHER), true);
assert.equal(canReadEvent(staff, OTHER), true);

// monitor lê SÓ o evento apontado
assert.equal(canReadEvent(monitorHere, EV), true);
assert.equal(canReadEvent(monitorHere, OTHER), false);
assert.equal(canReadEvent(monitorHere, null), false);
assert.equal(canReadEvent(monitorOff, EV), false); // desativado não vê nada

// anônimo/sem role não lê nada
assert.equal(canReadEvent(none, EV), false);

// set-status segue o mesmo escopo
assert.equal(canSetStatus(monitorHere, EV), true);
assert.equal(canSetStatus(monitorHere, OTHER), false);

// delete: só admin/staff; monitor nunca
assert.equal(canDeleteRegistration(admin), true);
assert.equal(canDeleteRegistration(staff), true);
assert.equal(canDeleteRegistration(monitorHere), false);
assert.equal(canDeleteRegistration(none), false);

console.log("eventAccess checks OK");
