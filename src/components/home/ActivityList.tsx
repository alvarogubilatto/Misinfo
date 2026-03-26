import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../shared/Icon';
import { containerVariants, itemVariants } from '../../utils/animations';
import type { Activity } from '../../types';

interface ActivityListProps {
    filteredActs: Activity[];
    actSearch: string;
    setActSearch: (val: string) => void;
    actFilter: string;
    setActFilter: (val: string) => void;
    groupedActs: any[];
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
        <div className="home-activity-section">
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
            
            <motion.div 
                className="activity-card"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
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
                        <AnimatePresence mode="popLayout">
                            {groupedActs.map((item, idx) => {
                                if (item.type === 'label') {
                                    return (
                                        <motion.div 
                                            key={`label-${idx}`} 
                                            variants={itemVariants}
                                            className="activity-group-label"
                                        >
                                            {item.label}
                                        </motion.div>
                                    )
                                }
                                const a = item.data as Activity
                                return (
                                    <motion.div 
                                        key={a.id} 
                                        variants={itemVariants}
                                        layout
                                        className="activity-item" 
                                        onClick={() => showToast(`Detalle de ${a.name}`, 'info')}
                                    >
                                        <div className="activity-icon" style={{ background: a.bg }}>
                                            <Icon name={a.icon} domain={a.domain} />
                                        </div>
                                        <div className="activity-info">
                                            <div className="activity-name">{a.name}</div>
                                            <div className="activity-meta">{a.meta}</div>
                                        </div>
                                        <div className={`activity-amount${a.amount > 0 ? ' amount-pos' : ''}`}>
                                            {a.amount > 0 ? '+' : ''}${Math.abs(a.amount).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                        {totalFiltered > actLimit && (
                            <motion.button 
                                variants={itemVariants}
                                className="btn-load-more" 
                                onClick={() => setActLimit(l => l + 6)}
                            >
                                Cargar más ({totalFiltered - actLimit} restantes)
                            </motion.button>
                        )}
                    </>
                )}
            </motion.div>
        </div>
    )
}

