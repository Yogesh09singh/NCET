import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const navigate = useNavigate();

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    useEffect(() => {
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        if (!user || !user.roles?.includes('ROLE_ADMIN')) {
            navigate('/login');
            return;
        }
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            setLoading(true);
            const [statsRes, usersRes, ordersRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/users'),
                api.get('/admin/orders'),
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setOrders(ordersRes.data);
        } catch (e) {
            console.error(e);
            showToast('Failed to load admin data', 'error');
        } finally { setLoading(false); }
    };

    const handleDeleteUser = async (id) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            showToast('User deleted successfully!');
            fetchAll();
        } catch { showToast('Failed to delete user', 'error'); }
    };

    const roleColor = (role) => {
        if (role === 'FARMER') return { color: '#16a34a', bg: 'rgba(22,163,74,0.15)' };
        if (role === 'ADMIN') return { color: '#2563eb', bg: 'rgba(37,99,235,0.15)' };
        return { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' };
    };

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>

                {/* Header */}
                <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                    <div>
                        <h1 style={{ fontSize: '2rem', fontFamily: "'Poppins', sans-serif", fontWeight: 800 }}>
                            Admin Panel
                        </h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Platform oversight and management</p>
                    </div>
                    <div className="tab-group">
                        {[
                            { id: 'overview', label: '📊 Overview' },
                            { id: 'users', label: `👥 Users (${users.length})` },
                            { id: 'orders', label: `📋 Orders (${orders.length})` },
                        ].map(t => (
                            <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚙️</div>
                        <p>Loading platform data...</p>
                    </div>
                ) : (
                    <>
                        {/* ── OVERVIEW TAB ── */}
                        {activeTab === 'overview' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {/* Stat Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {[
                                        { icon: '👥', label: 'Total Users', value: stats?.totalUsers || 0, color: '#2563eb', bg: 'rgba(37,99,235,0.12)' },
                                        { icon: '📦', label: 'Total Products', value: stats?.totalProducts || 0, color: '#16a34a', bg: 'rgba(22,163,74,0.12)' },
                                        { icon: '📋', label: 'Total Orders', value: stats?.totalOrders || 0, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
                                        { icon: '💰', label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toFixed(0)}`, color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
                                    ].map(stat => (
                                        <div key={stat.label} className="stat-card">
                                            <div className="stat-icon" style={{ background: stat.bg }}>{stat.icon}</div>
                                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{stat.label}</p>
                                            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: stat.color, fontFamily: "'Poppins', sans-serif" }}>{stat.value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* User Role Breakdown */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="glass p-6 rounded-2xl">
                                        <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', fontFamily: "'Poppins', sans-serif" }}>👥 User Breakdown</h3>
                                        {['FARMER', 'CUSTOMER', 'ADMIN'].map(r => {
                                            const count = users.filter(u => u.role === r).length;
                                            const pct = users.length > 0 ? ((count / users.length) * 100).toFixed(0) : 0;
                                            const rc = roleColor(r);
                                            return (
                                                <div key={r} style={{ marginBottom: '1rem' }}>
                                                    <div className="flex justify-between mb-1">
                                                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: rc.color }}>{r}</span>
                                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{count} ({pct}%)</span>
                                                    </div>
                                                    <div className="progress-bar">
                                                        <div style={{ height: '100%', borderRadius: '999px', background: rc.color, width: `${pct}%`, transition: 'width 0.6s ease' }} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="glass p-6 rounded-2xl">
                                        <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', fontFamily: "'Poppins', sans-serif" }}>📋 Order Status</h3>
                                        {['PENDING', 'SHIPPED', 'DELIVERED'].map(s => {
                                            const count = orders.filter(o => o.status === s).length;
                                            const pct = orders.length > 0 ? ((count / orders.length) * 100).toFixed(0) : 0;
                                            const sc = s === 'PENDING' ? '#f59e0b' : s === 'SHIPPED' ? '#2563eb' : '#16a34a';
                                            return (
                                                <div key={s} style={{ marginBottom: '1rem' }}>
                                                    <div className="flex justify-between mb-1">
                                                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: sc }}>{s}</span>
                                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{count} orders</span>
                                                    </div>
                                                    <div className="progress-bar">
                                                        <div style={{ height: '100%', borderRadius: '999px', background: sc, width: `${pct}%`, transition: 'width 0.6s ease' }} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Recent Orders */}
                                <div className="glass p-6 rounded-2xl">
                                    <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', fontFamily: "'Poppins', sans-serif" }}>🕐 Recent Orders</h3>
                                    {orders.length === 0 ? (
                                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No orders yet.</p>
                                    ) : (
                                        <div style={{ overflowX: 'auto' }}>
                                            <table className="data-table">
                                                <thead>
                                                    <tr>
                                                        <th>Order ID</th>
                                                        <th>Customer</th>
                                                        <th>Amount</th>
                                                        <th>Status</th>
                                                        <th>Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {orders.slice(0, 10).map(order => (
                                                        <tr key={order.id}>
                                                            <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>#{order.id?.slice(-8).toUpperCase()}</td>
                                                            <td style={{ fontWeight: 600 }}>{order.customerName}</td>
                                                            <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{order.totalAmount?.toFixed(2)}</td>
                                                            <td>
                                                                <span className={`badge ${order.status === 'PENDING' ? 'badge-warning' : order.status === 'SHIPPED' ? 'badge-blue' : 'badge-success'}`}>
                                                                    {order.status}
                                                                </span>
                                                            </td>
                                                            <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                                                {new Date(order.orderDate).toLocaleDateString('en-IN')}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ── USERS TAB ── */}
                        {activeTab === 'users' && (
                            <div className="glass p-6 rounded-2xl">
                                <h2 style={{ fontWeight: 700, marginBottom: '1.5rem', fontFamily: "'Poppins', sans-serif", fontSize: '1.2rem' }}>
                                    👥 All Users ({users.length})
                                </h2>
                                <div style={{ overflowX: 'auto' }}>
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>User ID</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map(user => {
                                                const rc = roleColor(user.role);
                                                return (
                                                    <tr key={user.id}>
                                                        <td>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                                <div style={{
                                                                    width: '32px', height: '32px', borderRadius: '50%',
                                                                    background: `linear-gradient(135deg, ${rc.color}, ${rc.color}88)`,
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    fontSize: '0.8rem', fontWeight: 700, color: 'white', flexShrink: 0,
                                                                }}>{user.name?.charAt(0)?.toUpperCase()}</div>
                                                                <span style={{ fontWeight: 600 }}>{user.name}</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ color: 'var(--text-muted)' }}>{user.email}</td>
                                                        <td>
                                                            <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, color: rc.color, background: rc.bg }}>
                                                                {user.role}
                                                            </span>
                                                        </td>
                                                        <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                            {user.id?.slice(-8)}
                                                        </td>
                                                        <td>
                                                            {user.role !== 'ADMIN' && (
                                                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user.id)}>🗑 Delete</button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ── ORDERS TAB ── */}
                        {activeTab === 'orders' && (
                            <div className="glass p-6 rounded-2xl">
                                <h2 style={{ fontWeight: 700, marginBottom: '1.5rem', fontFamily: "'Poppins', sans-serif", fontSize: '1.2rem' }}>
                                    📋 All Orders ({orders.length})
                                </h2>
                                {orders.length === 0 ? (
                                    <div className="empty-state">
                                        <div className="empty-icon">📋</div>
                                        <p style={{ color: 'var(--text-muted)' }}>No orders on the platform yet.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {orders.map(order => (
                                            <div key={order.id} className="glass rounded-xl p-4" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                                                <div className="flex justify-between items-center flex-wrap gap-3">
                                                    <div>
                                                        <p style={{ fontWeight: 700 }}>#{order.id?.slice(-8).toUpperCase()}</p>
                                                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                                            {order.customerName} · {new Date(order.orderDate).toLocaleDateString('en-IN')}
                                                        </p>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>₹{order.totalAmount?.toFixed(2)}</span>
                                                        <span className={`badge ${order.status === 'PENDING' ? 'badge-warning' : order.status === 'SHIPPED' ? 'badge-blue' : 'badge-success'}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    {order.orderItems?.map((item, i) => (
                                                        <span key={i} style={{
                                                            background: 'var(--surface)', padding: '0.25rem 0.6rem',
                                                            borderRadius: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)',
                                                        }}>
                                                            {item.productName} × {item.quantity}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Toast */}
            {toast.show && (
                <div className="toast-container">
                    <div className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
                        {toast.type === 'success' ? '✓' : '⚠'} {toast.message}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
