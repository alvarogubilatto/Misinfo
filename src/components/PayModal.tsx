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
    formatMXN: (n: number) => string;
}

export default function PayModal({ open, onClose, pendingPay, state, showToast, showSuccess, formatMXN }: PayModalProps) {
    const [selectedAccId, setSelectedAccId] = useState(state.accounts[0]?.id || 0)

    if (!pendingPay) return null;

    const executePay = () => {
        const amt = pendingPay.amount
        if (state.balance < amt) { showToast('Saldo insuficiente'); return }
        const acc = state.accounts.find(a => a.id === selectedAccId)
        
        financeService.processPayment(pendingPay.name, amt, selectedAccId, 'servicios')
        
        onClose()
        showSuccess(`¡Pago de ${formatMXN(amt)} realizado!`, acc ? `Desde ${acc.name}` : 'Desde tu cuenta')
    }

    return (
        <div className={`modal-overlay${open ? ' open' : ''}`} onClick={onClose}>
            <div className="modal-sheet" onClick={e => e.stopPropagation()}>
                <div className="modal-handle-row"><div className="modal-handle" /></div>
                <div className="modal-header">
                    <div className="modal-title">Confirmar Pago</div>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="pay-confirm-detail">
                    <div className="pay-confirm-icon"><Icon name={pendingPay.icon} /></div>
                    <div className="pay-confirm-name">{pendingPay.name}</div>
                    <div className="pay-confirm-amount">{pendingPay.amount}</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Pagar con</div>
                <div className="pay-methods">
                    {state.accounts.map(a => (
                        <div key={a.id} className={`pay-method${selectedAccId === a.id ? ' selected' : ''}`} onClick={() => setSelectedAccId(a.id)}>
                            <div className="pay-method-icon"><Icon name={a.icon} /></div>
                            <div className="pay-method-name">{a.name.split(' ')[0]}</div>
                        </div>
                    ))}
                </div>
                <div style={{ background: 'var(--bg)', borderRadius: 12, padding: '12px 14px', margin: '12px 0', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, border: '1px solid var(--border)', display: 'flex', gap: 10, alignItems: 'center' }}>
                    <Icon name="servicios" style={{ width: 16, height: 16, color: 'var(--warning)', flexShrink: 0 }} />
                    <span>El monto se descontará de tu saldo disponible inmediatamente.</span>
                </div>
                <button className="btn-confirm-pay" onClick={executePay}>Pagar Ahora</button>
            </div>
        </div>
    )
}
