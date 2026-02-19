// Cliente Supabase con service_role — SOLO server-side
// NUNCA importar este archivo desde componentes de cliente ('use client')
// Usado exclusivamente en API Routes y Server Actions

import { createClient } from '@supabase/supabase-js';

// Crea una nueva instancia por llamada (stateless en edge/serverless)
// No usar singleton mutable en ambientes serverless
export function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}

// Re-export para compatibilidad con: import { supabaseAdmin } from '...'
// (llama la función implícitamente — solo en runtime server-side)
export { getSupabaseAdmin as supabaseAdmin };
