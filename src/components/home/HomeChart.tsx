import React from 'react';
import BarChart from './BarChart';
import { chartData } from '../../data';

interface HomeChartProps {
    chartPeriod: 'week' | 'month' | 'year';
    setChartPeriod: (period: 'week' | 'month' | 'year') => void;
}

export default function HomeChart({ chartPeriod, setChartPeriod }: HomeChartProps) {
    const periodData = chartData[chartPeriod] as { subtitle: string };
    
    return (
        <div className="chart-card stagger-5">
            <div className="chart-legend chart-title-legend">
                <div className="legend-item"><span className="legend-dot" style={{ background: 'var(--cat-green)' }} /><span className="legend-text">Ingreso</span></div>
                <div className="legend-item"><span className="legend-dot" style={{ background: 'var(--primary)' }} /><span className="legend-text">Gastos</span></div>
            </div>
            <div className="chart-sub">{periodData.subtitle}</div>
            <div className="chart-tabs">
                {(['week', 'month', 'year'] as const).map((p, i) => (
                    <button
                        key={p}
                        className={`chart-tab${chartPeriod === p ? ' active' : ''}`}
                        onClick={() => setChartPeriod(p)}
                    >
                        {['Semana', 'Mes', 'Año'][i]}
                    </button>
                ))}
            </div>
            <BarChart period={chartPeriod} />
        </div>
    )
}
