import React, { useState } from 'react';
import { Icon } from '../shared/Icon';
import type { Activity } from '../../types';

interface WeeklyDigestProps {
    activities: Activity[];
    formatMXN: (n: number) => string;
}

export default function WeeklyDigest({ activities, formatMXN }: WeeklyDigestProps) {
    const [open, setOpen] = useState(true)

    const gastosArr = activities.filter(a => a.amount < 0)
    const gastos = gastosArr.reduce((s, a) => s + Math.abs(a.amount), 0)
    const maxGasto = [...gastosArr].sort((a, b) => a.amount - b.amount)[0]
    const ingresosCount = activities.filter(a => a.amount > 0).length
    const gastosCount = gastosArr.length

    return (
        <div className="weekly-digest">
            <div className="weekly-digest-header" onClick={() => setOpen(!open)}>
                <div className="weekly-digest-title-row">
                    <Icon name="reports" style={{ width: 20, height: 20 }} />
                    <span className="weekly-digest-title">Tu semana en números</span>
                    <span className="weekly-digest-badge">Nuevo</span>
                </div>
                <span className={`weekly-digest-chevron${open ? ' open' : ''}`}>
                    <Icon name="chevronDown" style={{ width: 14, height: 14 }} />
                </span>
            </div>
            {open && (
                <div className="weekly-digest-body">
                    <div className="digest-item">
                        <div className="digest-item-icon" style={{ background: 'var(--cat-green)' }}>
                            <Icon name="trendingUp" style={{ width: 16, height: 16 }} />
                        </div>
                        <div className="digest-item-text">
                            Gastaste <strong>${formatMXN(gastos)}</strong> esta semana en {gastosCount} transacciones
                        </div>
                    </div>
                    {maxGasto && (
                        <div className="digest-item">
                            <div className="digest-item-icon" style={{ background: 'var(--cat-yellow)' }}>
                                <Icon name="tag" style={{ width: 16, height: 16 }} />
                            </div>
                            <div className="digest-item-text">
                                Tu mayor gasto fue <strong>{maxGasto.name}</strong> (${Math.abs(maxGasto.amount).toLocaleString('es-AR')})
                            </div>
                        </div>
                    )}
                    <div className="digest-item">
                        <div className="digest-item-icon" style={{ background: 'var(--cat-blue)' }}>
                            <Icon name="coin" style={{ width: 16, height: 16 }} />
                        </div>
                        <div className="digest-item-text">
                            Recibiste <strong>{ingresosCount} ingreso{ingresosCount !== 1 ? 's' : ''}</strong> esta semana
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
