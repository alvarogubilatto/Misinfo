import React from 'react';
import AnimatedNumber from './AnimatedNumber';
import { Icon } from '../shared/Icon';
import type { AppState } from '../../types';

interface BalanceCardProps {
    state: AppState;
    balHidden: boolean;
    setBalHidden: React.Dispatch<React.SetStateAction<boolean>>;
    diff: number;
    ingresos: number;
    gastos: number;
    subsTotal: number;
    formatMXN: (n: number) => string;
    openModal: (name: string) => void;
    openPanel: (name: string) => void;
}

export default function BalanceCard({ 
    state, balHidden, setBalHidden, diff, ingresos, gastos, subsTotal, formatMXN, openModal, openPanel 
}: BalanceCardProps) {
    const healthStatus = diff > 5000 ? 'healthy' : diff > 0 ? 'warning' : 'danger'
    const healthLabel = diff > 5000 ? 'Mes saludable' : diff > 0 ? 'Cuidado con los gastos' : 'Gastos superan ingresos'

    return (
        <div className="balance-card stagger-2">
            <div className={`health-indicator ${healthStatus}`}>{healthLabel}</div>
            <div className="balance-label">Saldo Total</div>
            <div className="balance-row">
                <div className="balance-amount">
                    ${balHidden ? '•••,•••' : <AnimatedNumber value={state.balance} />}
                    {!balHidden && <span className="balance-cents">.00</span>}
                </div>
                <button className="balance-eye-btn" onClick={() => setBalHidden(h => !h)}>
                    <Icon name={balHidden ? 'eyeOff' : 'eye'} />
                </button>
            </div>
            {!balHidden && (
                <div className={`balance-diff ${diff >= 0 ? 'pos' : 'neg'}`}>
                    {diff >= 0 ? '↑' : '↓'} Neto: ${balHidden ? '••••' : <>{diff >= 0 ? '+' : '-'}{Math.abs(diff).toLocaleString('es-AR')}</>}
                </div>
            )}
            <div className="balance-mini-stats">
                <div className="balance-stat">
                    <div className="balance-stat-label">Ingresos</div>
                    <div className="balance-stat-val pos">+${formatMXN(ingresos)}</div>
                </div>
                <div className="balance-stat">
                    <div className="balance-stat-label">Gastos</div>
                    <div className="balance-stat-val neg">-${formatMXN(gastos)}</div>
                </div>
                <div className="balance-stat">
                    <div className="balance-stat-label">Suscripciones</div>
                    <div className="balance-stat-val neg">-${subsTotal.toLocaleString()}</div>
                </div>
            </div>
            <div className="balance-actions">
                <button className="btn-add-funds" onClick={() => openModal('addFunds')}>
                    <Icon name="plus" style={{ width: 18, height: 18 }} />
                    Agregar Fondos
                </button>
                <button className="btn-accounts" onClick={() => openPanel('accounts')}>
                    <Icon name="bank" style={{ width: 16, height: 16 }} />
                    Cuentas
                </button>
            </div>
        </div>
    )
}
