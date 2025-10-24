'use client'
import React, { useState } from "react";
import { MembersInput } from "./MemberInput"

export type MeetingPayload = {
  title: string | null;
  description: string | null;
  members: string[]; // array de nomes
  department_id: string
};

const normalizeString = (s: string): string => s ?? "";

export const MeetingFormSimple = ({ depId }: {depId: string}) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [members, setMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: MeetingPayload = {
        title: title.trim() || null,
        description: description.trim() || null,
        members,
        department_id: depId,
      };

    try {
        const res = await fetch("/api/meetings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data.error || "Erro ao enviar meeting");
        }
  
        console.log("Meeting criado:", data);
        alert("Enviado com sucesso!");
        setTitle("");
        setDescription("");
        setMembers([]);
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : "Erro ao enviar reunião");
      } finally {
        setLoading(false);
      }
    };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div>
        <label className="block text-sm font-medium">Título</label>
        <input
          value={title}
          onChange={(e) => setTitle(normalizeString(e.target.value))}
          className="mt-1 w-full rounded-lg border px-3 py-2"
          placeholder="Ex.: Ensaio da banda"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Descrição</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(normalizeString(e.target.value))}
          className="mt-1 w-full rounded-lg border px-3 py-2"
          rows={3}
          placeholder="Observações do encontro..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Participantes</label>
        <MembersInput value={members} onChange={setMembers} />
      </div>

      <button
        type="submit"
        className="rounded-lg bg-black px-4 py-2 text-white"
      >
        {loading ? "Enviando..." : "Salvar"}
      </button>
    </form>
  );
};