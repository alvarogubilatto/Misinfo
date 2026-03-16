import { useState, useEffect, useRef } from 'react'
import { chartData } from '../data'
import { colors } from '../design/colors'

function getGreeting() {
    const h = new Date().getHours()
    return h < 12 ? 'Buenos días' : h < 18 ? 'Buenas tardes' : 'Buenas noches'
}

function BarChart({ period }) {
    const { data, labels } = chartData[period]
    const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 })
    const chartRef = useRef(null)

    return (
        <div style={{ position: 'relative' }}>
            <div
                className={`bar-tooltip${tooltip.show ? ' show' : ''}`}
                style={{ left: tooltip.x, top: tooltip.y, transform: 'translateX(-50%)', position: 'absolute' }}
            >
                {tooltip.text}
            </div>
            <div className="bar-chart" ref={chartRef}>
                {data.map((d, i) => (
                    <div key={i} className="bar-group">
                        {['in', 'out'].map(type => (
                            <div
                                key={type}
                                className={`bar bar-${type}`}
                                style={{ height: `${d[type]}%`, animationDelay: `${i * 0.05}s` }}
                                onMouseEnter={e => {
                                    const label = type === 'in' ? (d.li || 'Ingreso') : (d.lo || 'Gasto')
                                    const rect = chartRef.current?.getBoundingClientRect()
                                    const frameRect = document.getElementById('phoneFrame')?.getBoundingClientRect()
                                    if (rect && frameRect) {
                                        setTooltip({ show: true, text: label, x: e.clientX - frameRect.left, y: e.clientY - frameRect.top - 40 })
                                    }
                                }}
                                onMouseLeave={() => setTooltip(t => ({ ...t, show: false }))}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className="chart-labels">
                {labels.map((l, i) => <div key={i} className="chart-label">{l}</div>)}
            </div>
        </div>
    )
}

// Animated counting number component
function AnimatedNumber({ value, prefix = '', suffix = '' }) {
    const [display, setDisplay] = useState(0)
    const ref = useRef(null)

    useEffect(() => {
        let start = 0
        const end = value
        const duration = 600
        const startTime = performance.now()

        const animate = (now) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplay(Math.floor(eased * end))
            if (progress < 1) ref.current = requestAnimationFrame(animate)
        }
        ref.current = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(ref.current)
    }, [value])

    return <>{prefix}{display.toLocaleString('es-AR')}{suffix}</>
}

// Weekly Digest component
function WeeklyDigest({ activities, formatMXN }) {
    const [open, setOpen] = useState(true)

    const gastos = activities.filter(a => a.amount < 0).reduce((s, a) => s + Math.abs(a.amount), 0)
    const maxGasto = activities.filter(a => a.amount < 0).sort((a, b) => a.amount - b.amount)[0]
    const ingresosCount = activities.filter(a => a.amount > 0).length
    const gastosCount = activities.filter(a => a.amount < 0).length

    return (
        <div className="weekly-digest">
            <div className="weekly-digest-header" onClick={() => setOpen(!open)}>
                <div className="weekly-digest-title-row">
                    <span style={{ fontSize: 20 }}>📊</span>
                    <span className="weekly-digest-title">Tu semana en números</span>
                    <span className="weekly-digest-badge">Nuevo</span>
                </div>
                <span className={`weekly-digest-chevron${open ? ' open' : ''}`}>▾</span>
            </div>
            {open && (
                <div className="weekly-digest-body">
                    <div className="digest-item">
                        <div className="digest-item-icon" style={{ background: colors.catGreen }}>📉</div>
                        <div className="digest-item-text">
                            Gastaste <strong>${formatMXN(gastos)}</strong> esta semana en {gastosCount} transacciones
                        </div>
                    </div>
                    {maxGasto && (
                        <div className="digest-item">
                            <div className="digest-item-icon" style={{ background: colors.catYellow }}>🏷️</div>
                            <div className="digest-item-text">
                                Tu mayor gasto fue <strong>{maxGasto.name}</strong> (${Math.abs(maxGasto.amount).toLocaleString('es-AR')})
                            </div>
                        </div>
                    )}
                    <div className="digest-item">
                        <div className="digest-item-icon" style={{ background: colors.catBlue }}>💰</div>
                        <div className="digest-item-text">
                            Recibiste <strong>{ingresosCount} ingreso{ingresosCount !== 1 ? 's' : ''}</strong> esta semana
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function HomeScreen({
    className, state, setState, showToast, toggleDarkMode,
    openPanel, openModal, switchToSubs, handlePay, formatMXN
}) {
    const [chartPeriod, setChartPeriod] = useState('week')
    const [balHidden, setBalHidden] = useState(state.balanceHidden)
    const [progressW, setProgressW] = useState(0)
    const [actLimit, setActLimit] = useState(6)

    // Quick pay selection
    const [selectedVenc, setSelectedVenc] = useState([])

    useEffect(() => { setTimeout(() => setProgressW(85), 500) }, [])

    const ingresos = state.activities.filter(a => a.amount > 0).reduce((s, a) => s + a.amount, 0)
    const gastos = state.activities.filter(a => a.amount < 0 && a.cat !== 'servicios').reduce((s, a) => s + Math.abs(a.amount), 0)
    const subsTotal = state.subs.filter(s => !s.paused).reduce((a, s) => a + s.price, 0)
    const diff = ingresos - gastos - subsTotal

    // Health indicator
    const healthStatus = diff > 5000 ? 'healthy' : diff > 0 ? 'warning' : 'danger'
    const healthLabel = diff > 5000 ? '🟢 Mes saludable' : diff > 0 ? '🟡 Cuidado con los gastos' : '🔴 Gastos superan ingresos'

    const [actSearch, setActSearch] = useState('')
    const [actFilter, setActFilter] = useState('all')

    const filteredActs = state.activities
        .filter(a => actFilter === 'all' || a.cat === actFilter)
        .filter(a => !actSearch || a.name.toLowerCase().includes(actSearch.toLowerCase()) || a.meta.toLowerCase().includes(actSearch.toLowerCase()))

    const totalFiltered = filteredActs.length
    const visibleActs = filteredActs.slice(0, actLimit)

    // Group activities by temporal label
    const groupActivities = (acts) => {
        const groups = []
        let currentLabel = null
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

    const eyeSvg = balHidden
        ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>

    const moonSvg = state.darkMode
        ? <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        : <><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></>

    const ACTIVITY_FILTERS = [
        { key: 'all', label: 'Todos' }, { key: 'ingreso', label: 'Ingresos' },
        { key: 'gasto', label: 'Gastos' }, { key: 'servicios', label: 'Servicios' },
        { key: 'compras', label: 'Compras' },
    ]

    // Quick pay vencimientos data
    const VENCIMIENTOS = [
        { id: 'abl', name: 'ABL / Inmobiliario', amount: 2400, icon: '🏛️', paid: false },
        { id: 'renta', name: 'Renta Marzo', amount: 12500, icon: '🏠', paid: false },
        { id: 'spotify', name: 'Spotify', amount: 179, icon: '🎵', paid: true },
    ]

    const toggleVenc = (id) => {
        setSelectedVenc(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id])
    }

    const selectedTotal = VENCIMIENTOS
        .filter(v => selectedVenc.includes(v.id) && !v.paid)
        .reduce((s, v) => s + v.amount, 0)

    const paySelected = () => {
        const names = VENCIMIENTOS
            .filter(v => selectedVenc.includes(v.id) && !v.paid)
            .map(v => v.name).join(', ')
        handlePay(names, `$${selectedTotal.toLocaleString()}`, '💳')
        setSelectedVenc([])
    }

    return (
        <div className={className}>
            <div className="home-inner">
                {/* Top bar */}
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
                            <div className="user-name">{state.userName || 'Alex'}</div>
                        </div>
                    </div>
                    <div className="top-actions">
                        <button className="icon-btn" onClick={toggleDarkMode} title="Modo oscuro">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                {moonSvg}
                            </svg>
                        </button>
                        <button className="icon-btn" onClick={() => openPanel('notif')} aria-label="Notificaciones">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                            <span className="notif-dot" />
                        </button>
                    </div>
                </div>

                {/* Balance card with health indicator */}
                <div className="balance-card stagger-2">
                    <div className={`health-indicator ${healthStatus}`}>{healthLabel}</div>
                    <div className="balance-label">Saldo Total</div>
                    <div className="balance-row">
                        <div className="balance-amount">
                            ${balHidden ? '•••,•••' : <AnimatedNumber value={state.balance} />}
                            {!balHidden && <span className="balance-cents">.00</span>}
                        </div>
                        <button className="balance-eye-btn" onClick={() => setBalHidden(h => !h)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                {eyeSvg}
                            </svg>
                        </button>
                    </div>
                    {!balHidden && (
                        <div className={`balance-diff ${diff >= 0 ? 'pos' : 'neg'}`}>
                            {diff >= 0 ? '↑' : '↓'} Neto: ${balHidden ? '••••' : <>{diff >= 0 ? '+' : '-'}{Math.abs(diff).toLocaleString('es-AR')}</>}
                        </div>
                    )}
                    <div className="balance-mini-stats">
                        <div className="balance-stat">
                            <div className="balance-stat-label">Ingresos</div>
                            <div className="balance-stat-val pos">+${formatMXN(ingresos)}</div>
                        </div>
                        <div className="balance-stat">
                            <div className="balance-stat-label">Gastos</div>
                            <div className="balance-stat-val neg">-${formatMXN(gastos)}</div>
                        </div>
                        <div className="balance-stat">
                            <div className="balance-stat-label">Suscripciones</div>
                            <div className="balance-stat-val neg">-${subsTotal.toLocaleString()}</div>
                        </div>
                    </div>
                    <div className="balance-actions">
                        <button className="btn-add-funds" onClick={() => openModal('addFunds')}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            Agregar Fondos
                        </button>
                        <button className="btn-accounts" onClick={() => openPanel('accounts')}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                            </svg>
                            Cuentas
                        </button>
                    </div>
                </div>

                {/* Weekly Digest (P3) */}
                <div className="stagger-3">
                    <WeeklyDigest activities={state.activities} formatMXN={formatMXN} />
                </div>

                {/* Vencimientos with Quick Pay (P1) */}
                <div className="section-wrap stagger-4">
                    <div className="section-header">
                        <span className="section-title">Próximos Vencimientos</span>
                        <button className="see-all" onClick={switchToSubs}>Ver todo →</button>
                    </div>

                    {/* Main vencimiento card with checkbox */}
                    <div className="venc-main">
                        <div className="venc-corner-accent" />
                        <div className="venc-main-body">
                            <div className="venc-top-row">
                                <div className="venc-left">
                                    <div
                                        className={`venc-checkbox${selectedVenc.includes('abl') ? ' checked' : ''}`}
                                        onClick={(e) => { e.stopPropagation(); toggleVenc('abl') }}
                                    >
                                        {selectedVenc.includes('abl') && (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="venc-icon-wrap">🏛️</div>
                                    <div>
                                        <div className="venc-name">ABL / Inmobiliario</div>
                                        <div className="venc-badge">⏰ Vence en 3 días</div>
                                    </div>
                                </div>
                                <div className="venc-amount-box">
                                    <div className="venc-amount-label">Monto</div>
                                    <div className="venc-amount-val">$2,400</div>
                                </div>
                            </div>
                            <div className="progress-track">
                                <div className="progress-fill" style={{ width: `${progressW}%`, background: colors.primary }} />
                            </div>
                            <div className="progress-labels"><span>85% del plazo</span><span>12 Mar</span></div>
                            <button className="btn-pay" onClick={() => handlePay('ABL / Inmobiliario', '$2,400', '🏗️')}>Pagar Ahora</button>
                        </div>
                    </div>

                    {/* Mini vencimiento cards with checkboxes */}
                    <div className="mini-venc-row">
                        <div className="mini-venc-card" onClick={() => toggleVenc('renta')}>
                            <div className="mini-dot-accent" style={{ background: colors.catBlue }} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                <div
                                    className={`venc-checkbox${selectedVenc.includes('renta') ? ' checked' : ''}`}
                                    onClick={(e) => { e.stopPropagation(); toggleVenc('renta') }}
                                >
                                    {selectedVenc.includes('renta') && (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </div>
                                <div className="mini-venc-icon">🏠</div>
                            </div>
                            <div className="mini-name">Renta Marzo</div>
                            <div className="mini-amount">$12,500</div>
                            <div className="mini-status mini-status-pending">Vence el día 5</div>
                        </div>
                        <div className="mini-venc-card" onClick={() => showToast('✅ Spotify ya fue pagado', 'success')}>
                            <div className="mini-dot-accent" style={{ background: colors.catGreen }} />
                            <div className="mini-venc-icon">🎵</div>
                            <div className="mini-name">Spotify</div>
                            <div className="mini-amount">$179</div>
                            <div className="mini-status mini-status-paid">✓ Pagado ayer</div>
                        </div>
                    </div>

                    {/* Quick Pay bar when items selected */}
                    {selectedVenc.length > 0 && selectedTotal > 0 && (
                        <div className="quick-pay-bar">
                            <div className="quick-pay-total">
                                {selectedVenc.filter(id => !VENCIMIENTOS.find(v => v.id === id)?.paid).length} seleccionados · <strong>${selectedTotal.toLocaleString()}</strong>
                            </div>
                            <button className="btn-quick-pay" onClick={paySelected}>💳 Pagar</button>
                        </div>
                    )}
                </div>

                {/* Chart */}
                <div className="chart-card stagger-5">
                    <div className="chart-legend chart-title-legend">
                        <div className="legend-item"><span className="legend-dot" style={{ background: colors.chartIncome }} /><span className="legend-text">Ingreso</span></div>
                        <div className="legend-item"><span className="legend-dot" style={{ background: colors.chartExpense }} /><span className="legend-text">Gastos</span></div>
                    </div>
                    <div className="chart-sub">{chartData[chartPeriod].subtitle}</div>
                    <div className="chart-tabs">
                        {['week', 'month', 'year'].map((p, i) => (
                            <button
                                key={p}
                                className={`chart-tab${chartPeriod === p ? ' active' : ''}`}
                                onClick={() => setChartPeriod(p)}
                            >
                                {['Semana', 'Mes', 'Año'][i]}
                            </button>
                        ))}
                    </div>
                    <BarChart period={chartPeriod} />
                </div>

                {/* Sync */}
                <div className="sync-card stagger-6" onClick={() => showToast('Sincronizando tus cuentas...', 'info')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                    <div style={{ flex: 1 }}>
                        <div className="sync-name">Sincronización Bancaria</div>
                        <div className="sync-detail">3 cuentas · Actualizado hace 5 min</div>
                    </div>
                    <div className="sync-status">
                        <div className="sync-dot" />
                        <div className="sync-label">Activo</div>
                    </div>
                </div>

                {/* Activity with temporal groups and load more */}
                <div className="home-activity-section stagger-7">
                    <div className="section-header">
                        <span className="section-title">Actividad Reciente</span>
                        <button className="see-all" onClick={() => openPanel('activity')}>Ver todo →</button>
                    </div>
                    <div className="activity-search">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input type="text" placeholder="Buscar transacción..." value={actSearch} onChange={e => setActSearch(e.target.value)} />
                    </div>
                    <div className="activity-filters">
                        {ACTIVITY_FILTERS.map(f => (
                            <button
                                key={f.key}
                                className={`act-filter-btn${actFilter === f.key ? ' active' : ''}`}
                                onClick={() => setActFilter(f.key)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                    <div className="activity-card">
                        {filteredActs.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">🔍</div>
                                <div className="empty-state-title">Sin resultados</div>
                                <div className="empty-state-sub">Intenta con otro filtro o búsqueda</div>
                            </div>
                        ) : (
                            <>
                                {groupedActs.map((item, idx) => {
                                    if (item.type === 'label') {
                                        return <div key={`label-${idx}`} className="activity-group-label">{item.label}</div>
                                    }
                                    const a = item.data
                                    return (
                                        <div key={a.id} className="activity-item" onClick={() => showToast(`${a.name}: $${Math.abs(a.amount).toLocaleString()}`, 'info')}>
                                            <div className="activity-icon" style={{ background: a.bg }}>{a.icon}</div>
                                            <div className="activity-info">
                                                <div className="activity-name">{a.name}</div>
                                                <div className="activity-meta">{a.meta}</div>
                                            </div>
                                            <div className={`activity-amount${a.amount > 0 ? ' amount-pos' : ''}`}>
                                                {a.amount > 0 ? '+' : ''}${Math.abs(a.amount).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </div>
                                        </div>
                                    )
                                })}
                                {totalFiltered > actLimit && (
                                    <button className="btn-load-more" onClick={() => setActLimit(l => l + 6)}>
                                        Cargar más ({totalFiltered - actLimit} restantes)
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div style={{ height: 28 }} />
            </div>
        </div>
    )
}
