import { useState } from 'react'
import ProfileHeader from '../components/profile/ProfileHeader'
import ProfileSectionInfo from '../components/profile/ProfileSectionInfo'
import ProfileSectionSettings from '../components/profile/ProfileSectionSettings'
import ProfileSectionSecurity from '../components/profile/ProfileSectionSecurity'
import ProfileSectionNotifs from '../components/profile/ProfileSectionNotifs'
import ProfileSectionOthers from '../components/profile/ProfileSectionOthers'
import ProfileLogoutDialog from '../components/profile/ProfileLogoutDialog'

export default function ProfileScreen({ open, onClose, state, setState, showToast, showSuccess, onLogout }) {
    const [activeSection, setActiveSection] = useState('profile')
    const [confirmLogout, setConfirmLogout] = useState(false)

    // Helper for navigation
    const getBreadcrumbPath = () => {
        if (activeSection === 'profile') return ['profile']
        if (activeSection === 'settings') return ['profile', 'settings']
        return ['profile', 'settings', activeSection]
    }

    const handleSave = (newName) => {
        const trimmed = newName.trim() || 'Alex'
        setState(s => ({ ...s, userName: trimmed }))
        onClose()
        showSuccess('Perfil actualizado', 'Tus cambios fueron guardados')
    }

    return (
        <div className={`profile-screen${open ? ' open' : ''}`}>
            <div className="profile-screen-inner">
                <ProfileHeader 
                    activeSection={activeSection}
                    path={getBreadcrumbPath()}
                    onNavigate={setActiveSection}
                    onToggleSettings={() => setActiveSection(s => s !== 'profile' ? 'profile' : 'settings')}
                    onClose={onClose}
                />

                <div className="profile-screen-body">
                    {activeSection === 'profile' && (
                        <ProfileSectionInfo 
                            state={state} 
                            setState={setState} 
                            showToast={showToast} 
                            showSuccess={showSuccess}
                            onSave={handleSave}
                            onLogoutRequest={() => setConfirmLogout(true)}
                        />
                    )}

                    {activeSection === 'settings' && (
                        <ProfileSectionSettings 
                            onNavigate={setActiveSection} 
                            showToast={showToast} 
                        />
                    )}

                    {activeSection === 'notifications' && (
                        <ProfileSectionNotifs />
                    )}

                    {activeSection === 'security' && (
                        <ProfileSectionSecurity 
                            onNavigate={setActiveSection} 
                            showSuccess={showSuccess} 
                        />
                    )}

                    {(activeSection === 'export' || activeSection === 'terms') && (
                        <ProfileSectionOthers 
                            activeSection={activeSection} 
                            showSuccess={showSuccess} 
                        />
                    )}
                </div>
            </div>

            <ProfileLogoutDialog 
                open={confirmLogout} 
                onCancel={() => setConfirmLogout(false)} 
                onConfirm={() => {
                    setConfirmLogout(false)
                    onLogout()
                }}
            />
        </div>
    )
}
