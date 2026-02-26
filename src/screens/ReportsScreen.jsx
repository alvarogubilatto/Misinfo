import { useState, useEffect } from 'react'
import { reportData } from '../data'

function DonutChart({ period }) {
    const { slices } = reportData[period]
    const cx = 80, cy = 80, r = 64, inner = 46
    const toRad = d => d * Math.PI / 180
    let sa = -90
    const paths = slices.map((item, i) => {
        const angle = item.v * 3.6
        const ea = sa + angle
        const gap = 1.5
        const s = sa + gap, e = ea - gap
        const x1 = cx + r * Math.cos(toRad(s)), y1 = cy + r * Math.sin(toRad(s))
        const x2 = cx + r * Math.cos(toRad(e)), y2 = cy + r * Math.sin(toRad(e))
        const ix1 = cx + inner * Math.cos(toRad(s)), iy1 = cy + inner * Math.sin(toRad(s))
        const ix2 = cx + inner * Math.cos(toRad(e)), iy2 = cy + inner * Math.sin(toRad(e))
        const lg = angle > 180 ? 1 : 0
        const path = `M${x1} ${y1}A${r} ${r} 0 ${lg} 1 ${x2} ${y2}L${ix2} ${iy2}A${inner} ${inner} 0 ${lg} 0 ${ix1} ${iy1}Z`
        sa = ea
        return <path key={i} d={path} fill={item.c} style={{ animation: `screenIn 0.4s ${i * 0.08}s both` }} />
    })
    return (
        <svg className="donut-svg" viewBox="0 0 160 160">{paths}</svg>
    )
}

export default function ReportsScreen({ className, showToast, showSuccess }) {
    const [period, setPeriod] = useState('2025')
    const [dlBtnText, setDlBtnText] = useState('⬇️ Descargar Paquete Fiscal 2025')
    const data = reportData[period]

    const downloadAll = () => {
        setDlBtnText('⏳ Preparando paquete...')
        setTimeout(() => {
            setDlBtnText('⬇️ Descargar Paquete Fiscal 2025')
            showSuccess('¡Paquete listo!', '3 documentos descargados')
        }, 1800)
    }

    return (
        <div className={className}>
            <div className="reports-inner">
                <div>
                    <div className="screen-title">Reporte Fiscal</div>
                    <div className="screen-subtitle">Resumen anual para tu declaración</div>
                </div>

                <div className="report-period">
                    {['2025', '2024', '2023'].map(y => (
                        <button key={y} className={`period-tab${period === y ? ' active' : ''}`} onClick={() => setPeriod(y)}>{y}</button>
                    ))}
                </div>

                <div className="info-box">
                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>ℹ️</span>
                    <span>Estimado basado en tus gastos registrados. Consulta a tu contador antes de usarlo en tu declaración oficial.</span>
                </div>

                <div className="donut-card">
                    <div className="donut-card-title">Gastos Deducibles Estimados</div>
                    <div className="donut-wrapper">
                        <div className="donut-container">
                            <DonutChart period={period} />
                            <div className="donut-label-center">
                                <div className="donut-total-label">Total</div>
                                <div className="donut-total-val">{data.total}</div>
                            </div>
                        </div>
                    </div>
                    <div className="donut-legend">
                        {data.slices.map((s, i) => (
                            <div key={i} className="legend-row">
                                <span className="legend-circle" style={{ background: s.c }} />
                                {s.label}
                                <span className="legend-row-val">{s.val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="section-header" style={{ marginBottom: 10 }}>
                        <span className="section-title">Documentos Listos</span>
                    </div>
                    <div className="docs-card">
                        <div className="doc-item" onClick={() => showToast('📥 Descargando: Constancia de Intereses Reales')}>
                            <div className="doc-icon-wrap">📋</div>
                            <div>
                                <div className="doc-name">Constancia de Intereses Reales</div>
                                <div className="doc-date">Generado hoy</div>
                            </div>
                            <div className="doc-chip">⬇️</div>
                        </div>
                        <div className="doc-item" onClick={() => showToast('📥 Descargando: Comprobantes de Predial 2025')}>
                            <div className="doc-icon-wrap">📋</div>
                            <div>
                                <div className="doc-name">Comprobantes de Predial 2025</div>
                                <div className="doc-date">Generado hace 1 mes</div>
                            </div>
                            <div className="doc-chip">⬇️</div>
                        </div>
                        <div className="doc-item" onClick={() => showToast('📤 Seleccionar archivos para subir')}>
                            <div className="doc-icon-wrap">📤</div>
                            <div>
                                <div className="doc-name">Facturas de Mantenimiento</div>
                                <div className="doc-date" style={{ color: 'var(--orange)' }}>⚠ Faltan 2 facturas — Toca para subir</div>
                            </div>
                            <div className="doc-chip">⬆️</div>
                        </div>
                    </div>
                </div>

                <button className="btn-download-all" onClick={downloadAll}>{dlBtnText}</button>
                <div style={{ height: 28 }} />
            </div>
        </div>
    )
}
