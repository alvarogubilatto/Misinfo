import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../utils/animations';
import { authService } from '../services/auth.service';

export default function LoginScreen() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)

    const showError = (msg: string) => {
        setError(msg)
        setTimeout(() => setError(''), 4000)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const err = await authService.login(email, password)
        setLoading(false)
        if (err) showError('Email o contraseña incorrectos')
        // Si no hay error, onAuthStateChange en App.tsx detecta la sesión automáticamente
    }

    const handleGoogle = async () => {
        setGoogleLoading(true)
        const err = await authService.loginWithGoogle()
        if (err) {
            setGoogleLoading(false)
            showError('No se pudo conectar con Google')
        }
        // Si no hay error, el redirect de OAuth se encarga del resto
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
            <motion.div
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px'
                }}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <motion.div
                        style={{
                            width: '64px',
                            height: '64px',
                            background: 'var(--grad-primary)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                            color: 'white',
                            fontSize: '28px',
                            fontWeight: 'bold',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        M
                    </motion.div>
                    <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800' }}>MisInfo</h1>
                    <p style={{ margin: '8px 0 0', color: 'var(--text-muted)' }}>Centralizá tus finanzas</p>
                </motion.div>

                {/* Google OAuth */}
                <motion.button
                    variants={itemVariants}
                    onClick={handleGoogle}
                    disabled={googleLoading || loading}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        padding: '14px 16px',
                        borderRadius: '12px',
                        border: '1.5px solid var(--border)',
                        background: 'var(--card-bg)',
                        color: 'var(--text)',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: googleLoading ? 'not-allowed' : 'pointer',
                        opacity: googleLoading ? 0.7 : 1,
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {googleLoading ? 'Conectando...' : (
                        <>
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                                <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                            </svg>
                            Continuar con Google
                        </>
                    )}
                </motion.button>

                {/* Divisor */}
                <motion.div
                    variants={itemVariants}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>o con email</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                </motion.div>

                {/* Form email/password */}
                <motion.form
                    onSubmit={handleSubmit}
                    style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                    variants={containerVariants}
                >
                    <motion.div className="form-group" variants={itemVariants}>
                        <label className="form-label">Email</label>
                        <input
                            className="form-input"
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            style={{ padding: '14px 16px', fontSize: '15px' }}
                        />
                    </motion.div>
                    <motion.div className="form-group" variants={itemVariants}>
                        <label className="form-label">Contraseña</label>
                        <input
                            className="form-input"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            style={{ padding: '14px 16px', fontSize: '15px' }}
                        />
                    </motion.div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                color: 'var(--red)',
                                backgroundColor: 'var(--cat-bg-red)',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '500',
                                textAlign: 'center'
                            }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.button
                        className="btn-save"
                        type="submit"
                        disabled={loading || googleLoading}
                        style={{
                            marginTop: '8px',
                            fontSize: '16px',
                            padding: '16px',
                            borderRadius: '12px',
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                        variants={itemVariants}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                    >
                        {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                    </motion.button>
                </motion.form>
            </motion.div>
        </div>
    )
}
