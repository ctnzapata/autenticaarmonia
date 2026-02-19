// =============================================
// INFRASTRUCTURE LAYER — Mock Product Repository
// Datos de muestra para Auténtica Armonía
// =============================================

import { Product, Order } from '../domain/types';

export const COLORS = [
    { id: 'verde-esmeralda', name: 'Verde Esmeralda', hex: '#2E7D32' },
    { id: 'azul-oceano', name: 'Azul Océano', hex: '#0277BD' },
    { id: 'burdeos', name: 'Rojo Burdeos', hex: '#7B1FA2' },
    { id: 'blanco-perla', name: 'Blanco Perla', hex: '#F5F5F0' },
    { id: 'negro-medianoche', name: 'Negro Medianoche', hex: '#1A1A2E' },
    { id: 'dorado-sol', name: 'Dorado Sol', hex: '#FBC02D' },
];

export const SIZES_PULSERA = [
    { id: 'xs', label: 'XS', value: '14cm' },
    { id: 's', label: 'S', value: '16cm' },
    { id: 'm', label: 'M', value: '18cm' },
    { id: 'l', label: 'L', value: '20cm' },
];

export const SIZES_COLLAR = [
    { id: 'corto', label: 'Corto', value: '40cm' },
    { id: 'medio', label: 'Medio', value: '45cm' },
    { id: 'largo', label: 'Largo', value: '50cm' },
];

export const mockProducts: Product[] = [
    {
        id: '1',
        slug: 'pulsera-miyuki-estrella',
        name: 'Pulsera Miyuki Estrella',
        description: 'Tejida a mano con cuentas japonesas Miyuki Delica de alta precisión. Cada estrella es un patrón geométrico perfecto que toma más de 5 horas de elaboración artesanal. Un recordatorio de tu luz interior.',
        price: 45000,
        technique: 'MIYUKI',
        images: ['/images/pulsera-miyuki-estrella.jpg'],
        colors: COLORS,
        sizes: SIZES_PULSERA,
        rating: 4.8,
        reviewCount: 24,
        isNew: false,
        isCustomizable: true,
        inStock: true,
        category: 'Pulseras',
    },
    {
        id: '2',
        slug: 'collar-crochet-luna',
        name: 'Collar Crochet Luna',
        description: 'Tejido en crochet con hilo de algodón orgánico. El diseño de luna creciente es un símbolo de transformación y feminidad. Ligero, etéreo y único.',
        price: 65000,
        technique: 'CROCHET',
        images: ['/images/collar-crochet-luna.jpg'],
        colors: COLORS.slice(0, 4),
        sizes: SIZES_COLLAR,
        rating: 5.0,
        reviewCount: 18,
        isNew: true,
        isCustomizable: true,
        inStock: true,
        category: 'Collares',
    },
    {
        id: '3',
        slug: 'aretes-miyuki-geometrico',
        name: 'Aretes Miyuki Geométrico',
        description: 'Patrones geométricos tejidos con cuentas Miyuki Delica. Livianos y elegantes, ideales para el día a día o una ocasión especial.',
        price: 35000,
        technique: 'MIYUKI',
        images: ['/images/aretes-miyuki-geometrico.jpg'],
        colors: COLORS,
        sizes: [],
        rating: 4.6,
        reviewCount: 31,
        isNew: false,
        isCustomizable: true,
        inStock: true,
        category: 'Aretes',
    },
    {
        id: '4',
        slug: 'pulsera-crochet-boho',
        name: 'Pulsera Crochet Boho',
        description: 'Estilo bohemio en su máxima expresión. Tejida a mano con hilo de macramé y detalles artesanales. Perfecta para el verano y festivales.',
        price: 40000,
        technique: 'CROCHET',
        images: ['/images/pulsera-crochet-boho.jpg'],
        colors: COLORS.slice(0, 5),
        sizes: SIZES_PULSERA,
        rating: 4.7,
        reviewCount: 15,
        isNew: false,
        isCustomizable: true,
        inStock: true,
        category: 'Pulseras',
    },
    {
        id: '5',
        slug: 'set-miyuki-corazon',
        name: 'Set Miyuki Corazón',
        description: 'Set completo de pulsera y aretes con motivo de corazón. Perfecto como regalo para alguien especial. Totalmente personalizable con iniciales.',
        price: 85000,
        technique: 'MIYUKI',
        images: ['/images/set-miyuki-corazon.jpg'],
        colors: COLORS,
        sizes: SIZES_PULSERA,
        rating: 4.9,
        reviewCount: 42,
        isNew: false,
        isCustomizable: true,
        inStock: true,
        category: 'Sets',
    },
    {
        id: '6',
        slug: 'tobillera-crochet-tropical',
        name: 'Tobillera Crochet Tropical',
        description: 'Tobillera tejida con motivos tropicales. Colores vivos y alegres para llevar el espíritu caribeño colombiano contigo a donde vayas.',
        price: 50000,
        technique: 'CROCHET',
        images: ['/images/tobillera-crochet-tropical.jpg'],
        colors: COLORS.slice(0, 4),
        sizes: SIZES_PULSERA,
        rating: 4.5,
        reviewCount: 9,
        isNew: true,
        isCustomizable: false,
        inStock: true,
        category: 'Tobilleras',
    },
    {
        id: '7',
        slug: 'anillo-miyuki-mandala',
        name: 'Anillo Miyuki Mandala',
        description: 'Un mandala en miniatura en tu dedo. Tejido con cuentas Miyuki de 1.6mm con precisión milimétrica. Símbolo de armonía y equilibrio interior.',
        price: 30000,
        technique: 'MIYUKI',
        images: ['/images/anillo-miyuki-mandala.jpg'],
        colors: COLORS,
        sizes: [
            { id: '6', label: '#6', value: '16.5mm' },
            { id: '7', label: '#7', value: '17.3mm' },
            { id: '8', label: '#8', value: '18.2mm' },
        ],
        rating: 4.7,
        reviewCount: 12,
        isNew: false,
        isCustomizable: true,
        inStock: true,
        category: 'Anillos',
    },
    {
        id: '8',
        slug: 'collar-mixto-bohemio',
        name: 'Collar Mixto Bohemio',
        description: 'Lo mejor de dos mundos: la precisión de las cuentas Miyuki combinada con la calidez del crochet. Una pieza única que combina técnicas para un resultado extraordinario.',
        price: 75000,
        technique: 'MIXED',
        images: ['/images/collar-mixto-bohemio.jpg'],
        colors: COLORS,
        sizes: SIZES_COLLAR,
        rating: 4.8,
        reviewCount: 27,
        isNew: false,
        isCustomizable: true,
        inStock: true,
        category: 'Collares',
    },
];

export const mockOrders: Order[] = [
    {
        id: 'ORD-001',
        customerName: 'María García',
        customerPhone: '+573001234567',
        product: mockProducts[0],
        customization: { productId: '1', initials: 'M.G.', selectedColor: COLORS[0] },
        totalAmount: 50000,
        status: 'PENDING',
        createdAt: new Date('2025-02-19T08:00:00'),
    },
    {
        id: 'ORD-002',
        customerName: 'Laura Martínez',
        customerPhone: '+573009876543',
        product: mockProducts[1],
        customization: { productId: '2' },
        totalAmount: 65000,
        status: 'CONFIRMED',
        createdAt: new Date('2025-02-18T15:30:00'),
    },
    {
        id: 'ORD-003',
        customerName: 'Sofía Rodríguez',
        customerPhone: '+573005551234',
        product: mockProducts[4],
        customization: { productId: '5', initials: 'S.R.', specialNote: 'Es un regalo, por favor empaque especial' },
        totalAmount: 95000,
        status: 'IN_PROGRESS',
        createdAt: new Date('2025-02-18T10:00:00'),
    },
];

// Repository functions
export const getProducts = (): Product[] => mockProducts;

export const getProductBySlug = (slug: string): Product | undefined =>
    mockProducts.find(p => p.slug === slug);

export const getFeaturedProducts = (limit = 3): Product[] =>
    mockProducts.slice(0, limit);

export const getProductsByTechnique = (technique: string): Product[] =>
    technique === 'ALL'
        ? mockProducts
        : mockProducts.filter(p => p.technique === technique);
