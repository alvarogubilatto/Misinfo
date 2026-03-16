import { colors } from '../../design/colors'

export default function ProfileSectionNotifs() {
    return (
        <div className="panel-section-enter" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Vencimientos próximos</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Te avisamos 3 días antes</div>
                </div>
                <input type="checkbox" defaultChecked style={{ width: 22, height: 22, accentColor: colors.primary }} />
            </div>
            <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Nuevos cargos</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Alerta para cada pago en cuenta</div>
                </div>
                <input type="checkbox" defaultChecked style={{ width: 22, height: 22, accentColor: colors.primary }} />
            </div>
            <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Avisos de aumento</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Alerta por subas en suscripciones</div>
                </div>
                <input type="checkbox" defaultChecked style={{ width: 22, height: 22, accentColor: colors.primary }} />
            </div>
        </div>
    )
}
