import React, { useState } from 'react';
import { Icon } from '../components/shared/Icon';
import type { AppState } from '../types';

interface PropsScreenProps {
    className?: string;
    state: AppState;
    showToast: (msg: string, type?: string) => void;
    showSuccess: (text: string, sub?: string) => void;
    formatMXN: (n: number) => string;
    openAddProp: () => void;
    openServicesModal: (name: string) => void;
}

const PROP_COLORS = [
    'var(--grad-secondary)',
    'var(--grad-primary)',
    'var(--bg-grad)',
    'var(--grad-dark)',
]

export default function PropsScreen({ className, state, showToast, showSuccess, formatMXN, openAddProp, openServicesModal }: PropsScreenProps) {
    const [showTip, setShowTip] = useState(true)

    const scheduleReminder = () => {
        setShowTip(false)
        showToast('Recordatorio agendado para el 28 de feb')
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
                                <div style={{ width: 44, height: 44, color: 'white' }}><Icon name={p.icon} /></div>
                                <span className="prop-badge">{p.type}</span>
                                {p.hasWarning && (
                                    <span className="prop-warning-banner">
                                        <Icon name="warning" style={{ width: 14, height: 14, marginRight: 4, display: 'inline-block' }} />
                                        Mantenimiento pendiente
                                    </span>
                                )}
                            </div>
                            <div className="prop-body">
                                <div className="prop-top-row">
                                    <div>
                                        <div className="prop-name">{p.name}</div>
                                        <div className="prop-address" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <div style={{ width: 12, height: 12, color: 'var(--primary)' }}><Icon name="pin" /></div>
                                            {p.address}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="prop-value-label">Valor Estimado</div>
                                        <div className="prop-value">${(p.value / 1000000).toFixed(1)}M ARS</div>
                                    </div>
                                </div>
                                <div className="prop-actions" onClick={e => e.stopPropagation()}>
                                    <button className="prop-action-btn" onClick={() => showToast(`Docs de ${p.name}`)}>
                                        <div className="prop-icon-svg"><Icon name="news" /></div><span>Docs</span>
                                    </button>
                                    <button className="prop-action-btn" onClick={() => showToast('Seguro vigente')}>
                                        <div className="prop-icon-svg"><Icon name="security" /></div><span>Seguro</span>
                                    </button>
                                    <button
                                        className={`prop-action-btn${p.hasWarning ? ' active' : ''}`}
                                        onClick={() => showToast(`${p.hasWarning ? '1 tarea pendiente' : 'Sin mantenimiento'}`)}
                                    >
                                        <div className="prop-icon-svg"><Icon name="tool" /></div><span>Mant.</span>
                                    </button>
                                    <button className="prop-action-btn active" onClick={() => openServicesModal(p.name)}>
                                        <div className="prop-icon-svg"><Icon name="servicios" /></div><span>Servicios</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="add-prop-btn" onClick={openAddProp}>
                    <div style={{ width: 18, height: 18, marginRight: 8, display: 'inline-block', verticalAlign: 'middle' }}><Icon name="plus" /></div>
                    Registrar nueva propiedad
                </button>

                {showTip && (
                    <div className="fiscal-tip">
                        <div style={{ width: 24, height: 24, flexShrink: 0, marginTop: 2, color: 'var(--primary)' }}><Icon name="bulb" /></div>
                        <div>
                            <div className="fiscal-tip-title">Tip Fiscal</div>
                            <div className="fiscal-tip-text">
                                El año pasado pagaste $5,400 de ABL. Pagarlo anticipado puede ayudarte a obtener un descuento del 10%.
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
