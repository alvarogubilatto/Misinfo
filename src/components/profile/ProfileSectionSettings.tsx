import React from 'react';
import { Icon } from '../shared/Icon';

interface ProfileSectionSettingsProps {
    onNavigate: (section: string) => void;
    showToast: (msg: string, type?: string) => void;
}

export default function ProfileSectionSettings({ onNavigate, showToast }: ProfileSectionSettingsProps) {

    const settingsItems = [
        { icon: 'bell', label: 'Notificaciones', sub: 'Alertas de vencimientos y pagos', action: () => onNavigate('notifications') },
        { icon: 'security', label: 'Seguridad', sub: 'PIN, biometría y contraseña', action: () => onNavigate('security') },
        { icon: 'download', label: 'Exportar datos', sub: 'Descargá tus datos en CSV o PDF', action: () => onNavigate('export') },
        { icon: 'tool', label: 'Limpiar caché', sub: 'Eliminar datos temporales', action: () => showToast('Caché limpiada correctamente', 'success') },
        { icon: 'news', label: 'Términos y privacidad', sub: 'Política de privacidad y términos', action: () => onNavigate('terms') },
        { icon: 'news', label: 'Versión de la app', sub: 'VOXU v1.0.0 — Argentina', action: () => showToast('Estás en la última versión', 'success') },
    ]

    return (
        <div className="panel-section-enter" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {settingsItems.map((item, i) => (
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
                    } as React.CSSProperties}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                    <div style={{ flexShrink: 0, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--card)', borderRadius: 10, color: 'var(--primary)', padding: 7 }}>
                        <Icon name={item.icon} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{item.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{item.sub}</div>
                    </div>
                    <div style={{ color: 'var(--text-light)', fontSize: 18 }}>›</div>
                </button>
            ))}
        </div>
    )
}
