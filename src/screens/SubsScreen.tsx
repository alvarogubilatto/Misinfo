import React, { useState } from 'react';
import { subsService } from '../services/subs.service';
import { Icon } from '../components/shared/Icon';
import type { AppState, Subscription } from '../types';

interface SubsScreenProps {
    className?: string;
    state: AppState;
    showToast: (msg: string, type?: string) => void;
    showSuccess: (text: string, sub?: string) => void;
    formatMXN: (n: number) => string;
    openModal: (name: string) => void;
}

export default function SubsScreen({ className, state, showToast, showSuccess, formatMXN, openModal }: SubsScreenProps) {
    const [filter, setFilter] = useState<'all' | 'active' | 'paused'>('all')
    const [showBanner, setShowBanner] = useState(true)
    const [showAlertUso, setShowAlertUso] = useState(true)
    const [confirmDelete, setConfirmDelete] = useState<Subscription | null>(null)

    const filtered = state.subs.filter(s => {
        if (filter === 'active') return !s.paused
        if (filter === 'paused') return s.paused
        return true
    })

    const total = state.subs.filter(s => !s.paused).reduce((a, s) => a + s.price, 0)

    const togglePause = (id: number) => {
        subsService.togglePause(id)
    }

    const deleteSub = (id: number) => {
        subsService.deleteSubscription(id)
        setConfirmDelete(null)
    }

    const pauseById = (id: number) => {
        subsService.togglePause(id)
        setShowAlertUso(false)
    }

    const FILTERS = [
        { key: 'all' as const, label: 'Todas' },
        { key: 'active' as const, label: 'Activas' },
        { key: 'paused' as const, label: 'Pausadas' },
    ]

    return (
        <div className={className}>
            <div className="subs-inner">
                <div className="screen-header-row">
                    <div>
                        <div className="screen-title">Suscripciones</div>
                        <div className="screen-subtitle">Tu centro de control mensual</div>
                    </div>
                    <div className="total-badge-card">
                        <div className="total-badge-label">Total Mensual</div>
                        <div className="total-badge-val">{formatMXN(total)}</div>
                    </div>
                </div>

                {showBanner && (
                    <div className="info-banner">
                        <Icon name="news" style={{ width: 18, height: 18, flexShrink: 0, marginTop: 2 }} />
                        <span>Revisamos tus suscripciones y te avisamos ante cambios de precio o poco uso.</span>
                        <button className="banner-close" onClick={() => setShowBanner(false)}>✕</button>
                    </div>
                )}

                <div className="alert-card alert-red">
                    <div className="alert-title">
                        <Icon name="ingreso" style={{ width: 16, height: 16, marginRight: 6, verticalAlign: 'middle', display: 'inline-block' }} />
                        Alerta de precio
                    </div>
                    Spotify subió un 15% este año. Considera el plan familiar para ahorrar hasta $50 al mes.
                </div>

                {showAlertUso && (
                    <div className="alert-card alert-yellow">
                        <div className="alert-title">
                            <Icon name="warning" style={{ width: 16, height: 16, marginRight: 6, verticalAlign: 'middle', display: 'inline-block' }} />
                            Poco uso detectado
                        </div>
                        Xbox Game Pass sin uso en 2 meses. Puedes pausar sin perder tu cuenta.
                        <br />
                        <button className="btn-pause" onClick={() => pauseById(6)}>Pausar suscripción</button>
                    </div>
                )}

                <div className="sub-filter-tabs">
                    {FILTERS.map(f => (
                        <button
                            key={f.key}
                            className={`sub-filter-tab${filter === f.key ? ' active' : ''}`}
                            onClick={() => setFilter(f.key)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="subs-list">
                    {filtered.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon" style={{ width: 48, height: 48 }}>
                                <Icon name={filter === 'paused' ? 'loading' : 'news'} />
                            </div>
                            <div className="empty-state-title">{filter === 'paused' ? 'Sin suscripciones pausadas' : 'Sin suscripciones'}</div>
                            <div className="empty-state-sub">{filter === 'paused' ? 'Pausa una suscripción para verla aquí' : 'Agrega tu primera suscripción'}</div>
                        </div>
                    ) : filtered.map(s => (
                        <div key={s.id} className="sub-item">
                            <div className="sub-app-icon" style={{ background: s.color }}>
                                <Icon name={s.icon} domain={s.domain} />
                            </div>
                            <div className="sub-info">
                                <div className="sub-name-row">
                                    <span className="sub-name">{s.name}</span>
                                    {s.shared && (
                                        <span className="shared-badge">
                                            <Icon name="users" style={{ width: 10, height: 10, marginRight: 4, display: 'inline-block' }} />
                                            Compartida
                                        </span>
                                    )}
                                    {s.paused && (
                                        <span className="paused-badge">
                                            <Icon name="pause" style={{ width: 10, height: 10, marginRight: 4, display: 'inline-block' }} />
                                            Pausada
                                        </span>
                                    )}
                                </div>
                                <div className="sub-date">{s.paused ? 'Pausada por ti' : `Próximo cobro el ${s.day}`}</div>
                                <div className="sub-actions">
                                    <button className="sub-action-btn" onClick={() => togglePause(s.id)}>
                                        <Icon name={s.paused ? 'plus' : 'pause'} style={{ width: 12, height: 12, marginRight: 4, display: 'inline-block' }} />
                                        {s.paused ? 'Reactivar' : 'Pausar'}
                                    </button>
                                    <button className="sub-action-btn danger" onClick={() => setConfirmDelete(s)}>
                                        <Icon name="trash" style={{ width: 12, height: 12, marginRight: 4, display: 'inline-block' }} />
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                            <div className="sub-amount">
                                <div className="sub-price" style={s.paused ? { textDecoration: 'line-through', color: 'var(--text-light)' } : {}}>
                                    {formatMXN(s.price)}
                                </div>
                                {s.warning && <div className="sub-warning">{s.warning}</div>}
                            </div>
                        </div>
                    ))}
                </div>

                <button className="btn-add-sub" onClick={() => openModal('addSub')}>
                    <Icon name="plus" style={{ width: 14, height: 14, marginRight: 6, display: 'inline-block' }} />
                    Agregar suscripción
                </button>
                <div style={{ height: 28 }} />

                {/* Confirm delete modal */}
                {confirmDelete && (
                    <div className={`confirm-overlay${confirmDelete ? ' open' : ''}`} onClick={() => setConfirmDelete(null)}>
                        <div className="confirm-card" onClick={e => e.stopPropagation()}>
                            <div className="confirm-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon name="trash" style={{ width: 48, height: 48, color: 'var(--error)' }} />
                            </div>
                            <div className="confirm-title">¿Eliminar {confirmDelete.name}?</div>
                            <div className="confirm-body">
                                Esta acción no se puede deshacer. Se eliminará la suscripción de {formatMXN(confirmDelete.price)}/mes de tu lista.
                            </div>
                            <div className="confirm-actions">
                                <button className="confirm-btn cancel" onClick={() => setConfirmDelete(null)}>Cancelar</button>
                                <button className="confirm-btn danger" onClick={() => deleteSub(confirmDelete.id)}>Sí, eliminar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
