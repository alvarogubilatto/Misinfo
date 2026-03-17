import React, { useState, useRef } from 'react';
import { Icon } from './shared/Icon';
import { financeService } from '../services/finance.service';
import type { AppState } from '../types';

interface AddFundsModalProps {
    open: boolean;
    onClose: () => void;
    state: AppState;
    showToast: (msg: string, type?: string) => void;
    showSuccess: (text: string, sub?: string) => void;
    formatMXN: (n: number) => string;
}

export default function AddFundsModal({ open, onClose, state, showToast, showSuccess, formatMXN }: AddFundsModalProps) {
    const [amount, setAmount] = useState('')
    const [selectedAccId, setSelectedAccId] = useState(state.accounts[0]?.id)
    const inputRef = useRef<HTMLInputElement>(null)

    const confirmFunds = () => {
        const val = parseFloat(amount)
        if (!val || val <= 0) { showToast('Ingresa un monto válido'); return }
        const acc = state.accounts.find(a => a.id === selectedAccId)
        
        if (acc) {
            financeService.addFunds(val, acc.id);
            onClose();
        }
        setAmount('')
        onClose()
        showSuccess(`+$${formatMXN(val)} depositados`, `En ${acc?.name || 'tu cuenta'}`)
    }

    return (
        <div className={`modal-overlay${open ? ' open' : ''}`} onClick={onClose}>
            <div className="modal-sheet" onClick={e => e.stopPropagation()}>
                <div className="modal-handle-row"><div className="modal-handle" /></div>
                <div className="modal-header">
                    <div className="modal-title">Agregar Fondos</div>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>¿Cuánto deseas depositar?</div>
                <div className="amount-input-wrap">
                    <span className="amount-symbol">$</span>
                    <input ref={inputRef} className="amount-input" type="number" placeholder="0" min="0" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} />
                </div>
                <div className="quick-amounts">
                    {[500, 1000, 5000, 10000].map(v => (
                        <button key={v} className="quick-amt" onClick={() => setAmount(String(v))}>
                            ${v.toLocaleString()}
                        </button>
                    ))}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>Selecciona cuenta destino:</div>
                <div className="pay-methods">
                    {state.accounts.map(a => (
                        <div key={a.id} className={`pay-method${selectedAccId === a.id ? ' selected' : ''}`} onClick={() => setSelectedAccId(a.id)}>
                            <div className="pay-method-icon"><Icon name={a.icon} /></div>
                            <div className="pay-method-name">{a.name.split(' ')[0]}</div>
                        </div>
                    ))}
                </div>
                <button className="btn-confirm-funds" onClick={confirmFunds}>Confirmar Depósito</button>
            </div>
        </div>
    )
}
