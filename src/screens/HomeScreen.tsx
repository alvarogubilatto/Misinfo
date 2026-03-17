import React, { useState, useEffect } from 'react';
import HomeHeader from '../components/home/HomeHeader';
import BalanceCard from '../components/home/BalanceCard';
import WeeklyDigest from '../components/home/WeeklyDigest';
import UpcomingPayments from '../components/home/UpcomingPayments';
import HomeChart from '../components/home/HomeChart';
import ActivityList from '../components/home/ActivityList';
import { Icon } from '../components/shared/Icon';
import type { AppState, Activity } from '../types';

interface HomeScreenProps {
    className?: string;
    state: AppState;
    showToast: (msg: string, type?: string) => void;
    showSuccess: (text: string, sub?: string) => void;
    toggleDarkMode: () => void;
    openPanel: (name: string) => void;
    openModal: (name: string) => void;
    switchToSubs: () => void;
    handlePay: (name: string, amount: number, icon?: string) => void;
    formatMXN: (n: number) => string;
}

export default function HomeScreen({
    className, state, showToast, showSuccess, toggleDarkMode,
    openPanel, openModal, switchToSubs, handlePay, formatMXN
}: HomeScreenProps) {
    const [chartPeriod, setChartPeriod] = useState<'week' | 'month' | 'year'>('week')
    const [balHidden, setBalHidden] = useState(state.balanceHidden)
    const [progressW, setProgressW] = useState(0)
    const [actLimit, setActLimit] = useState(6)

    // Quick pay selection
    const [selectedVenc, setSelectedVenc] = useState<string[]>([])

    useEffect(() => { 
        const timer = setTimeout(() => setProgressW(85), 500)
        return () => clearTimeout(timer)
    }, [])

    const ingresos = state.activities.filter(a => a.amount > 0).reduce((s, a) => s + a.amount, 0)
    const gastos = state.activities.filter(a => a.amount < 0 && a.cat !== 'servicios').reduce((s, a) => s + Math.abs(a.amount), 0)
    const subsTotal = state.subs.filter(s => !s.paused).reduce((a, s) => a + s.price, 0)
    const diff = ingresos - gastos - subsTotal

    const [actSearch, setActSearch] = useState('')
    const [actFilter, setActFilter] = useState('all')

    const filteredActs = state.activities
        .filter(a => actFilter === 'all' || a.cat === actFilter)
        .filter(a => !actSearch || a.name.toLowerCase().includes(actSearch.toLowerCase()) || a.meta.toLowerCase().includes(actSearch.toLowerCase()))

    const totalFiltered = filteredActs.length
    const visibleActs = filteredActs.slice(0, actLimit)

    // Group activities by temporal label
    const groupActivities = (acts: Activity[]) => {
        const groups: any[] = []
        let currentLabel: string | null = null
        acts.forEach(a => {
            const meta = a.meta.toLowerCase()
            let label = 'Anteriores'
            if (meta.includes('hoy')) label = 'Hoy'
            else if (meta.includes('ayer')) label = 'Ayer'
            else if (meta.includes('hace 2 días') || meta.includes('hace 3 días')) label = 'Esta semana'
            if (label !== currentLabel) {
                groups.push({ type: 'label', label })
                currentLabel = label
            }
            groups.push({ type: 'item', data: a })
        })
        return groups
    }

    const groupedActs = groupActivities(visibleActs)

    const toggleVenc = (id: string) => {
        setSelectedVenc(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id])
    }

    const VENCIMIENTOS = [
        { id: 'abl', name: 'ABL / Inmobiliario', amount: 2400, icon: 'bank', paid: false },
        { id: 'renta', name: 'Renta Marzo', amount: 12500, icon: 'home', paid: false },
        { id: 'spotify', name: 'Spotify', amount: 179, icon: 'spotify', paid: true },
    ]

    const selectedTotal = VENCIMIENTOS
        .filter(v => selectedVenc.includes(v.id) && !v.paid)
        .reduce((s, v) => s + v.amount, 0)

    const paySelected = () => {
        const names = VENCIMIENTOS
            .filter(v => selectedVenc.includes(v.id) && !v.paid)
            .map(v => v.name).join(', ')
        handlePay(names, selectedTotal, 'card')
        setSelectedVenc([])
    }

    return (
        <div className={className}>
            <div className="home-inner">
                <HomeHeader 
                    state={state} 
                    toggleDarkMode={toggleDarkMode} 
                    openPanel={openPanel} 
                />

                <BalanceCard 
                    state={state}
                    balHidden={balHidden}
                    setBalHidden={setBalHidden}
                    diff={diff}
                    ingresos={ingresos}
                    gastos={gastos}
                    subsTotal={subsTotal}
                    formatMXN={formatMXN}
                    openModal={openModal}
                    openPanel={openPanel}
                />

                <div className="stagger-3">
                    <WeeklyDigest 
                        activities={state.activities} 
                        formatMXN={formatMXN} 
                    />
                </div>

                <UpcomingPayments 
                    selectedVenc={selectedVenc}
                    toggleVenc={toggleVenc}
                    selectedTotal={selectedTotal}
                    paySelected={paySelected}
                    handlePay={handlePay}
                    showToast={showToast}
                    switchToSubs={switchToSubs}
                    progressW={progressW}
                />

                <HomeChart 
                    chartPeriod={chartPeriod}
                    setChartPeriod={setChartPeriod}
                />

                <div className="sync-card stagger-6" onClick={() => showToast('Sincronizando tus cuentas...', 'info')}>
                    <Icon name="sync" style={{ width: 24, height: 24, color: 'var(--primary)' }} />
                    <div style={{ flex: 1 }}>
                        <div className="sync-name">Sincronización Bancaria</div>
                        <div className="sync-detail">3 cuentas · Actualizado hace 5 min</div>
                    </div>
                    <div className="sync-status">
                        <div className="sync-dot" />
                        <div className="sync-label">Activo</div>
                    </div>
                </div>

                <ActivityList 
                    filteredActs={filteredActs}
                    actSearch={actSearch}
                    setActSearch={setActSearch}
                    actFilter={actFilter}
                    setActFilter={setActFilter}
                    groupedActs={groupedActs}
                    totalFiltered={totalFiltered}
                    actLimit={actLimit}
                    setActLimit={setActLimit}
                    showToast={showToast}
                    openPanel={openPanel}
                />

                <div style={{ height: 28 }} />
            </div>
        </div>
    )
}
