export default function ProfileSectionOthers({ activeSection, showSuccess }) {
    if (activeSection === 'export') {
        return (
            <div className="panel-section-enter" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Seleccioná el formato para descargar el historial completo de tus actividades y configuraciones.</p>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn-save" onClick={() => {
                        showSuccess('Datos exportados', 'Archivo CSV guardado en descargas')
                    }} style={{ background: 'var(--card)' }}>Exportar a CSV</button>
                    <button className="btn-save" onClick={() => {
                        showSuccess('Datos exportados', 'Archivo PDF guardado en descargas')
                    }}>Exportar a PDF</button>
                </div>
            </div>
        )
    }

    if (activeSection === 'terms') {
        return (
            <div className="panel-section-enter" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: '16px', fontSize: 13, color: 'var(--text-muted)', maxHeight: '300px', overflowY: 'auto', lineHeight: 1.5 }}>
                    <h3 style={{ color: 'var(--text)', marginBottom: 8, fontSize: 15 }}>Términos y Condiciones</h3>
                    <p style={{ marginBottom: 12 }}>Al usar MisInfo, aceptas los términos de uso. MisInfo es una aplicación de gestión financiera personal que te permite organizar tus finanzas en Argentina.</p>
                    <h3 style={{ color: 'var(--text)', marginBottom: 8, fontSize: 15 }}>Privacidad de Datos</h3>
                    <p style={{ marginBottom: 12 }}>Tus datos financieros y la información que nos proporciones se almacena localmente y, cuando sea necesario, estará cifrada.</p>
                    <h3 style={{ color: 'var(--text)', marginBottom: 8, fontSize: 15 }}>Sincronización Bancaria</h3>
                    <p>La sincronización bancaria requiere el uso de proveedores regulados. MisInfo nunca almacena tus contraseñas directamente.</p>
                </div>
            </div>
        )
    }

    return null
}
