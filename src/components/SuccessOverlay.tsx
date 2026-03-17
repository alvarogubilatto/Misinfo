import React from 'react';
import { Icon } from './shared/Icon';

interface SuccessOverlayProps {
    show: boolean;
    text: string;
    sub?: string;
}

export default function SuccessOverlay({ show, text, sub }: SuccessOverlayProps) {
    return (
        <div className={`success-overlay${show ? ' show' : ''}`}>
            <div className="success-checkmark" style={{ width: 64, height: 64 }}>
                <Icon name="check" />
            </div>
            <div className="success-text">{text}</div>
            {sub && <div className="success-sub">{sub}</div>}
        </div>
    )
}
