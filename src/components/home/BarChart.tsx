import React, { useState, useRef } from 'react';
import { chartData } from '../../data';

interface BarChartProps {
    period: 'week' | 'month' | 'year';
}

export default function BarChart({ period }: BarChartProps) {
    const { data, labels } = chartData[period] as { data: any[], labels: string[] }
    const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 })
    const chartRef = useRef<HTMLDivElement>(null)

    return (
        <div style={{ position: 'relative' }}>
            <div
                className={`bar-tooltip${tooltip.show ? ' show' : ''}`}
                style={{ 
                    left: tooltip.x, 
                    top: tooltip.y, 
                    transform: 'translateX(-50%)', 
                    position: 'absolute' 
                } as React.CSSProperties}
            >
                {tooltip.text}
            </div>
            {/* SVG Gradients for Bars */}
            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                    <linearGradient id="grad-in" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--primary-light)" />
                        <stop offset="100%" stopColor="var(--primary)" />
                    </linearGradient>
                    <linearGradient id="grad-out" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ff9a44" />
                        <stop offset="100%" stopColor="var(--orange)" />
                    </linearGradient>
                </defs>
            </svg>

            <div className="bar-chart" ref={chartRef}>
                {data.map((d: any, i: number) => (
                    <div key={i} className="bar-group">
                        {(['in', 'out'] as const).map(type => (
                            <div
                                key={type}
                                className={`bar bar-${type}`}
                                style={{ 
                                    height: `${d[type]}%`, 
                                    animationDelay: `${i * 0.05}s`,
                                    background: type === 'in' ? 'url(#grad-in)' : 'url(#grad-out)',
                                    backgroundColor: type === 'in' ? 'var(--primary)' : 'var(--orange)' // Fallback
                                }}
                                onMouseEnter={(e: React.MouseEvent) => {
                                    const label = type === 'in' ? (d.li || 'Ingreso') : (d.lo || 'Gasto')
                                    const rect = chartRef.current?.getBoundingClientRect()
                                    if (rect) {
                                        setTooltip({ 
                                            show: true, 
                                            text: label, 
                                            x: e.clientX - rect.left, 
                                            y: e.clientY - rect.top - 40 
                                        })
                                    }
                                }}
                                onMouseLeave={() => setTooltip(t => ({ ...t, show: false }))}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className="chart-labels">
                {labels.map((l: string, i: number) => <div key={i} className="chart-label">{l}</div>)}
            </div>
        </div>
    )
}
