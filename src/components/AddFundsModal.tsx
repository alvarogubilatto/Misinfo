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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
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
            <div className="modal-sheet premium" onClick={e => e.stopPropagation()}>
                <div className="premium-modal-header">
                    <div className="premium-icon-box">
                        <Icon name="bank" />
                    </div>
                    <div className="premium-title">Agregar Fondos</div>
                    <div className="premium-subtitle">Deposita dinero en tu cuenta</div>
                </div>

                <div className="premium-amount-section">
                    <div className="premium-amount-label">Monto a depositar</div>
                    <div className="premium-amount-val">
                        <span>$</span>
                        <input 
                            ref={inputRef} 
                            style={{ 
                                border: 'none', 
                                outline: 'none', 
                                background: 'none', 
                                width: '200px', 
                                textAlign: 'left',
                                color: 'inherit',
                                font: 'inherit',
                                letterSpacing: 'inherit'
                            }} 
                            type="number" 
                            placeholder="0.00" 
                            min="0" 
                            inputMode="decimal" 
                            value={amount} 
                            onChange={e => setAmount(e.target.value)} 
                        />
                    </div>
                </div>

                <div className="premium-quick-amounts">
                    {[500, 1000, 5000, 10000].map(v => (
                        <button key={v} className="btn-quick-amt" onClick={() => setAmount(String(v))}>
                            ${v.toLocaleString()}
                        </button>
                    ))}
                </div>

                <div className="premium-section-label">Selecciona destino</div>
                
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
                                    <div className="premium-method-balance">Saldo actual: {formatMXN(acc.balance)}</div>
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

                <button className="btn-premium-action" onClick={confirmFunds}>
                    <div className="icon-wrap">
                        <Icon name="plus" className="icon" />
                    </div>
                    <div className="btn-text">
                        <span>Confirmar</span>
                        <span>Depósito</span>
                    </div>
                </button>
            </div>
        </div>
    )
}
