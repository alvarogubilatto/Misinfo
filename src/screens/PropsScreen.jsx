import { useState } from 'react'

const PROP_COLORS = [
    'linear-gradient(135deg,#ddd6fe,#a78bfa)',
    'linear-gradient(135deg,#fde68a,#fbbf24)',
    'linear-gradient(135deg,#a7f3d0,#34d399)',
    'linear-gradient(135deg,#fca5a5,#f87171)',
    'linear-gradient(135deg,#93c5fd,#3b82f6)',
]

export default function PropsScreen({ className, state, setState, showToast, showSuccess, formatMXN, openAddProp, openServicesModal }) {
    const [showTip, setShowTip] = useState(true)

    const scheduleReminder = () => {
        setShowTip(false)
        showToast('📅 Recordatorio agendado para el 28 de feb')
    }

    return (
        <div className={className}>
            <div className="props-inner">
                <div>
                    <div className="screen-title">Mis Propiedades</div>
                    <div className="screen-subtitle">Gestiona impuestos, documentos y mantenimiento</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {state.properties.map((p, i) => (
                        <div key={p.id} className="prop-card" onClick={() => openServicesModal(p.name)}>
                            <div className="prop-image-wrap" style={{ background: p.gradient || PROP_COLORS[i % PROP_COLORS.length] }}>
                                <span style={{ fontSize: 44 }}>{p.icon}</span>
                                <span className="prop-badge">{p.type}</span>
                                {p.hasWarning && <span className="prop-warning-banner">⚠️ Mantenimiento pendiente</span>}
                            </div>
                            <div className="prop-body">
                                <div className="prop-top-row">
                                    <div>
                                        <div className="prop-name">{p.name}</div>
                                        <div className="prop-address">📍 {p.address}</div>
                                    </div>
                                    <div>
                                        <div className="prop-value-label">Valor Estimado</div>
                                        <div className="prop-value">${(p.value / 1000000).toFixed(1)}M MXN</div>
                                    </div>
                                </div>
                                <div className="prop-actions" onClick={e => e.stopPropagation()}>
                                    <button className="prop-action-btn" onClick={() => showToast(`📄 Docs de ${p.name}`)}>
                                        📄<span>Docs</span>
                                    </button>
                                    <button className="prop-action-btn" onClick={() => showToast('🛡️ Seguro vigente')}>
                                        🛡️<span>Seguro</span>
                                    </button>
                                    <button
                                        className={`prop-action-btn${p.hasWarning ? ' active' : ''}`}
                                        onClick={() => showToast(`🔧 ${p.hasWarning ? '1 tarea pendiente' : 'Sin mantenimiento'}`)}
                                    >
                                        🔧<span>Mant.</span>
                                    </button>
                                    <button className="prop-action-btn active" onClick={() => openServicesModal(p.name)}>
                                        ⚡<span>Servicios</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="add-prop-btn" onClick={openAddProp}>＋ Registrar nueva propiedad</button>

                {showTip && (
                    <div className="fiscal-tip">
                        <div style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>💡</div>
                        <div>
                            <div className="fiscal-tip-title">Tip Fiscal</div>
                            <div className="fiscal-tip-text">
                                El año pasado pagaste $5,400 de predial. Pagar anticipado puede ayudarte a deducirlo mejor este año.
                            </div>
                            <div className="fiscal-tip-actions">
                                <button className="btn-tip-yes" onClick={scheduleReminder}>Sí, agendar recordatorio</button>
                                <button className="btn-tip-no" onClick={() => setShowTip(false)}>Ahora no</button>
                            </div>
                        </div>
                    </div>
                )}

                <div style={{ height: 28 }} />
            </div>
        </div>
    )
}
