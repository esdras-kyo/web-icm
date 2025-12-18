import { use } from 'react'
import { headers } from 'next/headers'
import BackButton from '../../components/BackButton'
import { MeetingFormSimple } from '../../components/MeetingForm'

type Department = {
  id: string
  name: string | null
}

async function getDepartment(depId: string): Promise<Department | null> {
  const h = await headers()
  const cookie = h.get('cookie') ?? ''

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/departments/${depId}`,
    {
      method: 'GET',
      headers: { cookie },
      cache: 'no-store',
    }
  )

  if (!res.ok) return null
  return res.json()
}

export default function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ depId: string }>
}) {
  const { depId } = use(params)
  const department = use(getDepartment(depId))

  return (
    <div className="w-full mx-auto p-6 space-y-6 text-white">
      <BackButton />

      <div>
        <h1 className="text-2xl font-semibold">
          {department?.name ?? 'Departamento'}
        </h1>
      </div>

      <MeetingFormSimple depId={depId} />
    </div>
  )
}