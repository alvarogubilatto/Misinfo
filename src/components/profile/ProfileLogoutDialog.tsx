import React from 'react';
import { Icon } from '../shared/Icon';

interface ProfileLogoutDialogProps {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function ProfileLogoutDialog({ open, onCancel, onConfirm }: ProfileLogoutDialogProps) {
    if (!open) return null

    return (
        <div className={`confirm-overlay open`} onClick={onCancel} style={{ position: 'fixed', zIndex: 10001 } as React.CSSProperties}>
            <div className="confirm-card" onClick={e => e.stopPropagation()}>
                <div className="confirm-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--error)', width: 32, height: 32, margin: '0 auto 16px' } as React.CSSProperties}>
                    <Icon name="logout" />
                </div>
                <div className="confirm-title">¿Cerrar sesión?</div>
                <div className="confirm-body">Tendrás que ingresar tus credenciales nuevamente para acceder a tu cuenta.</div>
                <div className="confirm-actions">
                    <button className="confirm-btn cancel" onClick={onCancel}>Cancelar</button>
                    <button className="confirm-btn danger" onClick={onConfirm}>Cerrar sesión</button>
                </div>
            </div>
        </div>
    )
}
