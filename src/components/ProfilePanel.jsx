import { useState } from 'react'

export default function ProfilePanel({ open, onClose, state, setState, showToast, showSuccess, onLogout }) {
    const [name, setName] = useState(state.userName)
    const [activeSection, setActiveSection] = useState('profile') // 'profile' | 'settings'

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
                    <div className="side-panel-title">
                        {activeSection === 'profile' ? 'Mi Perfil' : 'Opciones'}
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {/* Settings gear toggle */}
                        <button
                            className="panel-close"
                            title="Opciones"
                            style={{
                                background: activeSection === 'settings' ? 'var(--purple-ultra)' : 'var(--border)',
                                color: activeSection === 'settings' ? 'var(--purple)' : 'var(--text-muted)',
                                fontSize: 20,
                                transition: 'all 0.2s'
                            }}
                            onClick={() => setActiveSection(s => s === 'settings' ? 'profile' : 'settings')}
                        >
                            ⚙️
                        </button>
                        <button className="panel-close" onClick={onClose}>✕</button>
                    </div>
                </div>

                {activeSection === 'profile' && (
                    <>
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
                                <option>ARS — Peso Argentino</option>
                                <option>USD — Dólar</option>
                                <option>EUR — Euro</option>
                            </select>
                        </div>
                        {/* Dark mode toggle */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg)', borderRadius: 16, padding: '14px 16px', border: '1px solid var(--border)' }}>
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
                                marginTop: '12px',
                                width: '100%',
                                padding: '16px',
                                borderRadius: '16px',
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
                    </>
                )}

                {activeSection === 'settings' && (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {[
                                { icon: '🔔', label: 'Notificaciones', sub: 'Alertas de vencimientos y pagos', action: () => showToast('🔔 Preferencias de notificaciones próximamente') },
                                { icon: '🔒', label: 'Seguridad', sub: 'PIN, biometría y contraseña', action: () => showToast('🔒 Seguridad próximamente') },
                                { icon: '💾', label: 'Exportar datos', sub: 'Descargá tus datos en CSV o PDF', action: () => showToast('💾 Exportación próximamente') },
                                { icon: '🗑️', label: 'Limpiar caché', sub: 'Eliminar datos temporales', action: () => showToast('🗑️ Caché limpiada') },
                                { icon: '📋', label: 'Términos y privacidad', sub: 'Política de privacidad y términos', action: () => showToast('📋 Términos próximamente') },
                                { icon: 'ℹ️', label: 'Versión de la app', sub: 'MisInfo v1.0.0 — Argentina 🇦🇷', action: () => showToast('✅ Estás en la última versión') },
                            ].map((item, i) => (
                                <button
                                    key={i}
                                    onClick={item.action}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 14,
                                        background: 'var(--bg)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 16,
                                        padding: '14px 16px',
                                        cursor: 'pointer',
                                        width: '100%',
                                        textAlign: 'left',
                                        transition: 'all 0.15s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--purple)'}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                                >
                                    <div style={{ fontSize: 22, flexShrink: 0, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--card)', borderRadius: 10 }}>
                                        {item.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{item.label}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{item.sub}</div>
                                    </div>
                                    <div style={{ color: 'var(--text-light)', fontSize: 18 }}>›</div>
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
