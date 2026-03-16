import { colors } from '../../design/colors'

const SECTION_LABELS = {
    profile: 'Mi Perfil',
    settings: 'Opciones',
    notifications: 'Notificaciones',
    security: 'Seguridad',
    export: 'Exportar datos',
    terms: 'Términos y privacidad'
}

function Breadcrumbs({ path, onNavigate }) {
    if (path.length <= 1) return null
    return (
        <div className="panel-breadcrumbs">
            {path.map((p, i) => (
                <span key={i}>
                    {i > 0 && <span className="bc-sep"> › </span>}
                    {i === path.length - 1
                        ? <span className="bc-active">{SECTION_LABELS[p]}</span>
                        : <span onClick={() => onNavigate(p)} style={{ cursor: 'pointer' }}>{SECTION_LABELS[p]}</span>
                    }
                </span>
            ))}
        </div>
    )
}

export default function ProfileHeader({ activeSection, path, onNavigate, onToggleSettings, onClose }) {
    return (
        <div className="profile-screen-header">
            <div>
                <Breadcrumbs path={path} onNavigate={onNavigate} />
                <div className="side-panel-title">
                    {activeSection !== 'settings' && activeSection !== 'profile' && (
                        <button 
                            onClick={() => onNavigate('settings')}
                            style={{ 
                                background: 'transparent', 
                                border: 'none', 
                                color: 'var(--primary)', 
                                marginRight: 8, 
                                cursor: 'pointer',
                                fontSize: 18
                            }}
                        >
                            ←
                        </button>
                    )}
                    {SECTION_LABELS[activeSection] || 'Opciones'}
                </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                    className="panel-close"
                    title="Opciones"
                    style={{
                        background: activeSection !== 'profile' ? 'var(--primary-ultra)' : 'var(--border)',
                        color: activeSection !== 'profile' ? 'var(--primary)' : 'var(--text-muted)',
                        fontSize: 20,
                        transition: 'all 0.2s'
                    }}
                    onClick={onToggleSettings}
                >
                    ⚙️
                </button>
                <button className="panel-close" onClick={onClose}>✕</button>
            </div>
        </div>
    )
}
