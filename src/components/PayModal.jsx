import { useState } from 'react'
import { colors } from '../design/colors'

export default function PayModal({ open, onClose, pendingPay, state, setState, showToast, showSuccess, formatMXN }) {
    const [selectedAccId, setSelectedAccId] = useState(state.accounts[0]?.id)

    const executePay = () => {
        const amtStr = pendingPay.amount.replace(/[$,]/g, '')
        const amt = parseFloat(amtStr)
        if (state.balance < amt) { showToast('⚠️ Saldo insuficiente'); return }
        const acc = state.accounts.find(a => a.id === selectedAccId)
        setState(s => ({
            ...s,
            balance: s.balance - amt,
            accounts: s.accounts.map(a => a.id === selectedAccId ? { ...a, balance: Math.max(0, a.balance - amt) } : a),
            activities: [
                { id: s.nextId, icon: pendingPay.icon, bg: colors.dark, name: pendingPay.name, meta: `Pago · ${acc?.name || ''} · Ahora`, amount: -amt, cat: 'servicios' },
                ...s.activities
            ],
            nextId: s.nextId + 1
        }))
        onClose()
        showSuccess(`¡Pago de ${pendingPay.amount} realizado!`, `Desde ${acc?.name || 'tu cuenta'}`)
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
                    <div className="pay-confirm-icon">{pendingPay.icon}</div>
                    <div className="pay-confirm-name">{pendingPay.name}</div>
                    <div className="pay-confirm-amount">{pendingPay.amount}</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Pagar con</div>
                <div className="pay-methods">
                    {state.accounts.map(a => (
                        <div key={a.id} className={`pay-method${selectedAccId === a.id ? ' selected' : ''}`} onClick={() => setSelectedAccId(a.id)}>
                            <div className="pay-method-icon">{a.icon}</div>
                            <div className="pay-method-name">{a.name.split(' ')[0]}</div>
                        </div>
                    ))}
                </div>
                <div style={{ background: 'var(--bg)', borderRadius: 12, padding: '12px 14px', margin: '12px 0', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, border: '1px solid var(--border)' }}>
                    ⚡ El monto se descontará de tu saldo disponible inmediatamente.
                </div>
                <button className="btn-confirm-pay" onClick={executePay}>Pagar Ahora</button>
            </div>
        </div>
    )
}
