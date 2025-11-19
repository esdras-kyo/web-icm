// src/app/leader/events/EventCreateWrapper.tsx
"use client";

import EventCreateForm, {
  type EventCreatePayload,
} from "../components/EventCreator";

export default function Office() {
  async function handleCreate(payload: EventCreatePayload) {
    const res = await fetch("/api/events/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.error("create event error:", body);
      throw new Error(body?.error ?? "Falha ao criar evento");
    }

    const { id } = (await res.json()) as { id: string };
    return id; // isso volta como eventId lá dentro do EventCreateForm
  }

  return <EventCreateForm onCreate={handleCreate} />;
}