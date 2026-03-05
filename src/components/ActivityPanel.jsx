import { useState } from 'react'

export default function ActivityPanel({ open, onClose, state, formatMXN }) {
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
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
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
                            <div className="empty-state-icon">🔍</div>
                            <div className="empty-state-title">Sin resultados</div>
                            <div className="empty-state-sub">Intenta con otro filtro o búsqueda</div>
                        </div>
                    ) : filteredActs.map(a => (
                        <div key={a.id} className="activity-item">
                            <div className="activity-icon" style={{ background: a.bg }}>{a.icon}</div>
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
