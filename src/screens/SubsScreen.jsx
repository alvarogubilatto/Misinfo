import { useState } from 'react'

export default function SubsScreen({ className, state, setState, showToast, showSuccess, formatMXN, openModal }) {
    const [filter, setFilter] = useState('all')
    const [showBanner, setShowBanner] = useState(true)
    const [showAlertUso, setShowAlertUso] = useState(true)

    const filtered = state.subs.filter(s => {
        if (filter === 'active') return !s.paused
        if (filter === 'paused') return s.paused
        return true
    })

    const total = state.subs.filter(s => !s.paused).reduce((a, s) => a + s.price, 0)

    const togglePause = (id) => {
        setState(s => ({
            ...s,
            subs: s.subs.map(sub => sub.id === id ? { ...sub, paused: !sub.paused } : sub)
        }))
        const sub = state.subs.find(s => s.id === id)
        showToast(sub?.paused ? `▶ ${sub.name} reactivada` : `⏸ ${sub?.name} pausada`)
    }

    const deleteSub = (id) => {
        const sub = state.subs.find(s => s.id === id)
        setState(s => ({ ...s, subs: s.subs.filter(sub => sub.id !== id) }))
        showToast(`🗑 ${sub?.name} eliminada`)
    }

    const pauseById = (id) => {
        const sub = state.subs.find(s => s.id === id)
        if (sub && !sub.paused) {
            setState(s => ({ ...s, subs: s.subs.map(sub => sub.id === id ? { ...sub, paused: true } : sub) }))
            showToast(`⏸ ${sub.name} pausada`)
            setShowAlertUso(false)
        }
    }

    const FILTERS = [
        { key: 'all', label: 'Todas' },
        { key: 'active', label: 'Activas' },
        { key: 'paused', label: 'Pausadas' },
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
                        <div className="total-badge-val">${total.toLocaleString()}</div>
                    </div>
                </div>

                {showBanner && (
                    <div className="info-banner">
                        <span style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>ℹ️</span>
                        <span>Revisamos tus suscripciones y te avisamos ante cambios de precio o poco uso.</span>
                        <button className="banner-close" onClick={() => setShowBanner(false)}>✕</button>
                    </div>
                )}

                <div className="alert-card alert-red">
                    <div className="alert-title">📈 Alerta de precio</div>
                    Spotify subió un 15% este año. Considera el plan familiar para ahorrar hasta $50 al mes.
                </div>

                {showAlertUso && (
                    <div className="alert-card alert-yellow">
                        <div className="alert-title">⚠️ Poco uso detectado</div>
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
                            <div className="empty-state-icon">{filter === 'paused' ? '⏸' : '📭'}</div>
                            <div className="empty-state-title">{filter === 'paused' ? 'Sin suscripciones pausadas' : 'Sin suscripciones'}</div>
                            <div className="empty-state-sub">{filter === 'paused' ? 'Pausa una suscripción para verla aquí' : 'Agrega tu primera suscripción'}</div>
                        </div>
                    ) : filtered.map(s => (
                        <div key={s.id} className="sub-item">
                            <div className="sub-app-icon" style={{ background: s.color }}>{s.icon}</div>
                            <div className="sub-info">
                                <div className="sub-name-row">
                                    <span className="sub-name">{s.name}</span>
                                    {s.shared && <span className="shared-badge">👥 Compartida</span>}
                                    {s.paused && <span className="paused-badge">⏸ Pausada</span>}
                                </div>
                                <div className="sub-date">{s.paused ? 'Pausada por ti' : `Próximo cobro el ${s.day}`}</div>
                                <div className="sub-actions">
                                    <button className="sub-action-btn" onClick={() => togglePause(s.id)}>
                                        {s.paused ? '▶ Reactivar' : '⏸ Pausar'}
                                    </button>
                                    <button className="sub-action-btn danger" onClick={() => deleteSub(s.id)}>🗑 Eliminar</button>
                                </div>
                            </div>
                            <div className="sub-amount">
                                <div className="sub-price" style={s.paused ? { textDecoration: 'line-through', color: 'var(--text-light)' } : {}}>
                                    ${s.price.toLocaleString()}
                                </div>
                                {s.warning && <div className="sub-warning">{s.warning}</div>}
                            </div>
                        </div>
                    ))}
                </div>

                <button className="btn-add-sub" onClick={openModal}>＋ Agregar suscripción</button>
                <div style={{ height: 28 }} />
            </div>
        </div>
    )
}
