export default function SuccessOverlay({ show, text, sub }) {
    return (
        <div className={`success-overlay${show ? ' show' : ''}`}>
            <div className="success-checkmark">✅</div>
            <div className="success-text">{text}</div>
            {sub && <div className="success-sub">{sub}</div>}
        </div>
    )
}
