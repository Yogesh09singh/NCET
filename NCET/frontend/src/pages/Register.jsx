import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const ROLES = [
    { value: 'CUSTOMER', icon: '🛒', label: 'Customer', desc: 'Buy fresh produce directly from farmers' },
    { value: 'FARMER', icon: '👨‍🌾', label: 'Farmer', desc: 'List and sell your agricultural products' },
];

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('CUSTOMER');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/signup', { name, email, password, role });
            navigate('/login');
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed. Try a different email.';
            setError(msg);
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '2rem',
            background: 'radial-gradient(ellipse at 70% 30%, rgba(37,99,235,0.08), transparent 50%), radial-gradient(ellipse at 30% 70%, rgba(22,163,74,0.08), transparent 50%)',
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

            <div className="glass rounded-2xl" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
                <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.4rem' }}>Create Account 🌱</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Join the farm-to-table revolution</p>

                {error && (
                    <div style={{ background: 'var(--danger-light)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.6rem', padding: '0.75rem 1rem', marginBottom: '1.25rem', color: '#f87171', fontSize: '0.875rem' }}>
                        ⚠ {error}
                    </div>
                )}

                {/* Role Selector */}
                <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ marginBottom: '0.6rem' }}>I am a...</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        {ROLES.map(r => (
                            <button key={r.value} type="button" onClick={() => setRole(r.value)} style={{
                                padding: '1rem',
                                border: `2px solid ${role === r.value ? 'var(--primary)' : 'var(--border)'}`,
                                borderRadius: '0.75rem',
                                background: role === r.value ? 'var(--primary-light)' : 'rgba(10,15,26,0.5)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textAlign: 'center',
                            }}>
                                <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>{r.icon}</div>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: role === r.value ? 'var(--primary)' : 'var(--text-main)' }}>{r.label}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: 1.3 }}>{r.desc}</div>
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label>Full Name</label>
                        <input id="reg-name" type="text" placeholder="Ramesh Patil" value={name} onChange={e => setName(e.target.value)} required pattern="^[A-Za-z\s]{3,50}$" title="Name should contain only letters and spaces (3-50 chars)" />
                    </div>
                    <div>
                        <label>Email Address</label>
                        <input id="reg-email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$" title="Please enter a valid email address" />
                    </div>
                    <div>
                        <label>Password</label>
                        <input id="reg-password" type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} maxLength={50} />
                    </div>
                    <button id="reg-submit" type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '0.5rem' }} disabled={loading}>
                        {loading ? 'Creating Account...' : '🌱 Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
