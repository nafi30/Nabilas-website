import { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Users, Package, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { databases, Query } from '../../lib/appwrite';

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const ORDERS_ID = import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID;
const PRODUCTS_ID = import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID;
const PROFILES_ID = import.meta.env.VITE_APPWRITE_PROFILES_COLLECTION_ID;

const STATUS_CLASS = {
    Processing: 'processing',
    Shipped: 'shipped',
    Delivered: 'delivered',
    Cancelled: 'cancelled',
};

const PIE_COLORS = {
    Processing: '#f59e0b',
    Shipped: '#3b82f6',
    Delivered: '#22c55e',
    Cancelled: '#ef4444',
};

export default function Dashboard() {
    const [allOrders, setAllOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchDashboardData(); }, []);

    const fetchDashboardData = async () => {
        try {
            const [ordersRes, productsRes, profilesRes] = await Promise.all([
                databases.listDocuments(DB_ID, ORDERS_ID, [Query.orderDesc('$createdAt'), Query.limit(100)]),
                databases.listDocuments(DB_ID, PRODUCTS_ID, [Query.limit(100)]),
                databases.listDocuments(DB_ID, PROFILES_ID, [Query.limit(100)]),
            ]);
            setAllOrders(ordersRes.documents);
            setProducts(productsRes.documents);
            setCustomers(profilesRes.documents);
        } catch (err) {
            console.error('Dashboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    // ---- Revenue Calculations ----
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const revenueAll = allOrders.reduce((s, o) => s + (o.total || 0), 0);
    const revenueToday = allOrders.filter(o => new Date(o.$createdAt) >= startOfToday).reduce((s, o) => s + (o.total || 0), 0);
    const revenueWeek = allOrders.filter(o => new Date(o.$createdAt) >= startOfWeek).reduce((s, o) => s + (o.total || 0), 0);
    const revenueMonth = allOrders.filter(o => new Date(o.$createdAt) >= startOfMonth).reduce((s, o) => s + (o.total || 0), 0);

    const pendingOrders = allOrders.filter(o => o.status === 'Processing').length;
    const recentOrders = allOrders.slice(0, 10);

    // ---- Order Status Breakdown ----
    const statusCounts = { Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 };
    allOrders.forEach(o => { if (statusCounts[o.status] !== undefined) statusCounts[o.status]++; });
    const totalForPie = Object.values(statusCounts).reduce((a, b) => a + b, 0);

    // Build conic-gradient for pie chart
    let conicStops = [];
    let cumPercent = 0;
    Object.entries(statusCounts).forEach(([status, count]) => {
        const percent = totalForPie > 0 ? (count / totalForPie) * 100 : 0;
        conicStops.push(`${PIE_COLORS[status]} ${cumPercent}% ${cumPercent + percent}%`);
        cumPercent += percent;
    });
    const pieGradient = totalForPie > 0
        ? `conic-gradient(${conicStops.join(', ')})`
        : 'conic-gradient(#333 0% 100%)';

    // ---- Low Stock Products ----
    const lowStock = products.filter(p => (p.stock || 0) < 10);

    // ---- Revenue Trend (last 7 days) ----
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(startOfToday);
        d.setDate(d.getDate() - i);
        const nextD = new Date(d);
        nextD.setDate(nextD.getDate() + 1);
        const dayRevenue = allOrders
            .filter(o => new Date(o.$createdAt) >= d && new Date(o.$createdAt) < nextD)
            .reduce((s, o) => s + (o.total || 0), 0);
        last7Days.push({ label: d.toLocaleDateString('en', { weekday: 'short' }), value: dayRevenue });
    }
    const maxDayRevenue = Math.max(...last7Days.map(d => d.value), 1);

    if (loading) {
        return <div className="admin-empty"><p>Loading dashboard...</p></div>;
    }

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>Dashboard</h1>
                <p style={{ color: '#666', fontSize: '0.85rem' }}>Welcome back! Here's your store overview.</p>
            </div>

            {/* Revenue Time Period Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card__header">
                        <div className="stat-card__icon stat-card__icon--green"><DollarSign size={20} /></div>
                        <span className="stat-card__badge stat-card__badge--up">Today</span>
                    </div>
                    <div className="stat-card__value">{revenueToday.toFixed(2)}<span style={{ fontSize: '1.2em', marginLeft: '4px', fontWeight: '500' }}>৳</span></div>
                    <div className="stat-card__label">Today's Revenue</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__header">
                        <div className="stat-card__icon stat-card__icon--blue"><TrendingUp size={20} /></div>
                        <span className="stat-card__badge stat-card__badge--up">This Week</span>
                    </div>
                    <div className="stat-card__value">{revenueWeek.toFixed(2)}<span style={{ fontSize: '1.2em', marginLeft: '4px', fontWeight: '500' }}>৳</span></div>
                    <div className="stat-card__label">Weekly Revenue</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__header">
                        <div className="stat-card__icon stat-card__icon--pink"><DollarSign size={20} /></div>
                        <span className="stat-card__badge stat-card__badge--up">This Month</span>
                    </div>
                    <div className="stat-card__value">{revenueMonth.toFixed(2)}<span style={{ fontSize: '1.2em', marginLeft: '4px', fontWeight: '500' }}>৳</span></div>
                    <div className="stat-card__label">Monthly Revenue</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__header">
                        <div className="stat-card__icon stat-card__icon--amber"><DollarSign size={20} /></div>
                    </div>
                    <div className="stat-card__value">{revenueAll.toFixed(2)}<span style={{ fontSize: '1.2em', marginLeft: '4px', fontWeight: '500' }}>৳</span></div>
                    <div className="stat-card__label">All-Time Revenue</div>
                </div>
            </div>

            {/* Secondary Stats */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                    <div className="stat-card__header">
                        <div className="stat-card__icon stat-card__icon--blue"><ShoppingCart size={20} /></div>
                    </div>
                    <div className="stat-card__value">{allOrders.length}</div>
                    <div className="stat-card__label">Total Orders</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__header">
                        <div className="stat-card__icon stat-card__icon--amber"><Clock size={20} /></div>
                    </div>
                    <div className="stat-card__value" style={{ color: pendingOrders > 0 ? '#f59e0b' : '#fff' }}>{pendingOrders}</div>
                    <div className="stat-card__label">Pending Orders</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__header">
                        <div className="stat-card__icon stat-card__icon--green"><Users size={20} /></div>
                    </div>
                    <div className="stat-card__value">{customers.length}</div>
                    <div className="stat-card__label">Customers</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__header">
                        <div className="stat-card__icon stat-card__icon--pink"><Package size={20} /></div>
                    </div>
                    <div className="stat-card__value">{products.length}</div>
                    <div className="stat-card__label">Products</div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="dashboard-charts-grid">
                {/* Revenue Trend Line (Bar Chart) */}
                <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '1.5rem', width: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>📈 Revenue Trend (Last 7 Days)</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: 160, width: '100%', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        {last7Days.map((day, i) => (
                            <div key={i} style={{ flex: 1, minWidth: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                                <span style={{ fontSize: '0.65rem', color: '#888', whiteSpace: 'nowrap' }}>
                                    {day.value > 0 ? `${day.value.toFixed(0)}৳` : ''}
                                </span>
                                <div style={{
                                    width: '100%',
                                    height: `${Math.max((day.value / maxDayRevenue) * 130, 4)}px`,
                                    background: day.value > 0
                                        ? 'linear-gradient(180deg, #ec4899, #8b5cf6)'
                                        : 'rgba(255,255,255,0.05)',
                                    borderRadius: '6px 6px 2px 2px',
                                    transition: 'height 0.5s ease',
                                }} />
                                <span style={{ fontSize: '0.7rem', color: '#666' }}>{day.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Status Pie Chart */}
                <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '1.5rem', width: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>📊 Order Status</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: 120, height: 120, borderRadius: '50%',
                            background: pieGradient,
                            boxShadow: '0 0 30px rgba(236,72,153,0.1)',
                            position: 'relative',
                            flexShrink: 0
                        }}>
                            <div style={{
                                position: 'absolute', inset: '25%', borderRadius: '50%',
                                background: '#0f0f0f',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.1rem', fontWeight: 800, color: '#fff',
                            }}>
                                {totalForPie}
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 0.75rem', justifyContent: 'center', width: '100%' }}>
                            {Object.entries(statusCounts).map(([status, count]) => (
                                <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[status], flexShrink: 0 }} />
                                    <span style={{ fontSize: '0.75rem', color: '#888' }}>{status} ({count})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Low Stock Alert */}
            {lowStock.length > 0 && (
                <div style={{
                    background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
                    borderRadius: 14, padding: '1.25rem', marginBottom: '2rem', width: '100%', boxSizing: 'border-box', minWidth: 0
                }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertTriangle size={18} /> Low Stock Alert ({lowStock.length} items)
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxWidth: '100%' }}>
                        {lowStock.map(p => (
                            <span key={p.$id} style={{
                                padding: '0.35rem 0.75rem', borderRadius: 8, fontSize: '0.8rem',
                                background: 'rgba(239,68,68,0.1)', color: '#fca5a5',
                                maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                            }}>
                                {p.name} — <strong>{p.stock || 0} left</strong>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Orders Table */}
            <div className="admin-section__header">
                <h2 className="admin-section__title">Recent Orders</h2>
            </div>

            {recentOrders.length === 0 ? (
                <div className="admin-empty">
                    <ShoppingCart size={48} />
                    <p>No orders yet. They will appear here once customers start buying!</p>
                </div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map(order => (
                                <tr key={order.$id}>
                                    <td style={{ fontWeight: 600, color: '#fff' }}>
                                        ORD-{order.$id.slice(-8).toUpperCase()}
                                    </td>
                                    <td>{order.shippingName}</td>
                                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {order.items}
                                    </td>
                                    <td style={{ fontWeight: 600, color: '#22c55e' }}>{order.total?.toFixed(2)}<span style={{ fontSize: '1.2em', marginLeft: '4px', fontWeight: '500' }}>৳</span></td>
                                    <td>
                                        <span className={`status-badge status-badge--${STATUS_CLASS[order.status]}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ color: '#666' }}>{new Date(order.$createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
