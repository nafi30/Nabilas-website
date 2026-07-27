import { useState, useEffect } from 'react';
import { Search, Users, ChevronDown, ChevronUp, ShoppingCart, MapPin, Phone } from 'lucide-react';
import { databases, Query } from '../../lib/appwrite';

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PROFILES_ID = import.meta.env.VITE_APPWRITE_PROFILES_COLLECTION_ID;
const ORDERS_ID = import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID;

const STATUS_CLASS = {
    Processing: 'processing',
    Shipped: 'shipped',
    Delivered: 'delivered',
    Cancelled: 'cancelled',
};

export default function AdminCustomers() {
    const [customers, setCustomers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [profilesRes, ordersRes] = await Promise.all([
                databases.listDocuments(DB_ID, PROFILES_ID, [Query.limit(100), Query.orderDesc('$createdAt')]),
                databases.listDocuments(DB_ID, ORDERS_ID, [Query.limit(500), Query.orderDesc('$createdAt')]),
            ]);
            setCustomers(profilesRes.documents);
            setOrders(ordersRes.documents);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const getCustomerOrders = (userId) => orders.filter(o => o.userId === userId);
    const getCustomerSpent = (userId) => getCustomerOrders(userId).reduce((sum, o) => sum + (o.total || 0), 0);

    const filtered = customers.filter(c =>
        c.userId?.toLowerCase().includes(search.toLowerCase()) ||
        c.city?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search)
    );

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>Customers</h1>
                <p style={{ color: '#666', fontSize: '0.85rem' }}>View your registered customers and their order history</p>
            </div>

            <div className="admin-section__header">
                <div className="admin-search">
                    <Search size={16} />
                    <input placeholder="Search by ID, phone, or city..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <span style={{ color: '#666', fontSize: '0.85rem' }}>
                    {customers.length} total customers
                </span>
            </div>

            {loading ? (
                <div className="admin-empty"><p>Loading customers...</p></div>
            ) : filtered.length === 0 ? (
                <div className="admin-empty">
                    <Users size={48} />
                    <p>No customers found.</p>
                </div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Phone</th>
                                <th>City</th>
                                <th>Orders</th>
                                <th>Total Spent</th>
                                <th>Joined</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(customer => {
                                const customerOrders = getCustomerOrders(customer.userId);
                                const totalSpent = getCustomerSpent(customer.userId);
                                const isExpanded = expandedId === customer.$id;

                                return (
                                    <>
                                        <tr
                                            key={customer.$id}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setExpandedId(isExpanded ? null : customer.$id)}
                                        >
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{
                                                        width: 36, height: 36, borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '0.8rem', fontWeight: 700, color: '#fff', flexShrink: 0
                                                    }}>
                                                        {customer.userId?.charAt(0)?.toUpperCase() || '?'}
                                                    </div>
                                                    <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.8rem' }}>
                                                        {customer.userId?.slice(0, 12)}...
                                                    </span>
                                                </div>
                                            </td>
                                            <td>{customer.phone || '—'}</td>
                                            <td>{customer.city || '—'}</td>
                                            <td style={{ fontWeight: 600 }}>{customerOrders.length}</td>
                                            <td style={{ color: '#22c55e', fontWeight: 600 }}>
                                                ${totalSpent.toFixed(2)}
                                            </td>
                                            <td style={{ color: '#666' }}>
                                                {new Date(customer.$createdAt).toLocaleDateString()}
                                            </td>
                                            <td>
                                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </td>
                                        </tr>

                                        {/* Expanded Customer Detail */}
                                        {isExpanded && (
                                            <tr key={`${customer.$id}-detail`}>
                                                <td colSpan="7" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem' }}>
                                                    <div className="admin-customer-detail-grid">
                                                        {/* Profile Info */}
                                                        <div>
                                                            <h4 style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1rem', fontWeight: 600 }}>
                                                                Customer Profile
                                                            </h4>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ccc', fontSize: '0.85rem' }}>
                                                                    <Phone size={14} style={{ color: '#888' }} />
                                                                    {customer.phone || 'No phone'}
                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ccc', fontSize: '0.85rem' }}>
                                                                    <MapPin size={14} style={{ color: '#888' }} />
                                                                    {[customer.street, customer.city, customer.zip].filter(Boolean).join(', ') || 'No address'}
                                                                </div>
                                                                <div style={{ fontSize: '0.75rem', color: '#555', marginTop: '0.5rem' }}>
                                                                    User ID: <code style={{ color: '#888' }}>{customer.userId}</code>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Order History */}
                                                        <div>
                                                            <h4 style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1rem', fontWeight: 600 }}>
                                                                <ShoppingCart size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                                                Order History ({customerOrders.length})
                                                            </h4>
                                                            {customerOrders.length === 0 ? (
                                                                <p style={{ color: '#555', fontSize: '0.85rem' }}>No orders from this customer.</p>
                                                            ) : (
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                                    {customerOrders.slice(0, 5).map(order => (
                                                                        <div key={order.$id} style={{
                                                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                                            padding: '0.6rem 0.75rem',
                                                                            background: 'rgba(255,255,255,0.03)',
                                                                            borderRadius: 8,
                                                                            fontSize: '0.8rem',
                                                                        }}>
                                                                            <span style={{ color: '#fff', fontWeight: 600 }}>
                                                                                ORD-{order.$id.slice(-8).toUpperCase()}
                                                                            </span>
                                                                            <span style={{ color: '#888', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                                {order.items}
                                                                            </span>
                                                                            <span style={{ color: '#22c55e', fontWeight: 600 }}>${order.total?.toFixed(2)}</span>
                                                                            <span className={`status-badge status-badge--${STATUS_CLASS[order.status]}`}>
                                                                                {order.status}
                                                                            </span>
                                                                            <span style={{ color: '#555' }}>{new Date(order.$createdAt).toLocaleDateString()}</span>
                                                                        </div>
                                                                    ))}
                                                                    {customerOrders.length > 5 && (
                                                                        <p style={{ color: '#666', fontSize: '0.75rem', textAlign: 'center' }}>
                                                                            +{customerOrders.length - 5} more orders
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
