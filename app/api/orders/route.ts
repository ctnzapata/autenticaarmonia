// API Route: /api/orders
// GET  → Lista órdenes (opcionalmente filtradas por status)
// POST → Crea una nueva orden

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/infrastructure/supabaseAdmin';

export async function GET(request: NextRequest) {
    const admin = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = admin
        .from('orders')
        .select('*, product:products(id, name, slug, price, technique)')
        .order('created_at', { ascending: false });

    if (status && status !== 'ALL') {
        query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
    const admin = getSupabaseAdmin();
    const body = await request.json();
    const { customerName, customerPhone, productId, customization, totalAmount, notes } = body;

    if (!customerName || !customerPhone || !totalAmount) {
        return NextResponse.json({ error: 'customerName, customerPhone y totalAmount son requeridos' }, { status: 400 });
    }

    const { data, error } = await admin
        .from('orders')
        .insert({
            customer_name: customerName,
            customer_phone: customerPhone,
            product_id: productId ?? null,
            customization: customization ?? {},
            total_amount: Number(totalAmount),
            notes: notes ?? null,
            status: 'PENDING',
        })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}
