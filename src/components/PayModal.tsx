import React, { useState } from 'react';
import { Icon } from './shared/Icon';
import { financeService } from '../services/finance.service';
import type { AppState } from '../types';

interface PayModalProps {
    open: boolean;
    onClose: () => void;
    pendingPay: {
        name: string;
        amount: number;
        icon: string;
    } | null;
    state: AppState;
    showToast: (msg: string, type?: string) => void;
    showSuccess: (text: string, sub?: string) => void;
    showError: (text: string, sub?: string) => void;
    formatMXN: (n: number) => string;
}

export default function PayModal({ open, onClose, pendingPay, state, showToast, showSuccess, showError, formatMXN }: PayModalProps) {
    const [selectedAccId, setSelectedAccId] = useState(state.accounts[0]?.id || 0)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    if (!pendingPay) return null;

    const executePay = () => {
        const amt = pendingPay.amount
        if (state.balance < amt) { 
            showError('Saldo insuficiente', 'Carga fondos para continuar')
            return 
        }
        const acc = state.accounts.find(a => a.id === selectedAccId)
        
        financeService.processPayment(pendingPay.name, amt, selectedAccId, 'servicios')
        
        onClose()
        showSuccess(`¡Pago de ${formatMXN(amt)} realizado!`, acc ? `Desde ${acc.name}` : 'Desde tu cuenta')
    }

    return (
        <div className={`modal-overlay${open ? ' open' : ''}`} onClick={onClose}>
            <div className="modal-sheet premium" onClick={e => e.stopPropagation()}>
                <div className="premium-modal-header">
                    <div className="premium-icon-box">
                        <Icon name={pendingPay.icon} />
                    </div>
                    <div className="premium-title">Confirmar Pago</div>
                    <div className="premium-subtitle">{pendingPay.name}</div>
                </div>

                <div className="premium-amount-section">
                    <div className="premium-amount-label">Total a pagar</div>
                    <div className="premium-amount-val">
                        <span>$</span>{pendingPay.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </div>
                </div>

                <div className="premium-details-card">
                    <div className="premium-detail-row">
                        <span className="label">Concepto</span>
                        <span className="value">{pendingPay.name}</span>
                    </div>
                    <div className="premium-detail-row">
                        <span className="label">Fecha</span>
                        <span className="value">{new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="divider" />
                    <div className="premium-detail-row">
                        <span className="label">Comisión</span>
                        <span className="value success">Bonificada</span>
                    </div>
                </div>

                <div className="premium-section-label">Selecciona Método de Pago</div>
                
                {(() => {
                    const acc = state.accounts.find(a => a.id === selectedAccId) || state.accounts[0];
                    if (!acc) return null;
                    return (
                        <>
                            <div className={`premium-pay-method${isDropdownOpen ? ' open' : ''}`} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                <div className="premium-method-icon">
                                    <Icon name={acc.icon} />
                                </div>
                                <div className="premium-method-info">
                                    <div className="premium-method-name">{acc.name}</div>
                                    <div className="premium-method-balance">Saldo disponible: {formatMXN(acc.balance)}</div>
                                </div>
                                <div className="premium-chevron" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                                    <Icon name="chevronDown" style={{ width: 16, height: 16 }} />
                                </div>
                            </div>
                            
                            <div className={`premium-dropdown-list${isDropdownOpen ? ' open' : ''}`}>
                                {state.accounts.map(a => (
                                    <div key={a.id} className={`premium-dropdown-item${selectedAccId === a.id ? ' selected' : ''}`} onClick={() => {
                                        setSelectedAccId(a.id);
                                        setIsDropdownOpen(false);
                                    }}>
                                        <div className="dot" />
                                        <div className="premium-dropdown-item-name">{a.name}</div>
                                        <div className="premium-dropdown-item-bal">{formatMXN(a.balance)}</div>
                                    </div>
                                ))}
                            </div>
                        </>
                    );
                })()}

                <button className="btn-premium-action" onClick={executePay}>
                    <div className="icon-wrap">
                        <Icon name="shieldCheck" className="icon" />
                    </div>
                    <div className="btn-text">
                        <span>Autorizar</span>
                        <span>Pago</span>
                    </div>
                </button>
            </div>
        </div>
    )
}
