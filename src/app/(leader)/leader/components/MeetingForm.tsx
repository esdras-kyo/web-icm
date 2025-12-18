'use client'
import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { MembersInput } from './MemberInput'

export type MeetingPayload = {
  title: string | null
  description: string | null
  members: string[]
  department_id: string
}

const normalizeString = (s: string): string => s ?? ''

export const MeetingFormSimple = ({ depId }: { depId: string }) => {
  const [open, setOpen] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [members, setMembers] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const payload: MeetingPayload = {
      title: title.trim() || null,
      description: description.trim() || null,
      members,
      department_id: depId,
    }

    try {
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao enviar meeting')
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      setTitle('')
      setDescription('')
      setMembers([])
      setOpen(false)
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : 'Erro ao enviar reunião')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/5">
      {/* Header */}
      {success && (
        <div className="rounded-xl px-4 py-2 text-sm mb-4 text-green-400">
          Relatório enviado com sucesso
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="cursor-pointer flex w-full items-center justify-between px-4 py-3 hover:bg-white/10 rounded-2xl"
      >
        <span className="text-sm font-medium text-white">
          Novo relatório
        </span>

        {open ? (
          <ChevronUp className="h-4 w-4 text-white/70" />
        ) : (
          <ChevronDown className="h-4 w-4 text-white/70" />
        )}
      </button>

      {/* Form */}
      {open && (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 border-t border-white/10 bg-black/40 p-6 backdrop-blur-sm rounded-b-2xl"
        >
          {/* Título */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-white/90">
              Título
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(normalizeString(e.target.value))}
              placeholder="Ex.: Ensaio da banda"
              className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/10"
            />
          </div>

          {/* Descrição */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-white/90">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(normalizeString(e.target.value))}
              rows={3}
              placeholder="Observações do encontro..."
              className="w-full resize-none rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/10"
            />
          </div>

          {/* Participantes */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-white/90">
              Participantes
            </label>
            <MembersInput value={members} onChange={setMembers} />
          </div>

          {/* Ação */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Enviando…' : 'Salvar'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}