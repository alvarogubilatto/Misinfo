export default function NotifPanel({ open, onClose }) {
    const notifs = [
        { border: 'var(--orange)', title: '⏰ Impuesto Predial vence en 3 días', body: 'Tu pago de $2,400 vence el 12 de marzo.', time: 'Hace 2 horas' },
        { border: 'var(--red)', title: '📈 Adobe CC sube de precio', body: 'Adobe CC aumentará a $749 el próximo mes.', time: 'Hace 5 horas' },
        { border: 'var(--green)', title: '✅ Spotify pagado correctamente', body: 'Se realizó el cargo de $179 con tu tarjeta terminación 4321.', time: 'Ayer, 8:00 PM' },
        { border: 'var(--primary)', title: '🏦 Sincronización completada', body: 'Tus 3 cuentas bancarias fueron actualizadas.', time: 'Hace 1 día' },
    ]

    return (
        <div className={`side-panel-overlay${open ? ' open' : ''}`} onClick={onClose}>
            <div className="side-panel" onClick={e => e.stopPropagation()}>
                <div className="side-panel-header">
                    <div className="side-panel-title">Notificaciones</div>
                    <button className="panel-close" onClick={onClose}>✕</button>
                </div>
                {notifs.map((n, i) => (
                    <div key={i} style={{ background: 'var(--bg)', borderRadius: 14, padding: 14, borderLeft: `4px solid ${n.border}` }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>{n.title}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{n.body}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 8, fontWeight: 600 }}>{n.time}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
