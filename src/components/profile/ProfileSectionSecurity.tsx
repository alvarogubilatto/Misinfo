import React from 'react';

interface ProfileSectionSecurityProps {
    onNavigate: (section: string) => void;
    showSuccess: (text: string, sub?: string) => void;
}

export default function ProfileSectionSecurity({ onNavigate, showSuccess }: ProfileSectionSecurityProps) {
    return (
        <div className="panel-section-enter" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
                <label className="form-label">Cambiar PIN</label>
                <input className="form-input" type="password" placeholder="Ingresá nuevo PIN" />
            </div>
            <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Bloqueo con huella/rostro</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Usar la biometría del teléfono</div>
                </div>
                <input type="checkbox" style={{ width: 22, height: 22, accentColor: 'var(--primary)' }} />
            </div>
            <button className="btn-save" onClick={() => {
                showSuccess('Seguridad', 'Configuración de seguridad guardada')
                onNavigate('settings')
            }} style={{ marginTop: '16px' }}>Guardar ajustes</button>
        </div>
    )
}
