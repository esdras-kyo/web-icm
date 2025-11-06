import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/utils/supabase/admin";

export async function POST(request: Request) {
	const body = await request.json();
	const supabase = createSupabaseAdmin();
	const { error } = await supabase
		.from('registrations')
		.insert(body)
	if (error) {
			console.error('❌ Supabase update error:', error);
		return NextResponse.json({ error: error.message }, { status: 400 });
		}

	return NextResponse.json({ message: 'OK' });

}