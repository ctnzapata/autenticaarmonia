// =============================================
// APPLICATION LAYER — WhatsApp Link Generator
// =============================================

import { Product, Customization, formatCOP } from '../domain/types';

const WHATSAPP_NUMBER = '573001234567'; // Reemplazar con número real

export const generateWhatsAppLink = (
    product: Product,
    customization: Customization
): string => {
    const basePrice = product.price;
    const customizationCost = customization.initials ? 5000 : 0;
    const totalPrice = basePrice + customizationCost;

    const lines: string[] = [
        `🌿 *Hola Auténtica Armonía!*`,
        ``,
        `Me encantaría hacer un pedido:`,
        ``,
        `📿 *Producto:* ${product.name}`,
        `💰 *Precio base:* ${formatCOP(basePrice)}`,
    ];

    if (customization.selectedColor) {
        lines.push(`🎨 *Color elegido:* ${customization.selectedColor.name}`);
    }
    if (customization.selectedSize) {
        lines.push(`📏 *Talla:* ${customization.selectedSize.label} (${customization.selectedSize.value})`);
    }
    if (customization.initials) {
        lines.push(`✦ *Iniciales:* ${customization.initials} (+${formatCOP(customizationCost)})`);
    }
    if (customization.specialNote) {
        lines.push(`📝 *Nota especial:* ${customization.specialNote}`);
    }

    lines.push(``);
    lines.push(`💳 *Total estimado: ${formatCOP(totalPrice)}*`);
    lines.push(``);
    lines.push(`¡Gracias! Quedo atenta a su respuesta. 💚`);

    const message = encodeURIComponent(lines.join('\n'));
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
};
