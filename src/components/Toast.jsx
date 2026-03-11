export default function Toast({ msg, show, type }) {
    const typeClass = type ? ` toast-${type}` : ''
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' }
    const icon = type ? icons[type] || '' : ''

    return (
        <div className={`toast${show ? ' show' : ''}${typeClass}`}>
            {icon && <span className="toast-icon">{icon}</span>}
            <span className="toast-msg">{msg}</span>
        </div>
    )
}
