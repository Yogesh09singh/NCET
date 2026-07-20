import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/signin', { email, password });
            localStorage.setItem('user', JSON.stringify(response.data));
            if (response.data.roles?.includes('ROLE_FARMER')) {
                navigate('/farmer-dashboard');
            } else if (response.data.roles?.includes('ROLE_ADMIN')) {
                navigate('/admin-dashboard');
            } else {
                navigate('/customer-dashboard');
            }
        } catch {
            setError('Invalid email or password. Please try again.');
        } finally { setLoading(false); }
    };

    const demoCredentials = [
        { label: '👨‍🌾 Farmer Demo', email: 'ramesh@example.com', password: 'password', color: '#16a34a' },
        { label: '🛒 Customer Demo', email: 'suresh@example.com', password: 'password', color: '#f59e0b' },
        { label: '🔑 Admin Demo', email: 'admin@kisansetu.com', password: 'admin123', color: '#2563eb' },
    ];

    return (
        <div className="min-h-screen" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '2rem',
            background: 'radial-gradient(ellipse at 30% 40%, rgba(22,163,74,0.08), transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(37,99,235,0.08), transparent 50%)',
        }}>
            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <div style={{
                    width: '48px', height: '48px', background: 'linear-gradient(135deg, #16a34a, #34d399)',
                    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', boxShadow: '0 8px 20px rgba(22,163,74,0.35)',
                }}>🌾</div>
                <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: "'Poppins', sans-serif", background: 'linear-gradient(135deg, #16a34a, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Kisan Setu</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Local Farmer Market</div>
                </div>
            </Link>

            <div className="glass rounded-2xl" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
                <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.4rem' }}>Welcome back 👋</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Sign in to your Kisan Setu account</p>

                {error && (
                    <div style={{ background: 'var(--danger-light)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.6rem', padding: '0.75rem 1rem', marginBottom: '1.25rem', color: '#f87171', fontSize: '0.875rem' }}>
                        ⚠ {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label>Email Address</label>
                        <input id="login-email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <label>Password</label>
                        <input id="login-password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <button id="login-submit" type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '0.5rem' }} disabled={loading}>
                        {loading ? 'Signing in...' : '→ Sign In'}
                    </button>
                </form>

                <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Quick Access</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {demoCredentials.map(cred => (
                        <button key={cred.label} onClick={() => { setEmail(cred.email); setPassword(cred.password); }} style={{
                            padding: '0.6rem 1rem', borderRadius: '0.6rem', border: `1px solid ${cred.color}33`,
                            background: `${cred.color}12`, color: cred.color,
                            cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                            transition: 'all 0.2s', fontFamily: "'Poppins', sans-serif",
                        }}
                        onMouseOver={e => e.currentTarget.style.background = `${cred.color}22`}
                        onMouseOut={e => e.currentTarget.style.background = `${cred.color}12`}
                        >
                            {cred.label}
                        </button>
                    ))}
                </div>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign up free</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
