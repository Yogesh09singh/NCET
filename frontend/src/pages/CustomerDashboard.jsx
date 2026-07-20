import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const STATUS_STEPS = ['PENDING', 'SHIPPED', 'DELIVERED'];

const OrderTimeline = ({ status }) => {
    const currentIdx = STATUS_STEPS.indexOf(status);
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginTop: '0.75rem' }}>
            {STATUS_STEPS.map((step, i) => (
                <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < STATUS_STEPS.length - 1 ? 1 : 'none' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.9rem',
                            background: i <= currentIdx
                                ? (i === currentIdx ? 'linear-gradient(135deg, var(--primary), #15803d)' : 'rgba(22,163,74,0.25)')
                                : 'var(--surface)',
                            border: i <= currentIdx ? '2px solid var(--primary)' : '2px solid var(--border)',
                            transition: 'all 0.3s',
                        }}>
                            {i < currentIdx ? '✓' : i === currentIdx ? '●' : '○'}
                        </div>
                        <span style={{
                            fontSize: '0.65rem', marginTop: '0.3rem', fontWeight: 600,
                            color: i <= currentIdx ? 'var(--primary)' : 'var(--text-muted)',
                            textTransform: 'uppercase', letterSpacing: '0.05em',
                            whiteSpace: 'nowrap',
                        }}>{step}</span>
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                        <div style={{
                            flex: 1, height: '2px', margin: '0 0.25rem',
                            background: i < currentIdx ? 'var(--primary)' : 'var(--border)',
                            transition: 'all 0.3s', marginBottom: '1.2rem',
                        }} />
                    )}
                </div>
            ))}
        </div>
    );
};

const CustomerDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders');
                setOrders(res.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchOrders();
    }, []);

    const totalSpent = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const deliveredCount = orders.filter(o => o.status === 'DELIVERED').length;
    const pendingCount = orders.filter(o => o.status === 'PENDING').length;

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>

                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontFamily: "'Poppins', sans-serif", fontWeight: 800 }}>My Orders</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Track all your purchases from farm to doorstep</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {[
                        { icon: '🛒', label: 'Total Orders', value: orders.length, color: '#2563eb', bg: 'rgba(37,99,235,0.12)' },
                        { icon: '✅', label: 'Delivered', value: deliveredCount, color: '#16a34a', bg: 'rgba(22,163,74,0.12)' },
                        { icon: '💰', label: 'Total Spent', value: `₹${totalSpent.toFixed(2)}`, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
                    ].map(stat => (
                        <div key={stat.label} className="stat-card">
                            <div className="stat-icon" style={{ background: stat.bg }}>{stat.icon}</div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{stat.label}</p>
                            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: stat.color, fontFamily: "'Poppins', sans-serif" }}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Orders List */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛒</div>
                        <p>Loading your orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="empty-state glass rounded-2xl">
                        <div className="empty-icon">🛒</div>
                        <h3 className="text-xl font-bold">No orders yet</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Head to the marketplace to buy fresh produce directly from farmers!</p>
                        <a href="/" className="btn btn-primary">Browse Marketplace</a>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {orders.map(order => (
                            <div key={order.id} className="glass rounded-2xl p-6">
                                {/* Order Header */}
                                <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                                    <div>
                                        <p style={{ fontWeight: 700, fontSize: '1rem' }}>
                                            Order #{order.id?.slice(-8).toUpperCase()}
                                        </p>
                                        <p className="text-sm" style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                            Placed on {new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', fontFamily: "'Poppins', sans-serif" }}>
                                            ₹{order.totalAmount?.toFixed(2)}
                                        </p>
                                        <span className={`badge ${
                                            order.status === 'PENDING' ? 'badge-warning' :
                                            order.status === 'SHIPPED' ? 'badge-blue' :
                                            order.status === 'DELIVERED' ? 'badge-success' : 'badge-gray'
                                        }`}>{order.status}</span>
                                    </div>
                                </div>

                                {/* Tracking Timeline */}
                                {order.status !== 'CANCELLED' && (
                                    <div style={{ background: 'var(--surface)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1rem' }}>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            📍 Order Tracking
                                        </p>
                                        <OrderTimeline status={order.status} />
                                    </div>
                                )}

                                {/* Order Items */}
                                <div>
                                    <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Items</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {order.orderItems?.map((item, i) => (
                                            <div key={i} style={{
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                padding: '0.6rem 0.75rem', background: 'var(--surface)',
                                                borderRadius: '0.6rem', fontSize: '0.9rem',
                                            }}>
                                                <div>
                                                    <span style={{ fontWeight: 600 }}>{item.productName}</span>
                                                    <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>× {item.quantity} {item.productUnit}</span>
                                                </div>
                                                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Farmer Info */}
                                {order.orderItems?.[0]?.farmerName && (
                                    <p className="text-sm" style={{ color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                                        👨‍🌾 Fulfilled by: <strong style={{ color: 'var(--text-main)' }}>{order.orderItems[0].farmerName}</strong>
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDashboard;
