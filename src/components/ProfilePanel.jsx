import { useState } from 'react'

export default function ProfilePanel({ open, onClose, state, setState, showToast, showSuccess, onLogout }) {
    const [name, setName] = useState(state.userName)

    const saveProfile = () => {
        const trimmed = name.trim() || 'Alex'
        setState(s => ({ ...s, userName: trimmed }))
        onClose()
        showSuccess('Perfil actualizado', 'Tus cambios fueron guardados')
    }

    const toggleDarkMode = () => {
        setState(s => ({ ...s, darkMode: !s.darkMode }))
    }

    return (
        <div className={`side-panel-overlay${open ? ' open' : ''}`} onClick={onClose}>
            <div className="side-panel" onClick={e => e.stopPropagation()}>
                <div className="side-panel-header">
                    <div className="side-panel-title">Mi Perfil</div>
                    <button className="panel-close" onClick={onClose}>✕</button>
                </div>
                <div className="profile-avatar-section">
                    <div className="profile-avatar-big">{(state.userName || 'A')[0].toUpperCase()}</div>
                    <button className="btn-change-photo" onClick={() => showToast('📷 Cambiar foto próximamente')}>
                        Cambiar foto
                    </button>
                </div>
                <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input className="form-input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" />
                </div>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" defaultValue="alex@email.com" placeholder="tu@email.com" />
                </div>
                <div className="form-group">
                    <label className="form-label">Moneda</label>
                    <select className="form-input">
                        <option>MXN — Peso Mexicano</option>
                        <option>USD — Dólar</option>
                        <option>ARS — Peso Argentino</option>
                    </select>
                </div>
                {/* Dark mode toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg)', borderRadius: 12, padding: '14px 16px', border: '1px solid var(--border)' }}>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>🌙 Modo oscuro</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Cambia el tema de la app</div>
                    </div>
                    <div
                        onClick={toggleDarkMode}
                        style={{ width: 44, height: 24, borderRadius: 99, background: state.darkMode ? '#6c35de' : 'var(--border)', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}
                    >
                        <div style={{ position: 'absolute', top: 2, left: 2, width: 20, height: 20, borderRadius: '50%', background: 'white', transition: 'transform 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', transform: state.darkMode ? 'translateX(20px)' : 'translateX(0)' }} />
                    </div>
                </div>
                <button className="btn-save" onClick={saveProfile} style={{ marginTop: '24px' }}>Guardar cambios</button>
                <button
                    onClick={onLogout}
                    style={{
                        marginTop: '16px',
                        width: '100%',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid #ff4d4f',
                        color: '#ff4d4f',
                        background: 'transparent',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                >
                    Cerrar sesión
                </button>
            </div>
        </div>
    )
}
