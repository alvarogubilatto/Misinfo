import React from 'react';
import { Icon } from './shared/Icon';

interface FeedbackOverlayProps {
    show: boolean;
    text: string;
    sub?: string | undefined;
    type: 'success' | 'error';
}

export default function FeedbackOverlay({ show, text, sub, type }: FeedbackOverlayProps) {
    return (
        <div className={`feedback-overlay ${type}${show ? ' show' : ''}`}>
            <div className="feedback-icon-wrap" style={{ width: 64, height: 64 }}>
                <Icon name={type === 'success' ? 'check' : 'x'} />
            </div>
            <div className="feedback-text">{text}</div>
            {sub && <div className="feedback-sub">{sub}</div>}
        </div>
    )
}
