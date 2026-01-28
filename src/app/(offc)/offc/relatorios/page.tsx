import { HighlightKpiCard } from '@/app/components/HighlightKpiCard'
import { Button } from '@/components/ui/button'
import { createSupabaseAdmin } from '@/utils/supabase/admin'
import { ScrollText, Users, MapPin, StickyNote, Sparkles } from 'lucide-react'
import Link from 'next/link'
import MeetingsRadial from './meetingsPorcent'
import ReportsTabs from './reportstabs'

type DepartmentMeeting = {
  id: string
  department_id: string | null
  title: string | null
  description: string | null
  members: string[] | null
  created_by: string | null
  created_at: string
}

type CellMeeting = {
  id: string
  cell_id: string
  occurred_at: string // date (YYYY-MM-DD)
  notes: string | null
  created_by: string | null
  created_at: string
  leader_user_id: string | null
  assistant_user_id: string | null
  host_user_id: string | null
  members_count: number | null
  attendees_count: number | null
  icebreaker_rate: number | null
  worship_rate: number | null
  word_rate: number | null
  sunday_attendance_count: number | null
  visitors_count: number | null
}

type Department = {
  id: string
  name: string | null
}

type UserMini = {
  id: string
  name: string | null
 // full_name: string | null
  email: string | null
}

type DepartmentMeetingEnriched = DepartmentMeeting & {
  department: Department | null
  author: UserMini | null
}

type Cell = {
  id: string
  name: string | null
}

type CellMeetingEnriched = CellMeeting & {
  cell: Cell | null
  author: UserMini | null
}

function clampNumber(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function formatDateBR(isoOrDate: string) {
  const d = new Date(isoOrDate)
  if (Number.isNaN(d.getTime())) return isoOrDate
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeZone: 'America/Sao_Paulo' }).format(d)
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

function startOfWeekSP(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).formatToParts(now)

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  const yyyy = Number(get('year'))
  const mm = Number(get('month'))
  const dd = Number(get('day'))

  const localNoonUtc = new Date(Date.UTC(yyyy, mm - 1, dd, 12, 0, 0))

  const dowParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short',
  }).formatToParts(localNoonUtc)
  const wd = dowParts.find((p) => p.type === 'weekday')?.value ?? 'Mon'
  const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  const dow = map[wd] ?? 1

  const back = dow === 0 ? 6 : dow - 1
  const mondayNoonUtc = new Date(localNoonUtc)
  mondayNoonUtc.setUTCDate(mondayNoonUtc.getUTCDate() - back)

  const mondayParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(mondayNoonUtc)

  const y = Number(mondayParts.find((p) => p.type === 'year')?.value)
  const m = Number(mondayParts.find((p) => p.type === 'month')?.value)
  const d = Number(mondayParts.find((p) => p.type === 'day')?.value)

  const startUtc = new Date(Date.UTC(y, m - 1, d, 3, 0, 0))
  const endUtc = new Date(startUtc)
  endUtc.setUTCDate(endUtc.getUTCDate() + 7)

  const startDate = `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  const endYMDParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(endUtc)
  const ey = endYMDParts.find((p) => p.type === 'year')?.value ?? startDate.slice(0, 4)
  const em = endYMDParts.find((p) => p.type === 'month')?.value ?? startDate.slice(5, 7)
  const ed = endYMDParts.find((p) => p.type === 'day')?.value ?? startDate.slice(8, 10)
  const endDate = `${ey}-${em}-${ed}`

  return {
    startIso: startUtc.toISOString(),
    endIso: endUtc.toISOString(),
    startDate,
    endDate,
  }
}

function avgRate(a: number | null, b: number | null, c: number | null) {
  const vals = [a, b, c].filter((x): x is number => typeof x === 'number')
  if (vals.length === 0) return null
  const sum = vals.reduce((acc, v) => acc + v, 0)
  return Math.round((sum / vals.length) * 10) / 10
}

function pickUserLabel(u: UserMini | null) {
  if (!u) return '—'
  return u.name ?? u.email ?? '—'
}

export default async function ReportsPage() {
  const supabase = createSupabaseAdmin()
  const week = startOfWeekSP(new Date())

  const [depRes, cellRes, allCellsRes] = await Promise.all([
    supabase
      .from('meetings')
      .select('id, department_id, title, description, members, created_by, created_at')
      .gte('created_at', week.startIso)
      .lt('created_at', week.endIso)
      .order('created_at', { ascending: false }),
    supabase
      .from('cell_meetings')
      .select(
        'id, cell_id, occurred_at, notes, created_by, created_at, leader_user_id, assistant_user_id, host_user_id, members_count, attendees_count, icebreaker_rate, worship_rate, word_rate, sunday_attendance_count, visitors_count'
      )
      .gte('occurred_at', week.startDate)
      .lt('occurred_at', week.endDate)
      .order('occurred_at', { ascending: false }),
    supabase.from('cells').select('id, name').order('name', { ascending: true }),
  ])

  if (depRes.error || cellRes.error || allCellsRes.error) {
    return (
      <div className='max-w-6xl mx-auto py-10 px-6'>
        <p className='text-red-500'>Erro ao carregar relatórios.</p>
        <p className='mt-2 text-xs text-muted-foreground'>
          {depRes.error?.message ?? cellRes.error?.message ?? allCellsRes.error?.message}
        </p>
      </div>
    )
  }

  const meetings = (depRes.data ?? []) as DepartmentMeeting[]
  const cellMeetings = (cellRes.data ?? []) as CellMeeting[]

  const allCells = (allCellsRes.data ?? []) as Cell[]

  const sentCellIds = new Set(cellMeetings.map((m) => m.cell_id))
  const sentUnique = sentCellIds.size

  const totalCells = allCells.length
  const missingCells = allCells.filter((c) => !sentCellIds.has(c.id))
  const missingCount = missingCells.length

  const coverage = totalCells > 0 ? Math.round((sentUnique / totalCells) * 100) : 0

  const departmentIds = Array.from(new Set(meetings.map((m) => m.department_id).filter(Boolean))) as string[]
  const meetingAuthorIds = Array.from(new Set(meetings.map((m) => m.created_by).filter(Boolean))) as string[]

  const cellIds = Array.from(new Set(cellMeetings.map((m) => m.cell_id).filter(Boolean))) as string[]
  const cellAuthorIds = Array.from(new Set(cellMeetings.map((m) => m.created_by).filter(Boolean))) as string[]

  const allUserIds = Array.from(new Set([...meetingAuthorIds, ...cellAuthorIds]))

  const [depsRes, usersRes] = await Promise.all([
    departmentIds.length
      ? supabase.from('departments').select('id, name').in('id', departmentIds)
      : Promise.resolve({ data: [] as Department[], error: null }),
    allUserIds.length
      ? supabase.from('users').select('id, name, email').in('id', allUserIds)
      : Promise.resolve({ data: [] as UserMini[], error: null }),
  ])

  if (depsRes.error || usersRes.error) {
    return (
      <div className='max-w-6xl mx-auto py-10 px-6'>
        <p className='text-red-500'>Erro ao carregar nomes (departamentos/usuários).</p>
        <p className='mt-2 text-xs text-muted-foreground'>{depsRes.error?.message ?? usersRes.error?.message}</p>
      </div>
    )
  }

  const departmentsById = new Map((depsRes.data ?? []).map((d) => [d.id, d]))
  const cellsById = new Map(allCells.map((c) => [c.id, c]))
  const usersById = new Map((usersRes.data ?? []).map((u) => [u.id, u]))

  const meetingsEnriched: DepartmentMeetingEnriched[] = meetings.map((m) => ({
    ...m,
    department: m.department_id ? departmentsById.get(m.department_id) ?? null : null,
    author: m.created_by ? usersById.get(m.created_by) ?? null : null,
  }))

  const cellMeetingsEnriched: CellMeetingEnriched[] = cellMeetings.map((m) => ({
    ...m,
    cell: m.cell_id ? cellsById.get(m.cell_id) ?? null : null,
    author: m.created_by ? usersById.get(m.created_by) ?? null : null,
  }))

  const totalThisWeek = meetingsEnriched.length + cellMeetingsEnriched.length

  return (
    <div className='max-w-6xl mx-auto py-10 px-6'>
      <div className='flex items-end justify-between gap-4 mb-6'>
        <div>
          <h1 className='text-2xl font-semibold'>Relatórios</h1>
          <p className='text-xs text-muted-foreground mt-1'>
            Semana: {formatDateBR(week.startIso)} –{' '}
            {formatDateBR(new Date(new Date(week.endIso).getTime() - 1).toISOString())}
          </p>
        </div>

      </div>

      <div
        className='
          flex flex-col gap-4
          md:grid md:grid-cols-2
          xl:grid-cols-4
          w-full max-w-full
          mb-8
        '
      >
        <HighlightKpiCard
          label='Relatórios da semana'
          value={totalThisWeek}
          description='Células + Departamentos'
          icon={<ScrollText size={18} />}
        />

        <MeetingsRadial
          label="Relatórios (Células)"
          percent={coverage}
          helperText={`${sentUnique}/${totalCells} células enviaram nesta semana`}
        />
      </div>

      <section className='mb-10'>
      <ReportsTabs
        coverage={coverage}
        sentUnique={sentUnique}
        totalCells={totalCells}
        missingCells={missingCells}
        missingCount={missingCount}
        cellMeetings={cellMeetingsEnriched}
        departmentMeetings={meetingsEnriched}
      />
      </section>
    </div>
  )
}