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
                        {activeSection === 'profile' ? 'Mi Perfil' :
                            activeSection === 'settings' ? 'Opciones' :
                                activeSection === 'notifications' ? 'Notificaciones' :
                                    activeSection === 'security' ? 'Seguridad' :
                                        activeSection === 'export' ? 'Exportar datos' :
                                            activeSection === 'terms' ? 'Términos y privacidad' : 'Opciones'}
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {/* Settings gear toggle */}
                        <button
                            className="panel-close"
                            title="Opciones"
                            style={{
                                background: activeSection !== 'profile' ? 'var(--purple-ultra)' : 'var(--border)',
                                color: activeSection !== 'profile' ? 'var(--purple)' : 'var(--text-muted)',
                                fontSize: 20,
                                transition: 'all 0.2s'
                            }}
                            onClick={() => setActiveSection(s => s !== 'profile' ? 'profile' : 'settings')}
                        >
                            ⚙️
                        </button>
                        <button className="panel-close" onClick={onClose}>✕</button>
                    </div>
                </div>

                {activeSection === 'profile' && (
                    <>
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
                                <input type="file" style={{ display: 'none' }} accept="image/*" onChange={e => {
                                    if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];
                                        if (file.size > 2 * 1024 * 1024) {
                                            showToast('❌ La foto debe ser menor a 2MB');
                                            return;
                                        }
                                        const reader = new FileReader();
                                        reader.onload = (e) => {
                                            setState(s => ({ ...s, avatarUrl: e.target.result }));
                                            showSuccess('Foto actualizada', 'Tu foto de perfil fue actualizada');
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }} />
                            </label>
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
                                { icon: '🔔', label: 'Notificaciones', sub: 'Alertas de vencimientos y pagos', action: () => setActiveSection('notifications') },
                                { icon: '🔒', label: 'Seguridad', sub: 'PIN, biometría y contraseña', action: () => setActiveSection('security') },
                                { icon: '💾', label: 'Exportar datos', sub: 'Descargá tus datos en CSV o PDF', action: () => setActiveSection('export') },
                                { icon: '🗑️', label: 'Limpiar caché', sub: 'Eliminar datos temporales', action: () => showToast('🗑️ Caché limpiada') },
                                { icon: '📋', label: 'Términos y privacidad', sub: 'Política de privacidad y términos', action: () => setActiveSection('terms') },
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

                {activeSection === 'notifications' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <button onClick={() => setActiveSection('settings')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', textAlign: 'left', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', marginBottom: '8px' }}>
                            ‹ Volver a opciones
                        </button>
                        <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Vencimientos próximos</div>
                                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Te avisamos 3 días antes</div>
                            </div>
                            <input type="checkbox" defaultChecked style={{ width: 22, height: 22, accentColor: '#6c35de' }} />
                        </div>
                        <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Nuevos cargos</div>
                                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Alerta para cada pago en cuenta</div>
                            </div>
                            <input type="checkbox" defaultChecked style={{ width: 22, height: 22, accentColor: '#6c35de' }} />
                        </div>
                        <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Avisos de aumento</div>
                                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Alerta por subas en suscripciones</div>
                            </div>
                            <input type="checkbox" defaultChecked style={{ width: 22, height: 22, accentColor: '#6c35de' }} />
                        </div>
                    </div>
                )}

                {activeSection === 'security' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <button onClick={() => setActiveSection('settings')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', textAlign: 'left', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', marginBottom: '8px' }}>
                            ‹ Volver a opciones
                        </button>
                        <div className="form-group">
                            <label className="form-label">Cambiar PIN</label>
                            <input className="form-input" type="password" placeholder="Ingresá nuevo PIN" />
                        </div>
                        <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                            <div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Bloqueo con huella/rostro</div>
                                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Usar la biometría del teléfono</div>
                            </div>
                            <input type="checkbox" style={{ width: 22, height: 22, accentColor: '#6c35de' }} />
                        </div>
                        <button className="btn-save" onClick={() => {
                            showSuccess('Seguridad', 'Configuración de seguridad guardada')
                            setActiveSection('settings')
                        }} style={{ marginTop: '16px' }}>Guardar ajustes</button>
                    </div>
                )}

                {activeSection === 'export' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <button onClick={() => setActiveSection('settings')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', textAlign: 'left', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', marginBottom: '8px' }}>
                            ‹ Volver a opciones
                        </button>
                        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Seleccioná el formato para descargar el historial completo de tus actividades y configuraciones.</p>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button className="btn-save" onClick={() => {
                                showSuccess('Datos exportados', 'Archivo CSV guardado en descargas')
                            }} style={{ background: 'var(--dark-card)' }}>Exportar a CSV</button>
                            <button className="btn-save" onClick={() => {
                                showSuccess('Datos exportados', 'Archivo PDF guardado en descargas')
                            }}>Exportar a PDF</button>
                        </div>
                    </div>
                )}

                {activeSection === 'terms' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <button onClick={() => setActiveSection('settings')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', textAlign: 'left', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', marginBottom: '8px' }}>
                            ‹ Volver a opciones
                        </button>
                        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: '16px', fontSize: 13, color: 'var(--text-muted)', maxHeight: '300px', overflowY: 'auto', lineHeight: 1.5 }}>
                            <h3 style={{ color: 'var(--text)', marginBottom: 8, fontSize: 15 }}>Términos y Condiciones</h3>
                            <p style={{ marginBottom: 12 }}>Al usar MisInfo, aceptas los términos de uso. MisInfo es una aplicación de gestión financiera personal que te permite organizar tus finanzas en Argentina.</p>
                            <h3 style={{ color: 'var(--text)', marginBottom: 8, fontSize: 15 }}>Privacidad de Datos</h3>
                            <p style={{ marginBottom: 12 }}>Tus datos financieros y la información que nos proporciones se almacena localmente y, cuando sea necesario, estará cifrada.</p>
                            <h3 style={{ color: 'var(--text)', marginBottom: 8, fontSize: 15 }}>Sincronización Bancaria</h3>
                            <p>La sincronización bancaria requiere el uso de proveedores regulados. MisInfo nunca almacena tus contraseñas directamente.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
