import React from 'react';
import { Icon } from '../shared/Icon';

const SECTION_LABELS: Record<string, string> = {
    profile: 'Mi Perfil',
    settings: 'Opciones',
    notifications: 'Notificaciones',
    security: 'Seguridad',
    export: 'Exportar datos',
    terms: 'Términos y privacidad'
}

interface BreadcrumbsProps {
    path: string[];
    onNavigate: (section: string) => void;
}

function Breadcrumbs({ path, onNavigate }: BreadcrumbsProps) {
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

interface ProfileHeaderProps {
    activeSection: string;
    path: string[];
    onNavigate: (section: string) => void;
    onToggleSettings: () => void;
    onClose: () => void;
}

export default function ProfileHeader({ activeSection, path, onNavigate, onToggleSettings, onClose }: ProfileHeaderProps) {
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
                                width: 24, height: 24, padding: 0
                            }}
                        >
                            <Icon name="arrowLeft" />
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
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 6
                    }}
                    onClick={onToggleSettings}
                >
                    <Icon name="settings" style={{ width: 20, height: 20 }} />
                </button>
                <button className="panel-close" onClick={onClose}>✕</button>
            </div>
        </div>
    )
}
