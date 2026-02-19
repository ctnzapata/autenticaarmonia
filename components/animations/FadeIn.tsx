'use client';

import { motion, useInView, UseInViewOptions } from 'framer-motion';
import { useRef } from 'react';

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    fullWidth?: boolean;
    className?: string;
    style?: React.CSSProperties;
    viewport?: UseInViewOptions;
}

export default function FadeIn({
    children,
    delay = 0,
    direction = 'up',
    fullWidth = false,
    className = '',
    style = {},
    viewport = { once: true, margin: '-50px' }
}: FadeInProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, viewport);

    const getInitialVariants = () => {
        switch (direction) {
            case 'up': return { opacity: 0, y: 40 };
            case 'down': return { opacity: 0, y: -40 };
            case 'left': return { opacity: 0, x: 40 };
            case 'right': return { opacity: 0, x: -40 };
            case 'none': return { opacity: 0 };
            default: return { opacity: 0, y: 40 };
        }
    };

    const getTargetVariants = () => {
        switch (direction) {
            case 'up': case 'down': return { opacity: 1, y: 0 };
            case 'left': case 'right': return { opacity: 1, x: 0 };
            case 'none': return { opacity: 1 };
            default: return { opacity: 1, y: 0 };
        }
    };

    return (
        <motion.div
            ref={ref}
            initial={getInitialVariants()}
            animate={isInView ? getTargetVariants() : getInitialVariants()}
            transition={{
                duration: 0.8,
                delay: delay,
                ease: [0.21, 0.47, 0.32, 0.98] // Smooth custom easing
            }}
            className={className}
            style={{ width: fullWidth ? '100%' : 'auto', ...style }}
        >
            {children}
        </motion.div>
    );
}
