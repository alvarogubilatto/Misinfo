import React, { useState } from 'react';
import { Icon } from './shared/Icon';
import type { AppState } from '../types';

interface ActivityPanelProps {
    open: boolean;
    onClose: () => void;
    state: AppState;
    formatMXN: (n: number) => string;
}

export default function ActivityPanel({ open, onClose, state, formatMXN }: ActivityPanelProps) {
    const [actSearch, setActSearch] = useState('')
    const [actFilter, setActFilter] = useState('all')

    const ACTIVITY_FILTERS = [
        { key: 'all', label: 'Todos' }, { key: 'ingreso', label: 'Ingresos' },
        { key: 'gasto', label: 'Gastos' }, { key: 'servicios', label: 'Servicios' },
        { key: 'compras', label: 'Compras' },
    ]

    const filteredActs = state.activities
        .filter(a => actFilter === 'all' || a.cat === actFilter)
        .filter(a => !actSearch || a.name.toLowerCase().includes(actSearch.toLowerCase()) || a.meta.toLowerCase().includes(actSearch.toLowerCase()))

    return (
        <div className={`side-panel-overlay${open ? ' open' : ''}`} onClick={onClose}>
            <div className="side-panel" onClick={e => e.stopPropagation()}>
                <div className="side-panel-header">
                    <div className="side-panel-title">Historial completo</div>
                    <button className="panel-close" onClick={onClose}>✕</button>
                </div>

                <div className="activity-search" style={{ marginTop: '16px' }}>
                    <div style={{ width: 18, height: 18, color: 'var(--text-muted)', position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
                        <Icon name="search" />
                    </div>
                    <input type="text" placeholder="Buscar transacción..." value={actSearch} onChange={e => setActSearch(e.target.value)} />
                </div>

                <div className="activity-filters">
                    {ACTIVITY_FILTERS.map(f => (
                        <button
                            key={f.key}
                            className={`act-filter-btn${actFilter === f.key ? ' active' : ''}`}
                            onClick={() => setActFilter(f.key)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="activity-card" style={{ marginTop: '12px' }}>
                    {filteredActs.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon" style={{ width: 48, height: 48 }}>
                                <Icon name="search" style={{ color: 'var(--border)' }} />
                            </div>
                            <div className="empty-state-title">Sin resultados</div>
                            <div className="empty-state-sub">Intenta con otro filtro o búsqueda</div>
                        </div>
                    ) : filteredActs.map(a => (
                        <div key={a.id} className="activity-item">
                            <div className="activity-icon" style={{ background: a.bg }}>
                                <Icon name={a.icon} />
                            </div>
                            <div className="activity-info">
                                <div className="activity-name">{a.name}</div>
                                <div className="activity-meta">{a.meta}</div>
                            </div>
                            <div className={`activity-amount${a.amount > 0 ? ' amount-pos' : ''}`}>
                                {a.amount > 0 ? '+' : ''}${Math.abs(a.amount).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
