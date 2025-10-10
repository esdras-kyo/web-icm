import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/utils/supabase/admin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const status = searchParams.get('status');
  const visibility = searchParams.get('visibility');

  if (id && status) {
    return NextResponse.json(
      { error: 'Use either id OR status, not both.' },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdmin();

  if (id) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  }


  let query = supabase.from('events').select('*');
  if (status) {
    query = query.eq('status', status);
  }
  if (visibility) {
    query = query.eq('visibility', visibility);
  }

  const { data, error } = await query.order('starts_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}