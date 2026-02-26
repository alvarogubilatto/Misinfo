import { useState, useRef } from 'react'

export default function AddFundsModal({ open, onClose, state, setState, showToast, showSuccess, formatMXN }) {
    const [amount, setAmount] = useState('')
    const [selectedAccId, setSelectedAccId] = useState(state.accounts[0]?.id)
    const inputRef = useRef(null)

    const confirmFunds = () => {
        const val = parseFloat(amount)
        if (!val || val <= 0) { showToast('⚠️ Ingresa un monto válido'); return }
        const acc = state.accounts.find(a => a.id === selectedAccId)
        setState(s => ({
            ...s,
            balance: s.balance + val,
            accounts: s.accounts.map(a => a.id === selectedAccId ? { ...a, balance: a.balance + val } : a),
            activities: [
                { id: s.nextId, icon: '💰', bg: '#00875a', name: 'Depósito Manual', meta: `Ingreso · ${acc?.name || ''} · Ahora`, amount: val, cat: 'ingreso' },
                ...s.activities
            ],
            nextId: s.nextId + 1
        }))
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
                            <div className="pay-method-icon">{a.icon}</div>
                            <div className="pay-method-name">{a.name.split(' ')[0]}</div>
                        </div>
                    ))}
                </div>
                <button className="btn-confirm-funds" onClick={confirmFunds}>Confirmar Depósito</button>
            </div>
        </div>
    )
}
