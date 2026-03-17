import React, { useState } from 'react';
import { Icon } from './shared/Icon';
import { financeService } from '../services/finance.service';
import type { AppState } from '../types';

interface AddPropModalProps {
    open: boolean;
    onClose: () => void;
    state: AppState;
    showToast: (msg: string, type?: string) => void;
    showSuccess: (text: string, sub?: string) => void;
}

const PROP_ICON_NAMES = ['home', 'building', 'beach', 'castle', 'bank', 'tool']
const PROP_GRADIENTS = [
    'linear-gradient(135deg,#a7f3d0,#34d399)',
    'linear-gradient(135deg,#93c5fd,#3b82f6)',
    'linear-gradient(135deg,#fca5a5,#f87171)',
]

export default function AddPropModal({ open, onClose, state, showToast, showSuccess }: AddPropModalProps) {
    const [iconName, setIconName] = useState('home')
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [value, setValue] = useState('')
    const [type, setType] = useState('Propietario')

    const saveProperty = () => {
        if (!name || !address) return;
        const numVal = parseFloat(value) || 0;
        financeService.addProperty({
            name: name.trim(),
            address: address.trim(),
            value: numVal,
            type,
            icon: iconName,
            gradient: PROP_GRADIENTS[state.properties.length % PROP_GRADIENTS.length],
            hasWarning: false
        });
        
        onClose()
        setName(''); setAddress(''); setValue('')
        showSuccess('¡Propiedad registrada!', name.trim())
    }

    return (
        <div className={`modal-overlay${open ? ' open' : ''}`} onClick={onClose}>
            <div className="modal-sheet" onClick={e => e.stopPropagation()}>
                <div className="modal-handle-row"><div className="modal-handle" /></div>
                <div className="modal-header">
                    <div className="modal-title">Nueva Propiedad</div>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="form-group">
                    <label className="form-label">Ícono</label>
                    <div className="prop-emoji-picker">
                        {PROP_ICON_NAMES.map(n => (
                            <div key={n} className={`prop-emoji-opt${iconName === n ? ' selected' : ''}`} onClick={() => setIconName(n)} style={{ padding: 8 }}>
                                <Icon name={n} style={{ width: 24, height: 24 }} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Nombre de la propiedad</label>
                    <input className="form-input" type="text" placeholder="ej. Casa Principal" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Dirección</label>
                    <input className="form-input" type="text" placeholder="ej. Av. Reforma 123, CDMX" value={address} onChange={e => setAddress(e.target.value)} />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Valor estimado</label>
                        <input className="form-input" type="number" placeholder="0" inputMode="decimal" value={value} onChange={e => setValue(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Tipo</label>
                        <select className="form-input" value={type} onChange={e => setType(e.target.value)}>
                            <option>Propietario</option>
                            <option>Inquilino</option>
                            <option>Inversión</option>
                        </select>
                    </div>
                </div>
                <button className="btn-save" onClick={saveProperty}>Registrar Propiedad</button>
            </div>
        </div>
    )
}
