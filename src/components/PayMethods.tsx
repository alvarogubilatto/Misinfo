import React, { useState } from 'react';
import type { Account } from '../types';

interface PayMethodsProps {
    accounts: Account[];
    defaultId?: number;
    containerId?: string;
}

export default function PayMethods({ accounts, defaultId, containerId }: PayMethodsProps) {
    const [selectedId, setSelectedId] = useState(defaultId ?? accounts[0]?.id)

    // Expose selected id via ref-like approach using data attribute on parent
    return (
        <div className="pay-methods" id={containerId} data-selected={selectedId}>
            {accounts.map(a => (
                <div
                    key={a.id}
                    className={`pay-method${selectedId === a.id ? ' selected' : ''}`}
                    onClick={() => setSelectedId(a.id)}
                >
                    <div className="pay-method-icon">{a.icon}</div>
                    <div className="pay-method-name">{a.name.split(' ')[0]}</div>
                </div>
            ))}
        </div>
    )
}
