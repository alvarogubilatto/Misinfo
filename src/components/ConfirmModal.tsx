import React from 'react';
import { Icon } from './shared/Icon';

interface ConfirmModalProps {
    open: boolean;
    icon?: string;
    title: string;
    body: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'primary' | 'success';
}

export default function ConfirmModal({ open, icon, title, body, confirmText, cancelText, onConfirm, onCancel, variant = 'danger' }: ConfirmModalProps) {
    return (
        <div className={`confirm-overlay${open ? ' open' : ''}`} onClick={onCancel}>
            <div className="confirm-card" onClick={e => e.stopPropagation()}>
                <div className="confirm-icon" style={{ width: 48, height: 48, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={icon || 'warning'} />
                </div>
                <div className="confirm-title">{title}</div>
                <div className="confirm-body">{body}</div>
                <div className="confirm-actions">
                    <button className="confirm-btn cancel" onClick={onCancel}>{cancelText || 'Cancelar'}</button>
                    <button className={`confirm-btn ${variant}`} onClick={onConfirm}>{confirmText || 'Confirmar'}</button>
                </div>
            </div>
        </div>
    )
}
