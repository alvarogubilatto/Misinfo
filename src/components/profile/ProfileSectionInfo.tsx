import React, { useState, useEffect } from 'react';
import { Icon } from '../shared/Icon';
import type { AppState } from '../../types';

interface ProfileSectionInfoProps {
    state: AppState;
    setState: any; // Zustand setState type
    showToast: (msg: string, type?: string) => void;
    showSuccess: (text: string, sub?: string) => void;
    onSave: (name: string) => void;
    onLogoutRequest: () => void;
}

export default function ProfileSectionInfo({ state, setState, showToast, showSuccess, onSave, onLogoutRequest }: ProfileSectionInfoProps) {
    const [localName, setLocalName] = useState(state.userName)

    useEffect(() => {
        setLocalName(state.userName)
    }, [state.userName])

    const handleSave = () => {
        onSave(localName)
    }

    const toggleDarkMode = () => {
        setState((s: AppState) => ({ ...s, darkMode: !s.darkMode }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 2 * 1024 * 1024) {
                showToast('La foto debe ser menor a 2MB', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setState((s: AppState) => ({ ...s, avatarUrl: event.target?.result as string }));
                    showSuccess('Foto actualizada', 'Tu foto de perfil fue actualizada');
                }
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <div className="panel-section-enter">
            <div className="profile-avatar-section">
                <div className="profile-avatar-big">
                    {state.avatarUrl ? (
                        <img src={state.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        (state.userName || 'A')[0].toUpperCase()
                    )}
                </div>
                <label className="btn-change-photo" style={{ cursor: 'pointer', display: 'inline-block' }}>
                    Cambiar foto
                    <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
                </label>
            </div>
            <div className="form-group">
                <label className="form-label">Nombre</label>
                <input 
                    className="form-input" 
                    type="text" 
                    value={localName} 
                    onChange={e => setLocalName(e.target.value)} 
                    placeholder="Tu nombre" 
                />
            </div>
            <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" defaultValue="admin@voxu.com" placeholder="tu@email.com" />
            </div>
            <div className="form-group">
                <label className="form-label">Moneda</label>
                <select className="form-input" defaultValue="ARS">
                    <option value="ARS">ARS — Peso Argentino</option>
                    <option value="USD">USD — Dólar</option>
                    <option value="EUR">EUR — Euro</option>
                </select>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg)', borderRadius: 16, padding: '14px 16px', border: '1px solid var(--border)' }}>
                <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Icon name="moon" style={{ width: 18, height: 18 }} />
                        Modo oscuro
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Cambia el tema de la app</div>
                </div>
                <div
                    onClick={toggleDarkMode}
                    style={{ 
                        width: 44, height: 24, borderRadius: 99, 
                        background: state.darkMode ? 'var(--primary)' : 'var(--border)', 
                        position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 
                    } as React.CSSProperties}
                >
                    <div style={{ 
                        position: 'absolute', top: 2, left: 2, width: 20, height: 20, borderRadius: '50%', 
                        background: 'white', transition: 'transform 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', 
                        transform: state.darkMode ? 'translateX(20px)' : 'translateX(0)' 
                    } as React.CSSProperties} />
                </div>
            </div>

            <button className="btn-save" onClick={handleSave} style={{ marginTop: '24px' }}>Guardar cambios</button>
            <button
                onClick={onLogoutRequest}
                style={{
                    marginTop: '12px',
                    width: '100%',
                    padding: '16px',
                    borderRadius: '16px',
                    border: '1px solid var(--red)',
                    color: 'var(--red)',
                    background: 'transparent',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                } as React.CSSProperties}
            >
                Cerrar sesión
            </button>
        </div>
    )
}
