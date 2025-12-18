import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createSupabaseAdmin } from '../../../../utils/supabase/admin'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ depId: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const { depId } = await params

    const supabase = createSupabaseAdmin()

    const { data, error } = await supabase
      .from('departments')
      .select('id, name')
      .eq('id', depId)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'department not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (err: unknown) {
    console.error('error /api/departments/[depId]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'unknown' },
      { status: 500 }
    )
  }
}