import React from 'react';
import { Icon } from './shared/Icon';

interface ServicesModalProps {
    open: boolean;
    onClose: () => void;
    propName: string;
    handlePay: (name: string, amt: string, icon: string) => void;
    showToast: (msg: string, type?: string) => void;
}

export default function ServicesModal({ open, onClose, propName, handlePay, showToast }: ServicesModalProps) {
    const services = [
        { icon: 'servicios', bg: 'var(--cat-bg-yellow)', name: 'Electricidad', company: 'CFE', due: '● Vence en 5 días', dueClass: 'due-warn', amount: '$850', period: 'Variable', payable: true, payName: 'Electricidad CFE', payAmt: '$850' },
        { icon: 'water', bg: 'var(--cat-bg-cyan)', name: 'Agua', company: 'SACMEX', due: '● Pagado este mes', dueClass: 'due-ok', amount: '$320', period: 'Variable', payable: false, toast: 'Agua ya pagada este mes' },
        { icon: 'flame', bg: 'var(--cat-bg-orange)', name: 'Gas', company: 'Gas Natural', due: '● Pagado este mes', dueClass: 'due-ok', amount: '$480', period: 'Variable', payable: false, toast: 'Gas pagado este mes' },
        { icon: 'globe', bg: 'var(--cat-bg-green)', name: 'Internet', company: 'Telmex Infinitum', due: '● Vence en 1 día', dueClass: 'due-warn', amount: '$699', period: 'Fijo', payable: true, payName: 'Internet Telmex', payAmt: '$699' },
        { icon: 'bank', bg: 'var(--cat-bg-red)', name: 'Condominio', company: 'Administración', due: '● Vencidó hace 3 días', dueClass: 'due-warn', amount: '$1,200', period: 'Fijo', payable: true, payName: 'Condominio', payAmt: '$1,200' },
    ]

    return (
        <div className={`modal-overlay${open ? ' open' : ''}`} onClick={onClose}>
            <div className="modal-sheet" onClick={e => e.stopPropagation()}>
                <div className="modal-handle-row"><div className="modal-handle" /></div>
                <div className="modal-header">
                    <div className="modal-title">Servicios del Hogar</div>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="modal-sub">{propName}</div>
                <div className="modal-totals">
                    <div className="modal-total-card">
                        <div className="modal-total-label">Total Mensual</div>
                        <div className="modal-total-val">$3,549</div>
                    </div>
                    <div className="modal-total-card">
                        <div className="modal-total-label">Pendientes</div>
                        <div className="modal-total-count">3 pagos</div>
                    </div>
                </div>
                {services.map((s, i) => (
                    <div
                        key={i}
                        className="service-item"
                        onClick={() => s.payable ? (onClose(), setTimeout(() => handlePay(s.payName, s.payAmt, s.icon || 'servicios'), 10)) : (s.toast && showToast(s.toast))}
                    >
                        <div className="service-icon" style={{ background: s.bg }}>
                            <Icon name={s.icon as any} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div className="service-name">{s.name}</div>
                            <div className="service-company">{s.company}</div>
                            <div className={`service-due ${s.dueClass}`}>{s.due}</div>
                        </div>
                        <div>
                            <div className="service-amount">{s.amount}</div>
                            <div className="service-period">{s.period}</div>
                        </div>
                    </div>
                ))}
                <button className="btn-add-service" onClick={() => showToast('Agregar servicio próximamente')}>
                    <Icon name="plus" style={{ width: 14, height: 14, marginRight: 6, verticalAlign: 'middle', display: 'inline-block' }} />
                    Agregar servicio
                </button>
            </div>
        </div>
    )
}
