import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/utils/supabase/admin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const slug = searchParams.get('slug');
  const status = searchParams.get('status');
  const visibility = searchParams.get('visibility');

  if (id && slug) {
    return NextResponse.json(
      { error: 'Use either id OR slug, not both.' },
      { status: 400 }
    );
  }

  if ((id || slug) && status) {
    return NextResponse.json(
      { error: 'Use either id/slug OR status, not both.' },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdmin();

  const DETAIL_SELECT =
    'id, title, description, price, image_key, starts_at, ends_at, address, status, visibility, registration_fields, registration_starts_at, registration_ends_at, payment_note, capacity, slug';

  if (id) {
    const { data, error } = await supabase
      .from('events')
      .select(DETAIL_SELECT)
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

  if (slug) {
    const { data, error } = await supabase
      .from('events')
      .select(DETAIL_SELECT)
      .eq('slug', slug)
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  }

  const now = new Date().toISOString();

  let query = supabase
    .from('events')
    .select('id, title, description, price, image_key, starts_at, ends_at, address, slug')
    .gte('ends_at', now);

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
