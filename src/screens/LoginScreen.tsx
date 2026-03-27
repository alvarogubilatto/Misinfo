import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../utils/animations';

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
                            fontSize: '32px',
                            fontWeight: 'bold',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <img src="/pwa-512x512.png" alt="VOXU Logo" style={{ width: '100%', height: '100%', borderRadius: '16px' }} />
                    </motion.div>
                    <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800' }}>VOXU</h1>
                    <p style={{ margin: '8px 0 0', color: 'var(--text-muted)' }}>Bienvenido de nuevo</p>
                </motion.div>

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
                        style={{ marginTop: '8px', fontSize: '16px', padding: '16px', borderRadius: '12px' }}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Iniciar Sesión
                    </motion.button>
                </motion.form>
            </motion.div>
        </div>
    )
}
