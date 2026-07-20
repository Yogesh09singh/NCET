import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const FarmerDashboard = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [editProduct, setEditProduct] = useState(null);

    // Add Product form state
    const [form, setForm] = useState({
        name: '', description: '', price: '', quantity: '',
        imageUrl: '', category: 'Vegetables', location: '', unit: 'kg', status: 'Available',
    });

    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const fetchProducts = async () => {
        try { const r = await api.get('/products/farmer'); setProducts(r.data); } catch (e) { showToast('Failed to load products', 'error'); }
    };
    const fetchOrders = async () => {
        try { const r = await api.get('/orders/farmer'); setOrders(r.data); } catch (e) { showToast('Failed to load orders', 'error'); }
    };
    const fetchAnalytics = async () => {
        try { const r = await api.get('/products/analytics'); setAnalytics(r.data); } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchProducts();
        fetchOrders();
        fetchAnalytics();
    }, []);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await api.post('/products', {
                ...form,
                price: parseFloat(form.price),
                quantity: parseInt(form.quantity),
            });
            showToast('Product added successfully!');
            setForm({ name: '', description: '', price: '', quantity: '', imageUrl: '', category: 'Vegetables', location: '', unit: 'kg', status: 'Available' });
            fetchProducts();
            fetchAnalytics();
        } catch { showToast('Failed to add product', 'error'); }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/products/${editProduct.id}`, {
                ...editProduct,
                price: parseFloat(editProduct.price),
                quantity: parseInt(editProduct.quantity),
            });
            showToast('Product updated!');
            setEditProduct(null);
            fetchProducts();
            fetchAnalytics();
        } catch { showToast('Failed to update product', 'error'); }
    };

    const handleDeleteProduct = async (id) => {
        try {
            await api.delete(`/products/${id}`);
            showToast('Product deleted!');
            fetchProducts();
            fetchAnalytics();
        } catch { showToast('Failed to delete', 'error'); }
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            showToast(`Order marked as ${newStatus}!`);
            fetchOrders();
        } catch { showToast('Failed to update order status', 'error'); }
    };

    const totalRevenue = orders
        .filter(o => o.status !== 'CANCELLED')
        .reduce((sum, o) => {
            const myItems = o.orderItems?.filter(i => i.farmerId === JSON.parse(localStorage.getItem('user'))?.id) || [];
            return sum + myItems.reduce((s, i) => s + (i.price * i.quantity), 0);
        }, 0);

    const pendingOrders = orders.filter(o => o.status === 'PENDING').length;

    const CATEGORY_COLORS = {
        Vegetables: '#16a34a', Fruits: '#f59e0b', Grains: '#8b5cf6', Dairy: '#3b82f6', Other: '#6b7280'
    };

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>

                {/* Header */}
                <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                    <div>
                        <h1 style={{ fontSize: '2rem', fontFamily: "'Poppins', sans-serif", fontWeight: 800 }}>
                            Farmer Dashboard
                        </h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Manage your products, orders and analytics</p>
                    </div>
                    <div className="tab-group">
                        {[
                            { id: 'products', label: '📦 Products' },
                            { id: 'orders', label: `📋 Orders${pendingOrders > 0 ? ` (${pendingOrders})` : ''}` },
                            { id: 'analytics', label: '📊 Analytics' },
                        ].map(t => (
                            <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { icon: '📦', label: 'Total Products', value: products.length, color: '#16a34a', bg: 'rgba(22,163,74,0.12)' },
                        { icon: '📋', label: 'Total Orders', value: orders.length, color: '#2563eb', bg: 'rgba(37,99,235,0.12)' },
                        { icon: '⏳', label: 'Pending Orders', value: pendingOrders, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
                        { icon: '💰', label: 'Revenue Earned', value: `₹${totalRevenue.toFixed(0)}`, color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
                    ].map(stat => (
                        <div key={stat.label} className="stat-card">
                            <div className="stat-icon" style={{ background: stat.bg }}>{stat.icon}</div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{stat.label}</p>
                            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: stat.color, fontFamily: "'Poppins', sans-serif" }}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* ── PRODUCTS TAB ── */}
                {activeTab === 'products' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Add Product Form */}
                        <div className="glass p-6 rounded-2xl md:col-span-1" style={{ height: 'fit-content' }}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', fontFamily: "'Poppins', sans-serif" }}>
                                ➕ Add New Product
                            </h2>
                            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div><label>Product Name</label><input placeholder="e.g. Fresh Tomatoes" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required pattern="^[A-Za-z0-9\s\-,.&()]{3,100}$" title="Product name (3-100 characters, alphanumeric and basic punctuation)" /></div>
                                <div><label>Description</label><textarea rows="2" placeholder="Describe your product..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required minLength={10} maxLength={1000} /></div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label>Price (₹)</label><input type="number" placeholder="0" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} required min="1" step="0.01" /></div>
                                    <div><label>Quantity</label><input type="number" placeholder="0" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} required min="1" step="1" /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label>Category</label>
                                        <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                                            {['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Other'].map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div><label>Unit</label>
                                        <select value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}>
                                            {['kg', 'tons', 'packets', 'liters', 'dozen'].map(u => <option key={u}>{u}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div><label>Location</label><input placeholder="e.g. Nashik, Maharashtra" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} required pattern="^[A-Za-z0-9\s\-,.()]+$" title="Valid location format required (letters, numbers, basic punctuation)" /></div>
                                <div><label>Image URL (optional)</label><input type="url" placeholder="https://..." value={form.imageUrl} onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))} pattern="https?://.+" title="Must start with http:// or https://" /></div>
                                <div><label>Status</label>
                                    <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                                        <option>Available</option><option>Sold Out</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary mt-2">Add Product</button>
                            </form>
                        </div>

                        {/* Products List */}
                        <div className="md:col-span-2">
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', fontFamily: "'Poppins', sans-serif" }}>
                                📦 My Products ({products.length})
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {products.map(p => (
                                    <div key={p.id} className="glass rounded-xl overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ height: '140px', position: 'relative', overflow: 'hidden' }}>
                                            {p.imageUrl ? <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', background: 'var(--surface)' }}>🌾</div>}
                                            <span className={`badge ${p.status === 'Available' ? 'badge-success' : 'badge-danger'}`} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>{p.status}</span>
                                            <span className="badge badge-blue" style={{ position: 'absolute', top: '0.5rem', left: '0.5rem' }}>{p.category}</span>
                                        </div>
                                        <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <h3 style={{ fontWeight: 700 }}>{p.name}</h3>
                                            <p className="text-sm line-clamp-2" style={{ color: 'var(--text-muted)' }}>{p.description}</p>
                                            <div className="flex justify-between items-center mt-auto" style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                                                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>₹{p.price}</span>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{p.quantity} {p.unit}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="btn btn-outline btn-sm flex-1" onClick={() => setEditProduct({ ...p })}>✏️ Edit</button>
                                                <button className="btn btn-danger btn-sm flex-1" onClick={() => handleDeleteProduct(p.id)}>🗑 Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {products.length === 0 && (
                                    <div className="empty-state glass rounded-xl" style={{ gridColumn: '1/-1' }}>
                                        <div className="empty-icon">📦</div>
                                        <p style={{ color: 'var(--text-muted)' }}>No products yet. Add your first product!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── ORDERS TAB ── */}
                {activeTab === 'orders' && (
                    <div className="glass rounded-2xl p-6">
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', fontFamily: "'Poppins', sans-serif" }}>
                            📋 Incoming Orders
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {orders.map(order => {
                                const userId = JSON.parse(localStorage.getItem('user'))?.id;
                                const myItems = order.orderItems?.filter(i => i.farmerId === userId) || [];
                                return (
                                    <div key={order.id} className="glass rounded-xl p-5" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                                        <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
                                            <div>
                                                <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>Order #{order.id?.slice(-8).toUpperCase()}</p>
                                                <p className="text-sm" style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                                    {new Date(order.orderDate).toLocaleString('en-IN')}
                                                </p>
                                                <p className="text-sm" style={{ marginTop: '0.3rem' }}>
                                                    Customer: <strong>{order.customerName}</strong> · {order.customerEmail}
                                                </p>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                                <span className={`badge ${order.status === 'PENDING' ? 'badge-warning' : order.status === 'SHIPPED' ? 'badge-blue' : 'badge-success'}`}>
                                                    {order.status}
                                                </span>
                                                {order.status === 'PENDING' && (
                                                    <button className="btn btn-primary btn-sm" onClick={() => handleUpdateOrderStatus(order.id, 'SHIPPED')}>
                                                        🚚 Mark Shipped
                                                    </button>
                                                )}
                                                {order.status === 'SHIPPED' && (
                                                    <button className="btn btn-sm" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white' }} onClick={() => handleUpdateOrderStatus(order.id, 'DELIVERED')}>
                                                        ✅ Mark Delivered
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ background: 'var(--surface)', borderRadius: '0.75rem', padding: '0.75rem' }}>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>YOUR ITEMS IN THIS ORDER</p>
                                            {myItems.map((item, i) => (
                                                <div key={i} className="flex justify-between items-center py-2" style={{ borderBottom: i < myItems.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                                    <span className="text-sm">{item.productName} × {item.quantity} {item.productUnit}</span>
                                                    <span className="text-sm font-bold" style={{ color: 'var(--primary)' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                            {orders.length === 0 && (
                                <div className="empty-state">
                                    <div className="empty-icon">📋</div>
                                    <p style={{ color: 'var(--text-muted)' }}>No orders yet for your products.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── ANALYTICS TAB ── */}
                {activeTab === 'analytics' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Category Breakdown */}
                            <div className="glass p-6 rounded-2xl">
                                <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', fontFamily: "'Poppins', sans-serif" }}>📊 Products by Category</h3>
                                {analytics?.categoryCount ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {Object.entries(analytics.categoryCount).map(([cat, count]) => {
                                            const total = Object.values(analytics.categoryCount).reduce((a, b) => a + b, 0);
                                            const pct = total > 0 ? ((count / total) * 100).toFixed(0) : 0;
                                            return (
                                                <div key={cat}>
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{cat}</span>
                                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{count} products ({pct}%)</span>
                                                    </div>
                                                    <div className="progress-bar">
                                                        <div className="progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${CATEGORY_COLORS[cat] || '#6b7280'}, ${CATEGORY_COLORS[cat] || '#6b7280'}88)` }} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : <p style={{ color: 'var(--text-muted)' }}>No analytics data yet.</p>}
                            </div>

                            {/* Inventory Value */}
                            <div className="glass p-6 rounded-2xl">
                                <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', fontFamily: "'Poppins', sans-serif" }}>💰 Inventory Value by Category</h3>
                                {analytics?.categoryRevenue ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {Object.entries(analytics.categoryRevenue).sort((a, b) => b[1] - a[1]).map(([cat, rev]) => (
                                            <div key={cat} className="flex justify-between items-center p-3 rounded-lg" style={{ background: 'var(--surface)' }}>
                                                <div className="flex items-center gap-2">
                                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: CATEGORY_COLORS[cat] || '#6b7280' }} />
                                                    <span style={{ fontWeight: 600 }}>{cat}</span>
                                                </div>
                                                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{rev.toFixed(0)}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center p-3 rounded-lg" style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.25)' }}>
                                            <span style={{ fontWeight: 700 }}>Total Inventory Value</span>
                                            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>₹{(analytics.totalInventoryValue || 0).toFixed(0)}</span>
                                        </div>
                                    </div>
                                ) : <p style={{ color: 'var(--text-muted)' }}>No data available.</p>}
                            </div>
                        </div>

                        {/* Orders Performance */}
                        <div className="glass p-6 rounded-2xl">
                            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', fontFamily: "'Poppins', sans-serif" }}>📈 Order Performance</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { label: 'Total Orders', value: orders.length, icon: '📋' },
                                    { label: 'Delivered', value: orders.filter(o => o.status === 'DELIVERED').length, icon: '✅' },
                                    { label: 'Pending', value: orders.filter(o => o.status === 'PENDING').length, icon: '⏳' },
                                ].map(s => (
                                    <div key={s.label} style={{ textAlign: 'center', padding: '1.25rem', background: 'var(--surface)', borderRadius: '0.75rem' }}>
                                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                                        <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: "'Poppins', sans-serif" }}>{s.value}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Product Modal */}
            {editProduct && (
                <>
                    <div className="cart-overlay" onClick={() => setEditProduct(null)} />
                    <div style={{
                        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        background: 'var(--surface)', borderRadius: '1.25rem', border: '1px solid var(--border)',
                        padding: '2rem', width: '90%', maxWidth: '500px', maxHeight: '90vh',
                        overflowY: 'auto', zIndex: 200, boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    }}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.25rem' }}>✏️ Edit Product</h2>
                            <button className="btn-ghost btn-sm" onClick={() => setEditProduct(null)} style={{ fontSize: '1.2rem', padding: '0.3rem 0.6rem', borderRadius: '0.4rem', border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--text-muted)' }}>✕</button>
                        </div>
                        <form onSubmit={handleUpdateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div><label>Product Name</label><input value={editProduct.name} onChange={e => setEditProduct(p => ({ ...p, name: e.target.value }))} required pattern="^[A-Za-z0-9\s\-,.&()]{3,100}$" title="Product name (3-100 characters, alphanumeric and basic punctuation)" /></div>
                            <div><label>Description</label><textarea rows="2" value={editProduct.description} onChange={e => setEditProduct(p => ({ ...p, description: e.target.value }))} required minLength={10} maxLength={1000} /></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label>Price (₹)</label><input type="number" value={editProduct.price} onChange={e => setEditProduct(p => ({ ...p, price: e.target.value }))} required min="1" step="0.01" /></div>
                                <div><label>Quantity</label><input type="number" value={editProduct.quantity} onChange={e => setEditProduct(p => ({ ...p, quantity: e.target.value }))} required min="1" step="1" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label>Category</label>
                                    <select value={editProduct.category} onChange={e => setEditProduct(p => ({ ...p, category: e.target.value }))}>
                                        {['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Other'].map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div><label>Unit</label>
                                    <select value={editProduct.unit} onChange={e => setEditProduct(p => ({ ...p, unit: e.target.value }))}>
                                        {['kg', 'tons', 'packets', 'liters', 'dozen'].map(u => <option key={u}>{u}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div><label>Location</label><input value={editProduct.location} onChange={e => setEditProduct(p => ({ ...p, location: e.target.value }))} required pattern="^[A-Za-z0-9\s\-,.()]+$" title="Valid location format required (letters, numbers, basic punctuation)" /></div>
                            <div><label>Image URL</label><input type="url" value={editProduct.imageUrl || ''} onChange={e => setEditProduct(p => ({ ...p, imageUrl: e.target.value }))} pattern="https?://.+" title="Must start with http:// or https://" /></div>
                            <div><label>Status</label>
                                <select value={editProduct.status} onChange={e => setEditProduct(p => ({ ...p, status: e.target.value }))}>
                                    <option>Available</option><option>Sold Out</option>
                                </select>
                            </div>
                            <div className="flex gap-3 mt-2">
                                <button type="button" className="btn btn-outline flex-1" onClick={() => setEditProduct(null)}>Cancel</button>
                                <button type="submit" className="btn btn-primary flex-1">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </>
            )}

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

const CATEGORY_COLORS = {
    Vegetables: '#16a34a', Fruits: '#f59e0b', Grains: '#8b5cf6', Dairy: '#3b82f6', Other: '#6b7280'
};

export default FarmerDashboard;
