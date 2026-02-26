import { useState } from 'react'

const EMOJIS = ['📺', '🎵', '📦', '🎨', '☁️', '🎮', '📰', '💪', '🛡️', '🔧']
const COLORS = [
    { val: '#fce4e4', style: { background: '#fce4e4', borderColor: '#fce4e4' } },
    { val: '#e8f5e9', style: { background: '#e8f5e9', borderColor: '#e8f5e9' } },
    { val: '#e3f2fd', style: { background: '#e3f2fd', borderColor: '#e3f2fd' } },
    { val: '#f3e5f5', style: { background: '#f3e5f5', borderColor: '#f3e5f5' } },
    { val: '#e0f7fa', style: { background: '#e0f7fa', borderColor: '#e0f7fa' } },
    { val: '#fff8e1', style: { background: '#fff8e1', borderColor: '#fff8e1' } },
]

export default function AddSubModal({ open, onClose, state, setState, showToast, showSuccess }) {
    const [emoji, setEmoji] = useState('📺')
    const [color, setColor] = useState('#fce4e4')
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [day, setDay] = useState('')

    const saveSub = () => {
        const trimName = name.trim()
        const parsedPrice = parseFloat(price)
        const parsedDay = parseInt(day) || 15
        if (!trimName) { showToast('⚠️ Ingresa un nombre'); return }
        if (!parsedPrice || parsedPrice <= 0) { showToast('⚠️ Ingresa un precio válido'); return }
        setState(s => ({
            ...s,
            subs: [...s.subs, { id: s.nextId, icon: emoji, color, name: trimName, day: parsedDay, price: parsedPrice, paused: false }],
            nextId: s.nextId + 1
        }))
        onClose()
        setName(''); setPrice(''); setDay('')
        showSuccess('¡Suscripción agregada!', `${emoji} ${trimName}`)
    }

    return (
        <div className={`modal-overlay${open ? ' open' : ''}`} onClick={onClose}>
            <div className="modal-sheet" onClick={e => e.stopPropagation()}>
                <div className="modal-handle-row"><div className="modal-handle" /></div>
                <div className="modal-header">
                    <div className="modal-title">Nueva Suscripción</div>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="form-group">
                    <label className="form-label">Ícono</label>
                    <div className="emoji-picker">
                        {EMOJIS.map(e => (
                            <div key={e} className={`emoji-opt${emoji === e ? ' selected' : ''}`} onClick={() => setEmoji(e)}>
                                {e}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input className="form-input" type="text" placeholder="ej. Netflix, Adobe CC..." value={name} onChange={e => setName(e.target.value)} />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Precio mensual</label>
                        <input className="form-input" type="number" placeholder="0" inputMode="decimal" value={price} onChange={e => setPrice(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Día de cobro</label>
                        <input className="form-input" type="number" placeholder="15" min="1" max="31" inputMode="numeric" value={day} onChange={e => setDay(e.target.value)} />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Color de fondo</label>
                    <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                        {COLORS.map(c => (
                            <div
                                key={c.val}
                                className={`emoji-opt${color === c.val ? ' selected' : ''}`}
                                style={c.style}
                                onClick={() => setColor(c.val)}
                            />
                        ))}
                    </div>
                </div>

                <button className="btn-save" onClick={saveSub}>Agregar Suscripción</button>
            </div>
        </div>
    )
}
