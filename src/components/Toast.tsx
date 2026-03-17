import React from 'react';
import { Icon } from './shared/Icon';

interface ToastProps {
    msg: string;
    show: boolean;
    type?: string;
}

export default function Toast({ msg, show, type }: ToastProps) {
    const typeClass = type ? ` toast-${type}` : ''
    const iconName = type === 'success' ? 'check' : type === 'error' ? 'warning' : type === 'warning' ? 'warning' : type === 'info' ? 'news' : null

    return (
        <div className={`toast${show ? ' show' : ''}${typeClass}`}>
            {iconName && <span className="toast-icon"><Icon name={iconName} /></span>}
            <span className="toast-msg">{msg}</span>
        </div>
    )
}
