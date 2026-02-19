// Supabase client — Auténtica Armonía
// Docs: https://supabase.com/docs/reference/javascript
//
// NOTA DE SCHEMA:
// PKs usan BIGINT GENERATED ALWAYS AS IDENTITY (no UUID v4)
// Razón: evita fragmentación de índices B-tree (~2x más rápido en inserciones)
// Ref: supabase-postgres-best-practices / schema-primary-keys

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente público (para el storefront y admin lado cliente)
export const supabase = createClient(supabaseUrl, supabaseAnon);

// Tipos generados del esquema (se puede expandir con `supabase gen types`)
export type Database = {
    public: {
        Tables: {
            products: {
                Row: {
                    id: number;        // BIGINT IDENTITY (no UUID v4 — ver schema.sql)
                    slug: string;
                    name: string;
                    description: string | null;
                    price: number;
                    technique: 'MIYUKI' | 'CROCHET' | 'MIXED' | 'PEYOTE';
                    category: string | null;
                    images: string[];
                    colors: Array<{ id: string; name: string; hex: string }>;
                    sizes: Array<{ id: string; label: string; value: string }>;
                    rating: number;
                    review_count: number;
                    is_new: boolean;
                    is_customizable: boolean;
                    in_stock: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at' | 'rating' | 'review_count'>;
                Update: Partial<Database['public']['Tables']['products']['Insert']>;
            };
            orders: {
                Row: {
                    id: number;        // BIGINT IDENTITY
                    customer_name: string;
                    customer_phone: string;
                    product_id: number | null;  // FK → products.id (BIGINT)
                    customization: Record<string, unknown>;
                    total_amount: number;
                    status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'SHIPPED' | 'DELIVERED';
                    notes: string | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['orders']['Insert']>;
            };
        };
    };
};
