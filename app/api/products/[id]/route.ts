// API Route: /api/products/[id]
// PUT    → Actualiza un producto
// DELETE → Elimina un producto

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/infrastructure/supabaseAdmin';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = getSupabaseAdmin();
    const { id } = await params;
    const body = await request.json();
    const { name, description, technique, category, price, inStock, isNew, isCustomizable, images } = body;

    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (technique !== undefined) updates.technique = technique;
    if (category !== undefined) updates.category = category;
    if (price !== undefined) updates.price = Number(price);
    if (inStock !== undefined) updates.in_stock = inStock;
    if (isNew !== undefined) updates.is_new = isNew;
    if (isCustomizable !== undefined) updates.is_customizable = isCustomizable;
    if (images !== undefined) updates.images = images;

    const { data, error } = await admin
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = getSupabaseAdmin();
    const { id } = await params;

    const { error } = await admin
        .from('products')
        .delete()
        .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
