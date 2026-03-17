import React from 'react';
import { Icon } from '../shared/Icon';
import type { Activity } from '../../types';

interface ActivityListProps {
    filteredActs: Activity[];
    actSearch: string;
    setActSearch: (val: string) => void;
    actFilter: string;
    setActFilter: (val: string) => void;
    groupedActs: any[]; // Or more specific if needed
    totalFiltered: number;
    actLimit: number;
    setActLimit: React.Dispatch<React.SetStateAction<number>>;
    showToast: (msg: string, type?: string) => void;
    openPanel: (name: string) => void;
}

export default function ActivityList({
    filteredActs, actSearch, setActSearch, actFilter, setActFilter,
    groupedActs, totalFiltered, actLimit, setActLimit, showToast,
    openPanel
}: ActivityListProps) {
    const ACTIVITY_FILTERS = [
        { key: 'all', label: 'Todos' }, { key: 'ingreso', label: 'Ingresos' },
        { key: 'gasto', label: 'Gastos' }, { key: 'servicios', label: 'Servicios' },
        { key: 'compras', label: 'Compras' },
    ]

    return (
        <div className="home-activity-section stagger-7">
            <div className="section-header">
                <span className="section-title">Actividad Reciente</span>
                <button className="see-all" onClick={() => openPanel('activity')}>Ver todo →</button>
            </div>
            <div className="activity-search">
                <Icon name="search" />
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
            <div className="activity-card">
                {filteredActs.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon" style={{ width: 48, height: 48 }}>
                            <Icon name="search" />
                        </div>
                        <div className="empty-state-title">Sin resultados</div>
                        <div className="empty-state-sub">Intenta con otro filtro o búsqueda</div>
                    </div>
                ) : (
                    <>
                        {groupedActs.map((item, idx) => {
                            if (item.type === 'label') {
                                return <div key={`label-${idx}`} className="activity-group-label">{item.label}</div>
                            }
                            const a = item.data as Activity
                            return (
                                <div key={a.id} className="activity-item" onClick={() => showToast(`Detalle de ${a.name}`, 'info')}>
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
                            )
                        })}
                        {totalFiltered > actLimit && (
                            <button className="btn-load-more" onClick={() => setActLimit(l => l + 6)}>
                                Cargar más ({totalFiltered - actLimit} restantes)
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
