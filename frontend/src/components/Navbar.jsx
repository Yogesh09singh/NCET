import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const navLinkStyle = (path) => ({
        textDecoration: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        fontWeight: 600,
        fontSize: '0.9rem',
        transition: 'all 0.2s',
        color: isActive(path) ? 'var(--primary)' : 'var(--text-muted)',
        background: isActive(path) ? 'var(--primary-light)' : 'transparent',
        fontFamily: "'Poppins', sans-serif",
    });

    const getRoleBadge = () => {
        if (!user) return null;
        if (user.roles?.includes('ROLE_FARMER')) return { label: 'Farmer', color: '#16a34a', bg: 'rgba(22,163,74,0.15)' };
        if (user.roles?.includes('ROLE_ADMIN')) return { label: 'Admin', color: '#2563eb', bg: 'rgba(37,99,235,0.15)' };
        return { label: 'Customer', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' };
    };

    const badge = getRoleBadge();

    return (
        <nav style={{
            background: 'rgba(13, 21, 38, 0.9)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border)',
            padding: '0 1.5rem',
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 99,
            marginBottom: '2rem',
        }}>
            <div className="container flex justify-between items-center" style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
                {/* Logo */}
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '40px', height: '40px',
                        background: 'linear-gradient(135deg, var(--primary), #34d399)',
                        borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.3rem', boxShadow: '0 4px 12px rgba(22,163,74,0.35)'
                    }}>🌾</div>
                    <div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: "'Poppins', sans-serif", lineHeight: 1.1 }}
                             className="text-gradient">Kisan Setu</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
                            Farm to Table, Direct
                        </div>
                    </div>
                </Link>

                {/* Nav Links */}
                <div className="flex gap-2 items-center">
                    <Link to="/" style={navLinkStyle('/')}>Marketplace</Link>

                    {user ? (
                        <>
                            {user.roles?.includes('ROLE_FARMER') && (
                                <Link to="/farmer-dashboard" style={navLinkStyle('/farmer-dashboard')}>Dashboard</Link>
                            )}
                            {user.roles?.includes('ROLE_CUSTOMER') && (
                                <Link to="/customer-dashboard" style={navLinkStyle('/customer-dashboard')}>My Orders</Link>
                            )}
                            {user.roles?.includes('ROLE_ADMIN') && (
                                <Link to="/admin-dashboard" style={navLinkStyle('/admin-dashboard')}>Admin Panel</Link>
                            )}

                            {/* User Info */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '0.6rem',
                                padding: '0.4rem 0.75rem',
                                background: 'var(--surface)',
                                borderRadius: '0.6rem',
                                border: '1px solid var(--border)',
                                marginLeft: '0.5rem'
                            }}>
                                <div style={{
                                    width: '30px', height: '30px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--primary), #34d399)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.75rem', fontWeight: 700, color: 'white'
                                }}>
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.2 }}>{user.name}</div>
                                    {badge && (
                                        <div style={{
                                            fontSize: '0.65rem', fontWeight: 700,
                                            color: badge.color, background: badge.bg,
                                            padding: '0.1rem 0.4rem', borderRadius: '999px',
                                            display: 'inline-block'
                                        }}>{badge.label}</div>
                                    )}
                                </div>
                            </div>

                            <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ marginLeft: '0.25rem' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
