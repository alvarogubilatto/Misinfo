export default function ConfirmModal({ open, icon, title, body, confirmText, cancelText, onConfirm, onCancel, variant = 'danger' }) {
    return (
        <div className={`confirm-overlay${open ? ' open' : ''}`} onClick={onCancel}>
            <div className="confirm-card" onClick={e => e.stopPropagation()}>
                <div className="confirm-icon">{icon || '⚠️'}</div>
                <div className="confirm-title">{title}</div>
                <div className="confirm-body">{body}</div>
                <div className="confirm-actions">
                    <button className="confirm-btn cancel" onClick={onCancel}>{cancelText || 'Cancelar'}</button>
                    <button className={`confirm-btn ${variant}`} onClick={onConfirm}>{confirmText || 'Confirmar'}</button>
                </div>
            </div>
        </div>
    )
}
