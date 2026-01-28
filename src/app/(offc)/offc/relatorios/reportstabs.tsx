'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Users, MapPin, StickyNote, Sparkles } from 'lucide-react'

type Cell = { id: string; name: string | null }

type UserMini = { id: string; name: string | null; email: string | null }

type CellMeetingEnriched = {
  id: string
  cell_id: string
  occurred_at: string
  notes: string | null
  created_at: string
  attendees_count: number | null
  members_count: number | null
  visitors_count: number | null
  icebreaker_rate: number | null
  worship_rate: number | null
  word_rate: number | null
  cell: { id: string; name: string | null } | null
  author: UserMini | null
}

type DepartmentMeetingEnriched = {
  id: string
  department_id: string | null
  title: string | null
  description: string | null
  members: string[] | null
  created_at: string
  department: { id: string; name: string | null } | null
  author: UserMini | null
}

function pickUserLabel(u: UserMini | null) {
  return u?.name ?? u?.email ?? '—'
}

function avgRate(a: number | null, b: number | null, c: number | null) {
  const vals = [a, b, c].filter((x): x is number => typeof x === 'number')
  if (!vals.length) return null
  return Math.round((vals.reduce((acc, v) => acc + v, 0) / vals.length) * 10) / 10
}

export default function ReportsTabs(props: {
  coverage: number
  sentUnique: number
  totalCells: number
  missingCells: Cell[]
  missingCount: number
  cellMeetings: CellMeetingEnriched[]
  departmentMeetings: DepartmentMeetingEnriched[]
}) {
  const [tab, setTab] = useState<'cells' | 'departments'>('cells')

  return (
    <div>
      {/* Abas */}
      <div className='mb-6 flex items-center gap-2 border-b border-white/10'>
        <button
          type='button'
          onClick={() => setTab('cells')}
          className={`px-3 py-2 text-sm -mb-px border-b-2 cursor-pointer ${
            tab === 'cells'
              ? 'border-white/80 text-white'
              : 'border-transparent text-muted-foreground hover:text-white/80'
          }`}
        >
          Células
        </button>

        <button
          type='button'
          onClick={() => setTab('departments')}
          className={`px-3 py-2 text-sm -mb-px border-b-2 cursor-pointer ${
            tab === 'departments'
              ? 'border-white/80 text-white'
              : 'border-transparent text-muted-foreground hover:text-white/80'
          }`}
        >
          Ministérios
        </button>
      </div>

      {/* Conteúdo */}
      {tab === 'cells' ? (
        <>
          <Link href='/offc/relatorios/celulas'>
            <Button size='sm' variant='secondary' className='cursor-pointer'>
              Ver todos
            </Button>
          </Link>
          {/* Lista de relatórios de células */}
          <section className='mb-10'>
            <h2 className='text-lg font-semibold mb-3'>Relatórios Semanais de Células</h2>

            {props.cellMeetings.length === 0 ? (
              <div className='rounded-lg border p-6 text-center text-sm text-muted-foreground'>
                Nenhum relatório de célula nesta semana.
              </div>
            ) : (
              <ul className='space-y-3'>
                {props.cellMeetings.map((m) => {
                  const ratio =
                    typeof m.attendees_count === 'number' && typeof m.members_count === 'number'
                      ? `${m.attendees_count}/${m.members_count}`
                      : null

                  const score = avgRate(m.icebreaker_rate, m.worship_rate, m.word_rate)
                  const visitors = typeof m.visitors_count === 'number' ? m.visitors_count : 0
                  const hasNotes = Boolean(m.notes?.trim())
                  const cellLabel = m.cell?.name ?? `Célula ${m.cell_id}`

                  return (
                    <li key={m.id} className='rounded-lg border p-4'>
                      <div className='flex items-start justify-between gap-4'>
                        <div className='min-w-0'>
                          <div className='font-medium truncate'>{cellLabel}</div>

                          <div className='mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground'>
                            <div className='flex items-center gap-1'>
                              <MapPin size={14} />
                              <span>Reunião: {m.occurred_at}</span>
                            </div>

                            {ratio ? (
                              <div className='flex items-center gap-1'>
                                <Users size={14} />
                                <span>Presentes: {ratio}</span>
                              </div>
                            ) : null}

                            {visitors > 0 ? (
                              <div className='flex items-center gap-1'>
                                <Sparkles size={14} />
                                <span>Visitantes: {visitors}</span>
                              </div>
                            ) : null}

                            {typeof score === 'number' ? <span>Score: {score}/5</span> : null}
                            {hasNotes ? (
                              <div className='flex items-center gap-1'>
                                <StickyNote size={14} />
                                <span>Tem notas</span>
                              </div>
                            ) : null}

                            <span>Por: {pickUserLabel(m.author)}</span>
                          </div>
                        </div>

                        <div className='shrink-0'>
                          <Link href={`/offc/cell-meetings/${encodeURIComponent(m.id)}/manage`}>
                            <Button size='sm' className='cursor-pointer'>
                              Ler
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>

          <section className='mb-10'>
            <div className='flex items-end justify-between gap-4 mb-3'>
              <div>
                <h2 className='text-lg font-semibold'>Células sem relatório</h2>
                <p className='text-xs text-muted-foreground'>
                  {props.sentUnique}/{props.totalCells} enviaram • Cobertura: {props.coverage}%
                </p>
              </div>

              <div className='text-xs text-muted-foreground'>
                {props.missingCount === 0 ? (
                  <span className='text-emerald-400'>Tudo em dia</span>
                ) : (
                  <span className='text-amber-400'>
                    {props.missingCount} pendente{props.missingCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {props.missingCount === 0 ? (
              <div className='rounded-lg border p-6 text-center text-sm text-muted-foreground'>
                Todas as células enviaram relatório nesta semana ✅
              </div>
            ) : (
              <div className='rounded-lg border p-4'>
                <ul className='space-y-2'>
                  {props.missingCells.map((c) => (
                    <li key={c.id} className='flex items-center justify-between gap-4'>
                      <div className='min-w-0 flex flex-row items-center gap-2'>
                        <div className='font-medium truncate'>{c.name ?? `Célula ${c.id}`}</div>
                        <div className='text-xs text-muted-foreground'>Sem envio</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </>
      ) : (
        <>
          {/* Lista de relatórios de departamentos */}
          <section>
            <h2 className='text-lg font-semibold mb-3'>Relatórios de Ministérios</h2>

            {props.departmentMeetings.length === 0 ? (
              <div className='rounded-lg border p-6 text-center text-sm text-muted-foreground'>
                Nenhum relatório de ministério nesta semana.
              </div>
            ) : (
              <ul className='space-y-3'>
                {props.departmentMeetings.map((meet) => {
                  const presentCount = Array.isArray(meet.members) ? meet.members.length : null
                  const hasDesc = Boolean(meet.description?.trim())
                  const deptName = meet.department?.name ?? meet.department_id ?? '—'

                  return (
                    <li key={meet.id} className='rounded-lg border p-4'>
                      <div className='flex items-start justify-between gap-4'>
                        <div className='min-w-0'>
                          <div className='font-medium truncate'>{meet.title ?? 'Reunião'}</div>

                          <div className='mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground'>
                            <span>Ministério: {deptName}</span>
                            {typeof presentCount === 'number' ? <span>Presentes: {presentCount}</span> : null}
                            {hasDesc ? <span>Tem observação</span> : null}
                            <span>Por: {pickUserLabel(meet.author)}</span>
                          </div>
                        </div>

                        <div className='shrink-0'>
                          <Link href={`/offc/meetings/${encodeURIComponent(meet.id)}/manage`}>
                            <Button size='sm' className='cursor-pointer'>
                              Ler
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  )
}