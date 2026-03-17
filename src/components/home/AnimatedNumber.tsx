import React, { useState, useEffect, useRef } from 'react';

interface AnimatedNumberProps {
    value: number;
    prefix?: string;
    suffix?: string;
}

export default function AnimatedNumber({ value, prefix = '', suffix = '' }: AnimatedNumberProps) {
    const [display, setDisplay] = useState(0)
    const ref = useRef<number | null>(null)

    useEffect(() => {
        const end = value
        const duration = 600
        const startTime = performance.now()

        const animate = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplay(Math.floor(eased * end))
            if (progress < 1) ref.current = requestAnimationFrame(animate)
        }
        ref.current = requestAnimationFrame(animate)
        return () => {
            if (ref.current) cancelAnimationFrame(ref.current)
        }
    }, [value])

    return <>{prefix}{display.toLocaleString('es-AR')}{suffix}</>
}
