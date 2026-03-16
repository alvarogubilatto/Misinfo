export default function ProfileLogoutDialog({ open, onCancel, onConfirm }) {
    if (!open) return null

    return (
        <div className={`confirm-overlay open`} onClick={onCancel} style={{ position: 'fixed', zIndex: 10001 }}>
            <div className="confirm-card" onClick={e => e.stopPropagation()}>
                <div className="confirm-icon">🔒</div>
                <div className="confirm-title">¿Cerrar sesión?</div>
                <div className="confirm-body">Tendrás que ingresar tus credenciales nuevamente para acceder a tu cuenta.</div>
                <div className="confirm-actions">
                    <button className="confirm-btn cancel" onClick={onCancel}>Cancelar</button>
                    <button className="confirm-btn danger" onClick={onConfirm}>Cerrar sesión</button>
                </div>
            </div>
        </div>
    )
}
