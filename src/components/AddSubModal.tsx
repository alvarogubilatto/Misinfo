import React, { useState } from 'react';
import { Icon } from './shared/Icon';
import { subsService } from '../services/subs.service';
import type { AppState } from '../types';

interface AddSubModalProps {
    open: boolean;
    onClose: () => void;
    state: AppState;
    showToast: (msg: string, type?: string) => void;
    showSuccess: (text: string, sub?: string) => void;
}

const ICON_NAMES = ['netflix', 'spotify', 'amazon', 'adobe', 'icloud', 'xbox', 'news', 'fitness', 'security', 'tool']
const COLORS = [
    { val: 'var(--cat-bg-red)', style: { background: 'var(--cat-bg-red)', borderColor: 'var(--cat-red)' } },
    { val: 'var(--cat-bg-green)', style: { background: 'var(--cat-bg-green)', borderColor: 'var(--cat-green)' } },
    { val: 'var(--cat-bg-blue)', style: { background: 'var(--cat-bg-blue)', borderColor: 'var(--cat-blue)' } },
    { val: 'var(--cat-bg-purple)', style: { background: 'var(--cat-bg-purple)', borderColor: 'var(--cat-purple)' } },
    { val: 'var(--cat-bg-cyan)', style: { background: 'var(--cat-bg-cyan)', borderColor: 'var(--cat-cyan)' } },
    { val: 'var(--cat-bg-yellow)', style: { background: 'var(--cat-bg-yellow)', borderColor: 'var(--cat-yellow)' } },
]

export default function AddSubModal({ open, onClose, state, showToast, showSuccess }: AddSubModalProps) {
    const [iconName, setIconName] = useState('netflix')
    const [color, setColor] = useState('var(--cat-bg-red)')
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [day, setDay] = useState('')

    const saveSub = () => {
        const trimName = name.trim()
        const parsedPrice = parseFloat(price)
        const parsedDay = parseInt(day) || 15
        if (!trimName) { showToast('Ingresa un nombre'); return }
        if (!parsedPrice || parsedPrice <= 0) { showToast('Ingresa un precio válido'); return }
        
        subsService.addSubscription({
            icon: iconName,
            color,
            name: trimName,
            day: parsedDay,
            price: parsedPrice
        })

        onClose()
        setName(''); setPrice(''); setDay('')
        showSuccess('¡Suscripción agregada!', `${trimName}`)
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
                        {ICON_NAMES.map(n => (
                            <div key={n} className={`emoji-opt${iconName === n ? ' selected' : ''}`} onClick={() => setIconName(n)} style={{ padding: 8 }}>
                                <Icon name={n} style={{ width: 20, height: 20 }} />
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
                                style={c.style as React.CSSProperties}
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
