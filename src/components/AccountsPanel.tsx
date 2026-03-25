import React from 'react';
import { Icon } from './shared/Icon';
import type { AppState } from '../types';

interface AccountsPanelProps {
    open: boolean;
    onClose: () => void;
    state: AppState;
    formatMXN: (n: number) => string;
    showToast: (msg: string, type?: string) => void;
}

export default function AccountsPanel({ open, onClose, state, formatMXN, showToast }: AccountsPanelProps) {
    const total = state.accounts.reduce((a, b) => a + b.balance, 0)

    return (
        <div className={`side-panel-overlay${open ? ' open' : ''}`} onClick={onClose}>
            <div className="side-panel" onClick={e => e.stopPropagation()}>
                <div className="side-panel-header">
                    <div className="side-panel-title">Mis Cuentas</div>
                    <button className="panel-close" onClick={onClose}>✕</button>
                </div>
                <div className="accounts-total">
                    <div>
                        <div className="accounts-total-label">Saldo Total</div>
                        <div className="accounts-total-val">${formatMXN(total)}</div>
                    </div>
                    <div style={{ width: 28, height: 28, color: 'var(--primary)' }}>
                        <Icon name="bank" />
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {state.accounts.map(a => (
                        <div key={a.id} className="account-card">
                            <div className="account-icon" style={{ background: a.color }}>
                                <Icon name={a.icon} domain={a.domain} />
                            </div>
                            <div>
                                <div className="account-name">{a.name}</div>
                                <div className="account-num">{a.num}</div>
                            </div>
                            <div className="account-bal">
                                <div>${formatMXN(a.balance)}</div>
                                <div className="account-bal-sub">disponible</div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="btn-connect-account" onClick={() => showToast('🔗 Conectar nueva cuenta próximamente')}>
                    <Icon name="plus" style={{ width: 14, height: 14, marginRight: 6 }} /> Conectar nueva cuenta
                </button>
            </div>
        </div>
    )
}
