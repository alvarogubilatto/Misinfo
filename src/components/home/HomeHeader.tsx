import React from 'react';
import { Icon } from '../shared/Icon';
import type { AppState } from '../../types';

interface HomeHeaderProps {
    state: AppState;
    toggleDarkMode: () => void;
    openPanel: (name: string) => void;
}

function getGreeting(): string {
    const h = new Date().getHours()
    return h < 12 ? 'Buenos días' : h < 18 ? 'Buenas tardes' : 'Buenas noches'
}

export default function HomeHeader({ state, toggleDarkMode, openPanel }: HomeHeaderProps) {
    return (
        <div className="top-bar stagger-1">
            <div className="user-info">
                <div className="avatar" onClick={() => openPanel('profile')}>
                    {state.avatarUrl ? (
                        <img src={state.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        (state.userName || 'A')[0].toUpperCase()
                    )}
                </div>
                <div>
                    <div className="welcome-text">{getGreeting()}</div>
                    <div className="user-name">{state.userName || 'Usuario'}</div>
                </div>
            </div>
            <div className="top-actions">
                <button className="icon-btn" onClick={toggleDarkMode} title="Modo oscuro">
                    <Icon name={state.darkMode ? 'moon' : 'sun'} />
                </button>
                <button className="icon-btn" onClick={() => openPanel('notif')} aria-label="Notificaciones">
                    <Icon name="bell" />
                    <span className="notif-dot" />
                </button>
            </div>
        </div>
    )
}
