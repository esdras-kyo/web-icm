import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createSupabaseAdmin } from '@/utils/supabase/admin'
import Link from 'next/link'
import { MapPin, Users, Sparkles, StickyNote } from 'lucide-react'

type CellMeeting = {
  id: string
  cell_id: string
  occurred_at: string
  notes: string | null
  created_by: string | null
  created_at: string
  members_count: number | null
  attendees_count: number | null
  visitors_count: number | null
  icebreaker_rate: number | null
  worship_rate: number | null
  word_rate: number | null
}

type Cell = { id: string; name: string | null }

type UserMini = { id: string; name: string | null; email: string | null }

type CellMeetingEnriched = CellMeeting & {
  cell: Cell | null
  author: UserMini | null
}

function avgRate(a: number | null, b: number | null, c: number | null) {
  const vals = [a, b, c].filter((x): x is number => typeof x === 'number')
  if (!vals.length) return null
  return Math.round((vals.reduce((acc, v) => acc + v, 0) / vals.length) * 10) / 10
}

function pickUserLabel(u: UserMini | null) {
  return u?.name ?? u?.email ?? '—'
}

function formatDateTimeBR(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  }).format(d)
}

export default async function CellMeetingsPage({
  searchParams,
}: {
  searchParams?: { q?: string; order?: 'asc' | 'desc' }
}) {
  const supabase = createSupabaseAdmin()

  const qRaw = (searchParams?.q ?? '').trim()
  const q = qRaw.length > 0 ? qRaw : ''
  const order = searchParams?.order === 'asc' ? 'asc' : 'desc'

  // 1) Se tiver busca, pegar cell ids pelo nome
  let filteredCellIds: string[] | null = null
  if (q) {
    const cellsByNameRes = await supabase
      .from('cells')
      .select('id')
      .ilike('name', `%${q}%`)
      .limit(200)

    if (cellsByNameRes.error) {
      return (
        <div className='max-w-6xl mx-auto py-10 px-6'>
          <p className='text-red-500'>Erro ao buscar células.</p>
          <p className='mt-2 text-xs text-muted-foreground'>{cellsByNameRes.error.message}</p>
        </div>
      )
    }

    filteredCellIds = (cellsByNameRes.data ?? []).map((c) => c.id)

    // Se a busca não encontrou nenhuma célula, já retorna vazio (sem query grande)
    if (filteredCellIds.length === 0) {
      return (
        <div className='max-w-6xl mx-auto py-10 px-6'>
          <Header q={q} order={order} />
          <div className='rounded-lg border p-6 text-center text-sm text-muted-foreground'>
            Nenhuma célula encontrada com “{q}”.
          </div>
        </div>
      )
    }
  }

  // 2) Buscar relatórios (todos), ordenação simples
  // Observação: limit pra não explodir. Depois você pagina.
  let meetQuery = supabase
    .from('cell_meetings')
    .select(
      'id, cell_id, occurred_at, notes, created_by, created_at, members_count, attendees_count, visitors_count, icebreaker_rate, worship_rate, word_rate'
    )
    .order('occurred_at', { ascending: order === 'asc' })
    .limit(300)

  if (filteredCellIds) {
    meetQuery = meetQuery.in('cell_id', filteredCellIds)
  }

  const meetRes = await meetQuery

  if (meetRes.error) {
    return (
      <div className='max-w-6xl mx-auto py-10 px-6'>
        <p className='text-red-500'>Erro ao carregar relatórios de células.</p>
        <p className='mt-2 text-xs text-muted-foreground'>{meetRes.error.message}</p>
      </div>
    )
  }

  const cellMeetings = (meetRes.data ?? []) as CellMeeting[]

  // 3) Enriquecer (cells + users) em lote
  const cellIds = Array.from(new Set(cellMeetings.map((m) => m.cell_id)))
  const userIds = Array.from(new Set(cellMeetings.map((m) => m.created_by).filter(Boolean))) as string[]

  const [cellsRes, usersRes] = await Promise.all([
    cellIds.length
      ? supabase.from('cells').select('id, name').in('id', cellIds)
      : Promise.resolve({ data: [] as Cell[], error: null }),
    userIds.length
      ? supabase.from('users').select('id, name, email').in('id', userIds)
      : Promise.resolve({ data: [] as UserMini[], error: null }),
  ])

  if (cellsRes.error || usersRes.error) {
    return (
      <div className='max-w-6xl mx-auto py-10 px-6'>
        <p className='text-red-500'>Erro ao carregar nomes (células/usuários).</p>
        <p className='mt-2 text-xs text-muted-foreground'>
          {cellsRes.error?.message ?? usersRes.error?.message}
        </p>
      </div>
    )
  }

  const cellsById = new Map((cellsRes.data ?? []).map((c) => [c.id, c]))
  const usersById = new Map((usersRes.data ?? []).map((u) => [u.id, u]))

  const enriched: CellMeetingEnriched[] = cellMeetings.map((m) => ({
    ...m,
    cell: cellsById.get(m.cell_id) ?? null,
    author: m.created_by ? usersById.get(m.created_by) ?? null : null,
  }))

  return (
    <div className='max-w-6xl mx-auto py-10 px-6'>
      <Header q={q} order={order} />

      {enriched.length === 0 ? (
        <div className='rounded-lg border p-6 text-center text-sm text-muted-foreground'>
          Nenhum relatório encontrado.
        </div>
      ) : (
        <ul className='space-y-3'>
          {enriched.map((m) => {
            const ratio =
              typeof m.attendees_count === 'number' && typeof m.members_count === 'number'
                ? `${m.attendees_count}/${m.members_count}`
                : null

            const visitors = typeof m.visitors_count === 'number' ? m.visitors_count : 0
            const hasNotes = Boolean(m.notes && m.notes.trim().length > 0)
            const score = avgRate(m.icebreaker_rate, m.worship_rate, m.word_rate)

            const cellLabel = m.cell?.name ?? `Célula ${m.cell_id}`
            const authorLabel = pickUserLabel(m.author)

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

                      <span>
                        <span className='font-medium text-white/80'>Por:</span> {authorLabel}
                      </span>
                    </div>

                    <div className='mt-2 text-[11px] text-muted-foreground'>
                      Criado em: {formatDateTimeBR(m.created_at)}
                    </div>
                  </div>

                  <div className='shrink-0 flex items-center gap-2'>
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

      <div className='mt-8'>
      </div>
    </div>
  )
}

function Header({ q, order }: { q: string; order: 'asc' | 'desc' }) {
  return (
    <div className='mb-6 flex flex-col gap-4'>
      {/* Top: voltar + título */}
        <Link href="/offc/cells" className="text-sm underline">
            ← Voltar
          </Link>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-3 min-w-0'>

          <h1 className='text-xl sm:text-2xl font-semibold truncate'>Relatórios de Células</h1>
        </div>
      </div>

      {/* Filtros (stack no mobile) */}
      <form method='GET' className='flex flex-col gap-2 sm:flex-row sm:items-center'>
        <Input
          name='q'
          defaultValue={q}
          placeholder='Buscar por nome da célula...'
          className='w-full sm:w-[260px]'
        />

        <select
          name='order'
          defaultValue={order}
          className='h-10 w-full sm:w-auto rounded-md border border-white/10 bg-transparent px-3 text-sm text-white/80'
        >
          <option value='desc'>Mais novos</option>
          <option value='asc'>Mais antigos</option>
        </select>

        <div className='flex gap-2'>
          <Button type='submit' size='sm' className='cursor-pointer'>
            Filtrar
          </Button>

          {(q || order !== 'desc') && (
            <Link href='/offc/relatorios/celulas'>
              <Button size='sm' variant='secondary' className='cursor-pointer'>
                Limpar
              </Button>
            </Link>
          )}
        </div>
      </form>
    </div>
  )
}