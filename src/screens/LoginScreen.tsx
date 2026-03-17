import React, { useState } from 'react';

interface LoginScreenProps {
    onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (email === 'admin@voxu.com' && password === 'voxu123') {
            onLogin()
        } else {
            setError('Credenciales incorrectas')
            setTimeout(() => setError(''), 3000)
        }
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            flex: 1,
            padding: '24px',
            background: 'var(--bg)',
            color: 'var(--text)'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'var(--grad-primary)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                        color: 'white',
                        fontSize: '32px',
                        fontWeight: 'bold',
                        boxShadow: 'var(--shadow-sm)'
                    } as React.CSSProperties}>
                        V
                    </div>
                    <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800' }}>VOXU</h1>
                    <p style={{ margin: '8px 0 0', color: 'var(--text-muted)' }}>Bienvenido de nuevo</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            className="form-input"
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ padding: '14px 16px', fontSize: '15px' }}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Contraseña</label>
                        <input
                            className="form-input"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ padding: '14px 16px', fontSize: '15px' }}
                        />
                    </div>

                    {error && (
                        <div style={{
                            color: 'var(--red)',
                            backgroundColor: 'var(--cat-bg-red)',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <button className="btn-save" type="submit" style={{ marginTop: '8px', fontSize: '16px', padding: '16px', borderRadius: '12px' }}>
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    )
}
