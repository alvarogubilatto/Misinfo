import { useState, useEffect, useRef } from 'react'
import { chartData } from '../data'

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

export default function HomeScreen({
    className, state, setState, showToast, toggleDarkMode,
    openPanel, openModal, switchToSubs, handlePay, formatMXN
}) {
    const [chartPeriod, setChartPeriod] = useState('week')
    const [balHidden, setBalHidden] = useState(state.balanceHidden)
    const [progressW, setProgressW] = useState(0)

    useEffect(() => { setTimeout(() => setProgressW(85), 500) }, [])

    const ingresos = state.activities.filter(a => a.amount > 0).reduce((s, a) => s + a.amount, 0)
    const gastos = state.activities.filter(a => a.amount < 0 && a.cat !== 'servicios').reduce((s, a) => s + Math.abs(a.amount), 0)
    const subsTotal = state.subs.filter(s => !s.paused).reduce((a, s) => a + s.price, 0)

    const [actSearch, setActSearch] = useState('')
    const [actFilter, setActFilter] = useState('all')

    const filteredActs = state.activities
        .filter(a => actFilter === 'all' || a.cat === actFilter)
        .filter(a => !actSearch || a.name.toLowerCase().includes(actSearch.toLowerCase()) || a.meta.toLowerCase().includes(actSearch.toLowerCase()))
        .slice(0, 8)

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

    return (
        <div className={className}>
            <div className="home-inner">
                {/* Top bar */}
                <div className="top-bar">
                    <div className="user-info">
                        <div className="avatar" onClick={() => openPanel('profile')}>
                            {(state.userName || 'A')[0].toUpperCase()}
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

                {/* Balance card */}
                <div className="balance-card">
                    <div className="balance-label">Saldo Total</div>
                    <div className="balance-row">
                        <div className="balance-amount">
                            ${balHidden ? '•••,•••' : formatMXN(state.balance)}
                            {!balHidden && <span className="balance-cents">.00</span>}
                        </div>
                        <button className="balance-eye-btn" onClick={() => setBalHidden(h => !h)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                {eyeSvg}
                            </svg>
                        </button>
                    </div>
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
                        <button className="btn-add-funds" onClick={() => openModal('addFunds')}>+ Agregar Fondos</button>
                        <button className="btn-accounts" onClick={() => openPanel('accounts')}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                            </svg>
                            Cuentas
                        </button>
                    </div>
                </div>

                {/* Vencimientos */}
                <div className="section-wrap">
                    <div className="section-header">
                        <span className="section-title">Próximos Vencimientos</span>
                        <button className="see-all" onClick={switchToSubs}>Ver todo →</button>
                    </div>
                    <div className="venc-main">
                        <div className="venc-corner-accent" />
                        <div className="venc-main-body">
                            <div className="venc-top-row">
                                <div className="venc-left">
                                    <div className="venc-icon-wrap">🏛️</div>
                                    <div>
                                        <div className="venc-name">Impuesto Predial</div>
                                        <div className="venc-badge">⏰ Vence en 3 días</div>
                                    </div>
                                </div>
                                <div className="venc-amount-box">
                                    <div className="venc-amount-label">Monto</div>
                                    <div className="venc-amount-val">$2,400</div>
                                </div>
                            </div>
                            <div className="progress-track">
                                <div className="progress-fill" style={{ width: `${progressW}%`, background: 'linear-gradient(90deg,#ff6000,#ff9940)' }} />
                            </div>
                            <div className="progress-labels"><span>85% del plazo</span><span>12 Mar</span></div>
                            <button className="btn-pay" onClick={() => handlePay('Impuesto Predial', '$2,400', '🏛️')}>Pagar Ahora</button>
                        </div>
                    </div>
                    <div className="mini-venc-row">
                        <div className="mini-venc-card" onClick={() => handlePay('Renta Marzo', '$12,500', '🏠')}>
                            <div className="mini-dot-accent" style={{ background: '#eff6ff' }} />
                            <div className="mini-venc-icon">🏠</div>
                            <div className="mini-name">Renta Marzo</div>
                            <div className="mini-amount">$12,500</div>
                            <div className="mini-status mini-status-pending">Vence el día 5</div>
                        </div>
                        <div className="mini-venc-card" onClick={() => showToast('✅ Spotify ya fue pagado')}>
                            <div className="mini-dot-accent" style={{ background: '#f0fdf4' }} />
                            <div className="mini-venc-icon">🎵</div>
                            <div className="mini-name">Spotify</div>
                            <div className="mini-amount">$179</div>
                            <div className="mini-status mini-status-paid">✓ Pagado ayer</div>
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="chart-card">
                    <div className="chart-title">Flujo de Efectivo</div>
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
                    <div className="chart-legend">
                        <div className="legend-item"><span className="legend-dot" style={{ background: '#6c35de' }} />Ingresos</div>
                        <div className="legend-item"><span className="legend-dot" style={{ background: '#f05096' }} />Gastos</div>
                    </div>
                </div>

                {/* Sync */}
                <div className="sync-card" onClick={() => showToast('🔄 Sincronizando...')}>
                    <div style={{ fontSize: 24 }}>🏦</div>
                    <div style={{ flex: 1 }}>
                        <div className="sync-name">Sincronización Bancaria</div>
                        <div className="sync-detail">3 cuentas · Actualizado hace 5 min</div>
                    </div>
                    <div className="sync-status">
                        <div className="sync-dot" />
                        <div className="sync-label">Activo</div>
                    </div>
                </div>

                {/* Activity */}
                <div className="home-activity-section">
                    <div className="section-header">
                        <span className="section-title">Actividad Reciente</span>
                        <button className="see-all" onClick={() => showToast('📊 Historial completo próximamente')}>Ver todo →</button>
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
                        ) : filteredActs.map(a => (
                            <div key={a.id} className="activity-item" onClick={() => showToast(`${a.name}: $${Math.abs(a.amount).toLocaleString()}`)}>
                                <div className="activity-icon" style={{ background: a.bg }}>{a.icon}</div>
                                <div className="activity-info">
                                    <div className="activity-name">{a.name}</div>
                                    <div className="activity-meta">{a.meta}</div>
                                </div>
                                <div className={`activity-amount${a.amount > 0 ? ' amount-pos' : ''}`}>
                                    {a.amount > 0 ? '+' : ''}${Math.abs(a.amount).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ height: 28 }} />
            </div>
        </div>
    )
}
