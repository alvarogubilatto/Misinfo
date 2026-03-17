import React, { useState } from 'react';
import { Icon } from './shared/Icon';

interface Step {
    icon: string;
    title: string;
    desc: string;
}

const STEPS: Step[] = [
    {
        icon: 'bank',
        title: 'Conectá tu banco',
        desc: 'Sincronizá tus cuentas bancarias para ver todos tus movimientos en un solo lugar, de forma automática y segura.'
    },
    {
        icon: 'news',
        title: 'Revisá tus suscripciones',
        desc: 'Te mostramos todas tus suscripciones activas, te alertamos ante aumentos de precio y detectamos las que no usás.'
    },
    {
        icon: 'ingreso',
        title: 'Conocé tu salud financiera',
        desc: 'Tu dashboard te muestra en tiempo real cómo van tus finanzas: ingresos, gastos, vencimientos y reportes fiscales.'
    }
]

interface OnboardingProps {
    show: boolean;
    onComplete: () => void;
}

export default function Onboarding({ show, onComplete }: OnboardingProps) {
    const [step, setStep] = useState(0)

    if (!show) return null

    const next = () => {
        if (step < STEPS.length - 1) setStep(step + 1)
        else onComplete()
    }

    const skip = () => onComplete()

    const s = STEPS[step]

    return (
        <div className={`onboarding-overlay${show ? ' show' : ''}`}>
            <div className="onboarding-card" key={step}>
                <div className="onboarding-step-icon">
                    <Icon name={s.icon as any} style={{ width: 48, height: 48, color: 'var(--primary)' }} />
                </div>
                <div className="onboarding-step-num">Paso {step + 1} de {STEPS.length}</div>
                <div className="onboarding-step-title">{s.title}</div>
                <div className="onboarding-step-desc">{s.desc}</div>
                <div className="onboarding-dots">
                    {STEPS.map((_, i) => (
                        <div key={i} className={`onboarding-dot${i === step ? ' active' : ''}`} />
                    ))}
                </div>
                <div className="onboarding-actions">
                    <button className="onboarding-btn skip" onClick={skip}>Omitir</button>
                    <button className="onboarding-btn next" onClick={next}>
                        {step === STEPS.length - 1 ? '¡Empezar!' : 'Siguiente'}
                    </button>
                </div>
            </div>
        </div>
    )
}
