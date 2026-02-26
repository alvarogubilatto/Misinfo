import { useState, useEffect, useCallback, useRef } from 'react'
import { loadState, saveStateToStorage, formatMXN } from './data'

// Screens
import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import SubsScreen from './screens/SubsScreen'
import PropsScreen from './screens/PropsScreen'
import ReportsScreen from './screens/ReportsScreen'

// Panels / Modals
import NotifPanel from './components/NotifPanel'
import AccountsPanel from './components/AccountsPanel'
import ProfilePanel from './components/ProfilePanel'
import AddFundsModal from './components/AddFundsModal'
import PayModal from './components/PayModal'
import AddSubModal from './components/AddSubModal'
import AddPropModal from './components/AddPropModal'
import ServicesModal from './components/ServicesModal'
import Toast from './components/Toast'
import SuccessOverlay from './components/SuccessOverlay'

const TAB_ORDER = ['home', 'subs', 'props', 'reports']

export default function App() {
    const [state, setState] = useState(loadState)
    const [currentTab, setCurrentTab] = useState(0)
    const [prevTab, setPrevTab] = useState(0)
    const [animDir, setAnimDir] = useState('')

    // Panel / Modal open states
    const [openPanel, setOpenPanel] = useState(null) // 'notif' | 'accounts' | 'profile'
    const [openModal, setOpenModal] = useState(null)  // 'addFunds' | 'pay' | 'addSub' | 'addProp' | 'services'
    const [servicesFor, setServicesFor] = useState('')

    // Toast
    const [toast, setToast] = useState({ msg: '', show: false })
    const toastTimerRef = useRef(null)

    // Success
    const [success, setSuccess] = useState({ show: false, text: '', sub: '' })

    // Pay pending
    const [pendingPay, setPendingPay] = useState({ name: '', amount: '', icon: '💳' })

    // Auth state
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('auth_token') === 'true'
    })

    const handleLogin = () => {
        localStorage.setItem('auth_token', 'true')
        setIsAuthenticated(true)
    }

    const handleLogout = () => {
        localStorage.removeItem('auth_token')
        setIsAuthenticated(false)
        setOpenPanel(null)
    }

    // Persist state
    useEffect(() => { saveStateToStorage(state) }, [state])

    // Apply dark mode to document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light')
    }, [state.darkMode])

    const showToast = useCallback((msg) => {
        setToast({ msg, show: true })
        clearTimeout(toastTimerRef.current)
        toastTimerRef.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2400)
    }, [])

    const showSuccess = useCallback((text, sub = '') => {
        setSuccess({ show: true, text, sub })
        setTimeout(() => setSuccess(s => ({ ...s, show: false })), 2200)
    }, [])

    const switchTab = useCallback((idx) => {
        if (idx === currentTab) return
        setAnimDir(idx > currentTab ? 'slide-left' : 'slide-right')
        setPrevTab(currentTab)
        setCurrentTab(idx)
    }, [currentTab])

    const toggleDarkMode = useCallback(() => {
        setState(s => ({ ...s, darkMode: !s.darkMode }))
    }, [])

    const handlePay = useCallback((name, amount, icon) => {
        setPendingPay({ name, amount, icon: icon || '💳' })
        setOpenModal(null)
        setTimeout(() => setOpenModal('pay'), 10)
    }, [])

    const openServicesModal = useCallback((propName) => {
        setServicesFor(propName || 'Casa Principal')
        setOpenModal('services')
    }, [])

    const navItems = [
        { label: 'Inicio', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> },
        { label: 'Suscripciones', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg> },
        { label: 'Inmuebles', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" /><path d="M9 21V12h6v9" /></svg> },
        { label: 'Reportes', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg> },
    ]

    const commonProps = { state, setState, showToast, showSuccess, formatMXN }

    if (!isAuthenticated) {
        return (
            <div className="app-container" id="phoneFrame">
                <LoginScreen onLogin={handleLogin} />
            </div>
        )
    }

    return (
        <div className="app-container" id="phoneFrame">
            <Toast msg={toast.msg} show={toast.show} />
            <SuccessOverlay show={success.show} text={success.text} sub={success.sub} />

            {/* Panels */}
            <NotifPanel open={openPanel === 'notif'} onClose={() => setOpenPanel(null)} />
            <AccountsPanel open={openPanel === 'accounts'} onClose={() => setOpenPanel(null)} state={state} formatMXN={formatMXN} showToast={showToast} />
            <ProfilePanel open={openPanel === 'profile'} onClose={() => setOpenPanel(null)} state={state} setState={setState} showToast={showToast} showSuccess={showSuccess} onLogout={handleLogout} />

            {/* Modals */}
            <AddFundsModal open={openModal === 'addFunds'} onClose={() => setOpenModal(null)} {...commonProps} />
            <PayModal open={openModal === 'pay'} onClose={() => setOpenModal(null)} pendingPay={pendingPay} {...commonProps} />
            <AddSubModal open={openModal === 'addSub'} onClose={() => setOpenModal(null)} {...commonProps} />
            <AddPropModal open={openModal === 'addProp'} onClose={() => setOpenModal(null)} {...commonProps} />
            <ServicesModal open={openModal === 'services'} onClose={() => setOpenModal(null)} propName={servicesFor} handlePay={handlePay} showToast={showToast} />

            {/* Nav (Sidebar on Desktop, Bottom on Mobile) */}
            <nav className="app-nav">
                <div className="nav-inner">
                    {navItems.map((item, idx) => (
                        <button
                            key={idx}
                            className={`nav-item${currentTab === idx ? ' active' : ''}`}
                            onClick={() => switchTab(idx)}
                        >
                            <div className="nav-icon-wrap">
                                <div className="nav-icon">{item.icon}</div>
                            </div>
                            <span className="nav-label">{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="app-content">
                {TAB_ORDER.map((tab, idx) => {
                    const isActive = currentTab === idx
                    let cls = 'screen'
                    if (isActive) {
                        cls += ' active'
                        if (animDir) cls += ' ' + animDir
                    }
                    const screens = {
                        home: (
                            <HomeScreen
                                key="home"
                                className={cls}
                                state={state}
                                setState={setState}
                                showToast={showToast}
                                showSuccess={showSuccess}
                                formatMXN={formatMXN}
                                toggleDarkMode={toggleDarkMode}
                                openPanel={(p) => setOpenPanel(p)}
                                openModal={(m) => setOpenModal(m)}
                                switchToSubs={() => switchTab(1)}
                                handlePay={handlePay}
                            />
                        ),
                        subs: (
                            <SubsScreen
                                key="subs"
                                className={cls}
                                {...commonProps}
                                openModal={() => setOpenModal('addSub')}
                            />
                        ),
                        props: (
                            <PropsScreen
                                key="props"
                                className={cls}
                                {...commonProps}
                                openAddProp={() => setOpenModal('addProp')}
                                openServicesModal={openServicesModal}
                            />
                        ),
                        reports: (
                            <ReportsScreen
                                key="reports"
                                className={cls}
                                showToast={showToast}
                                showSuccess={showSuccess}
                            />
                        ),
                    }
                    return isActive ? screens[tab] : <div key={tab} className="screen" style={{ display: 'none' }} />
                })}
            </main>
        </div>
    )
}
