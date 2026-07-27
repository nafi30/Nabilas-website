import { useState, useEffect } from 'react';
import { Search, ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';
import { databases, Query } from '../../lib/appwrite';

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const ORDERS_ID = import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID;

const STATUS_OPTIONS = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_CLASS = {
    Processing: 'processing',
    Shipped: 'shipped',
    Delivered: 'delivered',
    Cancelled: 'cancelled',
};

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        try {
            const res = await databases.listDocuments(DB_ID, ORDERS_ID, [Query.orderDesc('$createdAt'), Query.limit(100)]);
            setOrders(res.documents);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            await databases.updateDocument(DB_ID, ORDERS_ID, orderId, { status: newStatus });
            setOrders(prev => prev.map(o => o.$id === orderId ? { ...o, status: newStatus } : o));
        } catch (err) {
            console.error(err);
            alert('Failed to update: ' + err.message);
        }
    };

    const filtered = orders.filter(o => {
        const matchesSearch = o.shippingName?.toLowerCase().includes(search.toLowerCase()) ||
            o.$id.includes(search) || o.items?.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'All' || o.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>Orders</h1>
                <p style={{ color: '#666', fontSize: '0.85rem' }}>Manage and track customer orders</p>
            </div>

            {/* Filter Tabs */}
            <div className="admin-tabs">
                {['All', ...STATUS_OPTIONS].map(tab => (
                    <button key={tab} className={`admin-tab ${filter === tab ? 'active' : ''}`} onClick={() => setFilter(tab)}>
                        {tab} {tab !== 'All' && `(${orders.filter(o => o.status === tab).length})`}
                    </button>
                ))}
            </div>

            <div className="admin-section__header">
                <div className="admin-search">
                    <Search size={16} />
                    <input placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            {loading ? (
                <div className="admin-empty"><p>Loading orders...</p></div>
            ) : filtered.length === 0 ? (
                <div className="admin-empty">
                    <ShoppingCart size={48} />
                    <p>No orders found.</p>
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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(order => (
                                <>
                                    <tr key={order.$id} style={{ cursor: 'pointer' }} onClick={() => setExpandedId(expandedId === order.$id ? null : order.$id)}>
                                        <td style={{ fontWeight: 600, color: '#fff' }}>
                                            ORD-{order.$id.slice(-8).toUpperCase()}
                                        </td>
                                        <td>{order.shippingName}</td>
                                        <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {order.items}
                                        </td>
                                        <td style={{ fontWeight: 600, color: '#22c55e' }}>{order.total?.toFixed(2)}<span style={{ fontSize: '1.2em', marginLeft: '4px', fontWeight: '500' }}>৳</span></td>
                                        <td>
                                            <span className={`status-badge status-badge--${STATUS_CLASS[order.status]}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={{ color: '#666' }}>{new Date(order.$createdAt).toLocaleDateString()}</td>
                                        <td>
                                            {expandedId === order.$id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </td>
                                    </tr>
                                    {expandedId === order.$id && (
                                        <tr key={`${order.$id}-detail`}>
                                            <td colSpan="7" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                    <div>
                                                        <p style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>Shipping Details</p>
                                                        <p style={{ color: '#ccc', lineHeight: 1.6 }}>
                                                            {order.shippingName}<br />
                                                            {order.shippingEmail}<br />
                                                            {order.shippingPhone}<br />
                                                            {order.shippingStreet}, {order.shippingCity} {order.shippingZip}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>Update Status</p>
                                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                            {STATUS_OPTIONS.map(s => (
                                                                <button
                                                                    key={s}
                                                                    className={`admin-btn admin-btn--sm ${order.status === s ? 'admin-btn--primary' : 'admin-btn--ghost'}`}
                                                                    onClick={(e) => { e.stopPropagation(); updateStatus(order.$id, s); }}
                                                                >
                                                                    {s}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
