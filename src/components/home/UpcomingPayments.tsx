import React from 'react';
import { Icon } from '../shared/Icon';

interface UpcomingPaymentsProps {
    selectedVenc: string[];
    toggleVenc: (id: string) => void;
    selectedTotal: number;
    paySelected: () => void;
    handlePay: (name: string, amount: number, icon: string) => void;
    showToast: (msg: string, type?: string) => void;
    switchToSubs: () => void;
    progressW: number;
}

export default function UpcomingPayments({ 
    selectedVenc, toggleVenc, selectedTotal, paySelected, 
    handlePay, showToast, switchToSubs, progressW 
}: UpcomingPaymentsProps) {
    const clockIcon = <Icon name="clock" style={{ width: 12, height: 12 }} />
    const cardIcon = <Icon name="card" style={{ width: 16, height: 16 }} />

    const VENCIMIENTOS = [
        { id: 'abl', name: 'ABL / Inmobiliario', amount: 2400, icon: 'bank', paid: false },
        { id: 'renta', name: 'Renta Marzo', amount: 12500, icon: 'home', paid: false },
        { id: 'spotify', name: 'Spotify', amount: 179, icon: 'spotify', paid: true },
    ]

    return (
        <div className="section-wrap stagger-4">
            <div className="section-header">
                <span className="section-title">Próximos Vencimientos</span>
                <button className="see-all" onClick={switchToSubs}>Ver todo →</button>
            </div>

            {/* Main vencimiento card with checkbox */}
            <div className="venc-main">
                <div className="venc-corner-accent" />
                <div className="venc-main-body">
                    <div className="venc-top-row">
                        <div className="venc-left">
                            <div
                                className={`venc-checkbox${selectedVenc.includes('abl') ? ' checked' : ''}`}
                                onClick={(e) => { e.stopPropagation(); toggleVenc('abl') }}
                            >
                                {selectedVenc.includes('abl') && (
                                    <Icon name="check" style={{ strokeWidth: 3 }} />
                                )}
                            </div>
                            <div className="venc-icon-wrap"><Icon name="bank" /></div>
                            <div>
                                <div className="venc-name">ABL / Inmobiliario</div>
                                <div className="venc-badge">{clockIcon} Vence en 3 días</div>
                            </div>
                        </div>
                        <div className="venc-amount-box">
                            <div className="venc-amount-label">Monto</div>
                            <div className="venc-amount-val">$2,400</div>
                        </div>
                    </div>
                    <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${progressW}%`, background: 'var(--primary)' }} />
                    </div>
                    <div className="progress-labels"><span>85% del plazo</span><span>12 Mar</span></div>
                    <button className="btn-pay" onClick={() => handlePay('ABL / Inmobiliario', 2400, 'bank')}>Pagar Ahora</button>
                </div>
            </div>

            {/* Mini vencimiento cards with checkboxes */}
            <div className="mini-venc-row">
                <div className="mini-venc-card" onClick={() => toggleVenc('renta')}>
                    <div className="mini-dot-accent" style={{ background: 'var(--cat-blue)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <div
                            className={`venc-checkbox${selectedVenc.includes('renta') ? ' checked' : ''}`}
                            onClick={(e) => { e.stopPropagation(); toggleVenc('renta') }}
                        >
                            {selectedVenc.includes('renta') && (
                                <Icon name="check" style={{ strokeWidth: 3 }} />
                            )}
                        </div>
                        <div className="mini-venc-icon"><Icon name="home" /></div>
                    </div>
                    <div className="mini-name">Renta Marzo</div>
                    <div className="mini-amount">$12,500</div>
                    <div className="mini-status mini-status-pending">Vence el día 5</div>
                </div>
                <div className="mini-venc-card" onClick={() => showToast('Spotify ya fue pagado', 'success')}>
                    <div className="mini-dot-accent" style={{ background: 'var(--cat-green)' }} />
                    <div className="mini-venc-icon"><Icon name="spotify" /></div>
                    <div className="mini-name">Spotify</div>
                    <div className="mini-amount">$179</div>
                    <div className="mini-status mini-status-paid">✓ Pagado ayer</div>
                </div>
            </div>

            {/* Quick Pay bar when items selected */}
            {selectedVenc.length > 0 && selectedTotal > 0 && (
                <div className="quick-pay-bar">
                    <div className="quick-pay-total">
                        {selectedVenc.filter(id => !VENCIMIENTOS.find(v => v.id === id)?.paid).length} seleccionados · <strong>${selectedTotal.toLocaleString()}</strong>
                    </div>
                    <button className="btn-quick-pay" onClick={paySelected}>{cardIcon} Pagar</button>
                </div>
            )}
        </div>
    )
}
