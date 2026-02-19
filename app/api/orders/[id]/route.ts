// API Route: /api/orders/[id]
// PUT → Actualiza el status de una orden

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/infrastructure/supabaseAdmin';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = getSupabaseAdmin();
    const { id } = await params;
    const { status } = await request.json();

    const validStatuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'SHIPPED', 'DELIVERED'];
    if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: 'Status inválido' }, { status: 400 });
    }

    const { data, error } = await admin
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
