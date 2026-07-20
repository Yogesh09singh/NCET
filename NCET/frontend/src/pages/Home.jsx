import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Other'];

const Home = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState('All');
    const [search, setSearch] = useState('');
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : {};
    });
    const [cartOpen, setCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const navigate = useNavigate();

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchProducts(); }, []);

    const filtered = useMemo(() => {
        return products.filter(p => {
            const matchCat = category === 'All' || p.category === category;
            const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) ||
                                p.description?.toLowerCase().includes(search.toLowerCase());
            return matchCat && matchSearch;
        });
    }, [products, category, search]);

    const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
    const cartTotal = Object.entries(cart).reduce((total, [pid, qty]) => {
        const p = products.find(x => x.id === pid);
        return total + (p ? p.price * qty : 0);
    }, 0);

    const addToCart = (product) => {
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        if (!user) { showToast('Please login as a Customer to add to cart.', 'error'); return; }
        if (user.roles?.includes('ROLE_FARMER') || user.roles?.includes('ROLE_ADMIN')) {
            showToast('Only customers can purchase items.', 'error'); return;
        }
        setCart(prev => ({ ...prev, [product.id]: (prev[product.id] || 0) + 1 }));
        showToast(`${product.name} added to cart!`);
    };

    const updateCartQty = (pid, delta) => {
        setCart(prev => {
            const newQty = (prev[pid] || 0) + delta;
            if (newQty <= 0) { const n = { ...prev }; delete n[pid]; return n; }
            return { ...prev, [pid]: newQty };
        });
    };

    const handleCheckout = async () => {
        try {
            const items = Object.entries(cart).map(([productId, quantity]) => ({ productId, quantity }));
            await api.post('/orders', { items });
            setCart({});
            setCartOpen(false);
            showToast('Order placed successfully! 🎉');
            fetchProducts();
        } catch (err) {
            showToast('Failed to place order. Please try again.', 'error');
        }
    };

    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(22,163,74,0.08) 0%, rgba(37,99,235,0.08) 100%)',
                borderBottom: '1px solid var(--border)',
                padding: '3rem 1.5rem 4rem',
                marginBottom: '2rem',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'radial-gradient(ellipse at 30% 60%, rgba(22,163,74,0.12), transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(37,99,235,0.12), transparent 50%)',
                    pointerEvents: 'none',
                }} />
                <div className="container" style={{ position: 'relative' }}>
                    <div className="hero-badge mb-4" style={{ display: 'inline-flex' }}>
                        🌱 Fresh from the Farm · No Middlemen
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 800,
                        lineHeight: 1.15,
                        marginBottom: '1rem',
                        background: 'linear-gradient(135deg, #f0f4f8, #94a3b8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        Kisan Setu Marketplace
                    </h1>
                    <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '550px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
                        Buy fresh, organic produce directly from Indian farmers. Better prices, zero middlemen, maximum freshness.
                    </p>

                    {/* Search Bar */}
                    <div className="search-bar" style={{ maxWidth: '520px', margin: '0 auto' }}>
                        <span style={{ fontSize: '1.1rem' }}>🔍</span>
                        <input
                            type="text"
                            placeholder="Search tomatoes, wheat, mangoes..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="btn-ghost btn-sm" style={{ padding: '0.2rem 0.4rem', borderRadius: '0.4rem' }}>✕</button>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="flex gap-6 justify-center mt-8 flex-wrap">
                        {[
                            { icon: '🌾', label: 'Products', value: products.length },
                            { icon: '👨‍🌾', label: 'Farmers', value: '50+' },
                            { icon: '📦', label: 'Categories', value: 5 },
                            { icon: '⭐', label: 'Rating', value: '4.9' },
                        ].map(stat => (
                            <div key={stat.label} style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                background: 'var(--glass-bg)', border: '1px solid var(--border)',
                                borderRadius: '0.75rem', padding: '0.5rem 1rem',
                            }}>
                                <span style={{ fontSize: '1.1rem' }}>{stat.icon}</span>
                                <span style={{ fontWeight: 700, fontSize: '1rem' }}>{stat.value}</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '4rem' }}>
                {/* Category Tabs + Cart Button Row */}
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <div className="category-tabs">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                className={`category-tab ${category === cat ? 'active' : ''}`}
                                onClick={() => setCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {user && user.roles?.includes('ROLE_CUSTOMER') && (
                        <button
                            className="btn btn-primary"
                            onClick={() => setCartOpen(true)}
                            style={{ position: 'relative' }}
                        >
                            🛒 Cart
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute', top: '-8px', right: '-8px',
                                    background: 'var(--danger)', color: 'white',
                                    borderRadius: '50%', width: '20px', height: '20px',
                                    fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 700
                                }}>{cartCount}</span>
                            )}
                        </button>
                    )}
                </div>

                {/* Results Info */}
                {(search || category !== 'All') && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                        Showing <strong style={{ color: 'var(--text-main)' }}>{filtered.length}</strong> result{filtered.length !== 1 ? 's' : ''}
                        {category !== 'All' && <> in <strong style={{ color: 'var(--primary)' }}>{category}</strong></>}
                        {search && <> for "<strong style={{ color: 'var(--text-main)' }}>{search}</strong>"</>}
                    </p>
                )}

                {/* Products Grid */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌾</div>
                        <p>Loading fresh produce...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filtered.map(p => (
                            <div key={p.id} className="product-card animate-fade-in">
                                {/* Image */}
                                <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                                    {p.imageUrl ? (
                                        <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', background: 'var(--surface)' }}>🌾</div>
                                    )}
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: 'linear-gradient(to top, rgba(10,15,26,0.7) 0%, transparent 50%)',
                                    }} />
                                    {p.category && (
                                        <span className="badge badge-success" style={{
                                            position: 'absolute', top: '0.6rem', left: '0.6rem',
                                        }}>{p.category}</span>
                                    )}
                                    <span style={{
                                        position: 'absolute', top: '0.6rem', right: '0.6rem',
                                        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                                        padding: '0.2rem 0.6rem', borderRadius: '999px',
                                        fontSize: '0.7rem', fontWeight: 700, color: p.quantity > 0 ? '#4ade80' : '#f87171',
                                    }}>
                                        {p.quantity > 0 ? `✓ ${p.quantity} ${p.unit || 'units'}` : '✗ Out of Stock'}
                                    </span>
                                </div>

                                {/* Content */}
                                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                                    <h3 style={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.3 }}>{p.name}</h3>
                                    <p className="text-sm line-clamp-2" style={{ color: 'var(--text-muted)' }}>{p.description}</p>

                                    {p.location && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            <span>📍</span><span>{p.location}</span>
                                        </div>
                                    )}
                                    {p.farmerName && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            <span>👨‍🌾</span><span>{p.farmerName}</span>
                                        </div>
                                    )}

                                    <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', fontFamily: "'Poppins', sans-serif" }}>
                                                ₹{p.price}
                                            </span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>per {p.unit}</span>
                                        </div>
                                        <button
                                            className="btn btn-primary w-full"
                                            onClick={() => addToCart(p)}
                                            disabled={p.quantity <= 0}
                                        >
                                            {p.quantity > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filtered.length === 0 && !loading && (
                            <div className="col-span-4 empty-state glass rounded-xl" style={{ gridColumn: '1 / -1' }}>
                                <div className="empty-icon">🔍</div>
                                <h3 className="text-xl font-bold">No products found</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search or category filter.</p>
                                <button className="btn btn-outline" onClick={() => { setSearch(''); setCategory('All'); }}>Clear Filters</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Cart Overlay */}
            {cartOpen && (
                <>
                    <div className="cart-overlay" onClick={() => setCartOpen(false)} />
                    <div className="cart-panel">
                        {/* Cart Header */}
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.25rem' }}>
                                🛒 Your Cart <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 400 }}>({cartCount} items)</span>
                            </h2>
                            <button className="btn-ghost btn-sm" onClick={() => setCartOpen(false)} style={{ fontSize: '1.3rem', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', background: 'transparent' }}>✕</button>
                        </div>

                        {/* Cart Items */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                            {cartCount === 0 ? (
                                <div className="empty-state" style={{ padding: '3rem 1rem' }}>
                                    <div className="empty-icon">🛒</div>
                                    <p style={{ color: 'var(--text-muted)' }}>Your cart is empty</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {Object.entries(cart).map(([pid, qty]) => {
                                        const p = products.find(x => x.id === pid);
                                        if (!p) return null;
                                        return (
                                            <div key={pid} style={{
                                                display: 'flex', gap: '0.75rem', alignItems: 'center',
                                                padding: '0.75rem', background: 'var(--surface)',
                                                borderRadius: '0.75rem', border: '1px solid var(--border)',
                                            }}>
                                                <div style={{ width: '50px', height: '50px', borderRadius: '0.5rem', overflow: 'hidden', flexShrink: 0 }}>
                                                    {p.imageUrl ? <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🌾</div>}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                                                    <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>₹{(p.price * qty).toFixed(2)}</p>
                                                </div>
                                                <div className="qty-stepper">
                                                    <button className="qty-btn" onClick={() => updateCartQty(pid, -1)}>−</button>
                                                    <span className="qty-count">{qty}</span>
                                                    <button className="qty-btn" onClick={() => updateCartQty(pid, 1)}>+</button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Cart Footer */}
                        {cartCount > 0 && (
                            <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Total Amount</span>
                                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', fontFamily: "'Poppins', sans-serif" }}>₹{cartTotal.toFixed(2)}</span>
                                </div>
                                <button className="btn btn-primary w-full btn-lg" onClick={handleCheckout}>
                                    ✓ Place Order
                                </button>
                            </div>
                        )}
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

export default Home;
