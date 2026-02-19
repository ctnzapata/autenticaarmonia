// API Route: /api/products
// GET  → Lista todos los productos (o filtra por technique/search)
// POST → Crea un nuevo producto (requiere service_role via servidor)

export const dynamic = 'force-dynamic'; // No pre-renderizar en build

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/infrastructure/supabase';
import { getSupabaseAdmin } from '@/lib/infrastructure/supabaseAdmin';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const technique = searchParams.get('technique');
    const search = searchParams.get('search');

    let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (technique && technique !== 'ALL') {
        query = query.eq('technique', technique);
    }
    if (search) {
        query = query.ilike('name', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
    const admin = getSupabaseAdmin();
    const body = await request.json();
    const { name, description, technique, category, price, inStock, isNew, isCustomizable, images } = body;

    if (!name || !price || !technique) {
        return NextResponse.json({ error: 'name, price y technique son requeridos' }, { status: 400 });
    }

    const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    const { data, error } = await admin
        .from('products')
        .insert({
            slug,
            name,
            description: description ?? null,
            technique,
            category: category ?? null,
            price: Number(price),
            in_stock: inStock ?? true,
            is_new: isNew ?? false,
            is_customizable: isCustomizable ?? true,
            images: images ?? [],
            colors: [],
            sizes: [],
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
}
