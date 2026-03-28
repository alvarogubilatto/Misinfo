import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import { useStore } from './hooks/useStore'
import { authService } from './services/auth.service'
import { uiService } from './services/ui.service'
import { formatMXN } from './data'
import { Icon } from './components/shared/Icon'

// Screens
import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import SubsScreen from './screens/SubsScreen'
import PropsScreen from './screens/PropsScreen'
import ReportsScreen from './screens/ReportsScreen'

// Panels / Modals
import NotifPanel from './components/NotifPanel'
import AccountsPanel from './components/AccountsPanel'
import ProfileScreen from './screens/ProfileScreen'
import ActivityPanel from './components/ActivityPanel'
import AddFundsModal from './components/AddFundsModal'
import PayModal from './components/PayModal'
import AddSubModal from './components/AddSubModal'
import AddPropModal from './components/AddPropModal'
import ServicesModal from './components/ServicesModal'
import Toast from './components/Toast'
import FeedbackOverlay from './components/FeedbackOverlay'
import Onboarding from './components/Onboarding'

const TAB_ORDER = ['home', 'subs', 'props', 'reports', 'profile'] as const;

export default function App() {
    const state = useStore()
    
    // UI Local State (Navigation & Visibility)
    const [currentTab, setCurrentTab] = useState(0)
    const [animDir, setAnimDir] = useState('')
    const [openPanel, setOpenPanel] = useState<'notif' | 'accounts' | 'activity' | null>(null)
    const [openModal, setOpenModal] = useState<'addFunds' | 'pay' | 'addSub' | 'addProp' | 'services' | null>(null)
    const [servicesFor, setServicesFor] = useState('')

    // Pay pending local state
    const [pendingPay, setPendingPay] = useState({ name: '', amount: 0, icon: 'card' })

    // Auth state reactivo vía Supabase
    const [session, setSession] = useState<Session | null>(null)
    const [authLoading, setAuthLoading] = useState(true)

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('[auth]', event, session?.user?.email ?? null)
            setSession(session)
            setAuthLoading(false)
        })
        return () => subscription.unsubscribe()
    }, [])

    const handleLogout = () => authService.logout()

    const handleOnboardingComplete = () => {
        localStorage.setItem('onboarding_done', 'true')
    }

    const showOnboarding = !localStorage.getItem('onboarding_done')

    // Dark Mode Effect
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light')
    }, [state.darkMode])

    const switchTab = useCallback((idx: number) => {
        if (idx === currentTab) return
        setAnimDir(idx > currentTab ? 'slide-left' : 'slide-right')
        setCurrentTab(idx)
    }, [currentTab])

    const handlePay = useCallback((name: string, amount: number, icon?: string) => {
        setPendingPay({ name, amount, icon: icon || 'card' })
        setOpenModal(null)
        setTimeout(() => setOpenModal('pay'), 10)
    }, [])

    const openServicesModal = useCallback((propName?: string) => {
        setServicesFor(propName || 'Casa Principal')
        setOpenModal('services')
    }, [])

    const navItems = [
        { label: 'Inicio', icon: 'home' },
        { label: 'Suscripciones', icon: 'subs' },
        { label: 'Inmuebles', icon: 'building' },
        { label: 'Reportes', icon: 'reports' },
        { label: 'Perfil', icon: 'profile' }
    ]

    const commonProps = { 
        state, 
        showToast: uiService.showToast, 
        showSuccess: uiService.showSuccess,
        formatMXN 
    }

    if (authLoading) {
        return (
            <div className="app-container" id="phoneFrame" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--bg)'
            }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Cargando...</div>
            </div>
        )
    }

    if (!session) {
        return (
            <div className="app-container" id="phoneFrame">
                <LoginScreen />
            </div>
        )
    }

    return (
        <div className="app-container" id="phoneFrame">
            <Toast msg={state.toast?.msg || ''} show={!!state.toast?.show} type={state.toast?.type || 'info'} />
            <FeedbackOverlay 
                show={!!state.feedback?.show} 
                text={state.feedback?.text || ''} 
                sub={state.feedback?.sub || undefined} 
                type={state.feedback?.type || 'success'} 
            />

            <Onboarding show={showOnboarding} onComplete={handleOnboardingComplete} />

            {/* Panels */}
            {openPanel === 'notif' && <NotifPanel open={true} onClose={() => setOpenPanel(null)} />}
            <AccountsPanel open={openPanel === 'accounts'} onClose={() => setOpenPanel(null)} state={state} formatMXN={formatMXN} showToast={uiService.showToast} />
            <ActivityPanel open={openPanel === 'activity'} onClose={() => setOpenPanel(null)} state={state} formatMXN={formatMXN} />

            {/* Modals */}
            <AddFundsModal open={openModal === 'addFunds'} onClose={() => setOpenModal(null)} {...commonProps} />
            <PayModal open={openModal === 'pay'} onClose={() => setOpenModal(null)} pendingPay={pendingPay} {...commonProps} showError={uiService.showError} />
            <AddSubModal open={openModal === 'addSub'} onClose={() => setOpenModal(null)} {...commonProps} />
            <AddPropModal open={openModal === 'addProp'} onClose={() => setOpenModal(null)} {...commonProps} />
            <ServicesModal open={openModal === 'services'} onClose={() => setOpenModal(null)} propName={servicesFor} handlePay={handlePay} showToast={uiService.showToast} />


            {/* Nav */}
            <nav className="app-nav">
                <div className="nav-inner">
                    {navItems.map((item, idx) => (
                        <button
                            key={idx}
                            className={`nav-item${currentTab === idx ? ' active' : ''}`}
                            onClick={() => switchTab(idx)}
                        >
                            <div className="nav-icon-wrap">
                                <motion.div 
                                    className="nav-icon"
                                    animate={currentTab === idx ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 }}
                                >
                                    <Icon name={item.icon} />
                                </motion.div>
                            </div>
                            <span className="nav-label">{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="app-content" style={{ position: 'relative', overflow: 'hidden' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={TAB_ORDER[currentTab]}
                        initial={{ opacity: 0, x: animDir === 'slide-left' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: animDir === 'slide-left' ? -20 : 20 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="screen-wrapper"
                        style={{ height: '100%', width: '100%' }}
                    >
                        {(() => {
                            const tab = TAB_ORDER[currentTab]
                            const common = { 
                                state, 
                                showToast: uiService.showToast, 
                                showSuccess: uiService.showSuccess,
                                formatMXN,
                                className: 'screen active'
                            }
                            
                            switch(tab) {
                                case 'home':
                                    return (
                                        <HomeScreen
                                            {...common}
                                            toggleDarkMode={uiService.toggleDarkMode}
                                            openPanel={(p: any) => setOpenPanel(p)}
                                            openModal={(m: any) => setOpenModal(m)}
                                            switchToSubs={() => switchTab(1)}
                                            handlePay={handlePay}
                                        />
                                    );
                                case 'subs':
                                    return (
                                        <SubsScreen
                                            {...common}
                                            openModal={() => setOpenModal('addSub')}
                                        />
                                    );
                                case 'props':
                                    return (
                                        <PropsScreen
                                            {...common}
                                            openAddProp={() => setOpenModal('addProp')}
                                            openServicesModal={openServicesModal}
                                        />
                                    );
                                case 'reports':
                                    return (
                                        <ReportsScreen
                                            showToast={uiService.showToast}
                                            showSuccess={uiService.showSuccess}
                                        />
                                    );
                                case 'profile':
                                    return (
                                        <ProfileScreen
                                            open={true}
                                            onClose={() => switchTab(0)}
                                            state={state}
                                            showToast={uiService.showToast}
                                            showSuccess={uiService.showSuccess}
                                            onLogout={handleLogout}
                                        />
                                    );
                                default:
                                    return null;
                            }
                        })()}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    )
}
