import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { User, ShoppingBag, Heart, Settings, LogOut, ChevronRight, Package, MapPin, Edit2, Check, X } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import './Account.css';

const STATUS_COLORS = {
    Delivered: 'success',
    Processing: 'warning',
    Shipped: 'info',
    Cancelled: 'error',
};

export default function Account() {
    const { user, profile, logout, updateProfile, orders, isAuthenticated } = useAuth();
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const [activeTab, setActiveTab] = useState('orders');
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [profileForm, setProfileForm] = useState({
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
    });

    // Update form when user/profile data is loaded
    useEffect(() => {
        if (user || profile) {
            setProfileForm({
                name: user?.name || '',
                phone: profile?.phone || '',
                street: profile?.street || '',
                city: profile?.city || '',
                state: profile?.state || '',
                zip: profile?.zip || '',
                country: profile?.country || '',
            });
        }
    }, [user, profile]);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const handleProfileSave = async () => {
        setLoading(true);
        const result = await updateProfile(profileForm);
        setLoading(false);
        if (result.success) {
            setEditing(false);
        } else {
            alert('Failed to save: ' + result.message);
        }
    };

    const tabs = [
        { id: 'orders', label: 'My Orders', icon: ShoppingBag },
        { id: 'favorites', label: 'Favorites', icon: Heart },
        { id: 'settings', label: 'Account Settings', icon: Settings },
    ];

    return (
        <div className="account-page">
            <div className="container">
                <div className="account-page__header">
                    <div className="account-page__user-info">
                        <div className="account-page__avatar">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="account-page__name">Hello, {user.name?.split(' ')[0]} 👋</h1>
                            <p className="account-page__email">{user.email}</p>
                        </div>
                    </div>
                    <button className="account-page__logout" onClick={logout}>
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>

                <div className="account-page__layout">
                    <aside className="account-page__sidebar">
                        {tabs.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                className={`account-page__tab ${activeTab === id ? 'active' : ''}`}
                                onClick={() => setActiveTab(id)}
                            >
                                <Icon size={18} />
                                <span>{label}</span>
                                <ChevronRight size={16} className="account-page__tab-arrow" />
                            </button>
                        ))}
                    </aside>

                    <main className="account-page__main">
                        {/* Mobile Tabs */}
                        <div className="account-page__mobile-tabs">
                            {tabs.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    className={`account-page__mobile-tab ${activeTab === id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(id)}
                                >
                                    <Icon size={18} />
                                    <span>{label}</span>
                                </button>
                            ))}
                        </div>

                        {activeTab === 'orders' && (
                            <div className="account-section">
                                <h2 className="account-section__title">My Orders</h2>
                                {orders.length === 0 ? (
                                    <div className="account-empty">
                                        <Package size={48} className="account-empty__icon" />
                                        <p>No orders yet.</p>
                                        <Link to="/products" className="btn btn-primary">Start Shopping</Link>
                                    </div>
                                ) : (
                                    <div className="orders-list">
                                        {orders.map((order) => (
                                            <div key={order.$id} className="order-card">
                                                <div className="order-card__header">
                                                    <div>
                                                        <span className="order-card__id">ORD-{order.$id.slice(-8).toUpperCase()}</span>
                                                        <span className="order-card__date">
                                                            {new Date(order.$createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <span className={`order-card__status order-card__status--${STATUS_COLORS[order.status]}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="order-card__items">
                                                    <div className="order-item">
                                                        <div className="order-item__info">
                                                            <span className="order-item__name">{order.items}</span>
                                                            <span className="order-item__qty">Ship to: {order.shippingName}</span>
                                                        </div>
                                                        <span className="order-item__price">{order.total?.toFixed(2)}<span style={{ fontSize: '1.2em', marginLeft: '4px', fontWeight: '500' }}>৳</span></span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'favorites' && (
                            <div className="account-section">
                                <h2 className="account-section__title">My Favorites</h2>
                                {wishlistItems.length === 0 ? (
                                    <div className="account-empty">
                                        <Heart size={48} className="account-empty__icon" />
                                        <p>Your wishlist is empty.</p>
                                    </div>
                                ) : (
                                    <div className="favorites-grid">
                                        {wishlistItems.map((item) => (
                                            <div key={item.id} className="fav-card">
                                                <img src={item.image} alt="" className="fav-card__image" />
                                                <div className="fav-card__info">
                                                    <p className="fav-card__name">{item.name}</p>
                                                    <p className="fav-card__price">{item.price}<span style={{ fontSize: '1.2em', marginLeft: '4px', fontWeight: '500' }}>৳</span></p>
                                                    <button className="btn btn-primary btn-sm" onClick={() => addToCart(item)}>Add to Cart</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="account-section">
                                <div className="account-section__title-row">
                                    <h2 className="account-section__title">Account Settings</h2>
                                    {!editing ? (
                                        <button className="settings-edit-btn" onClick={() => setEditing(true)}>
                                            <Edit2 size={15} /> Edit
                                        </button>
                                    ) : (
                                        <div className="settings-edit-actions">
                                            <button className="settings-save-btn" onClick={handleProfileSave} disabled={loading}>
                                                {loading ? 'Saving...' : <><Check size={15} /> Save</>}
                                            </button>
                                            <button className="settings-cancel-btn" onClick={() => setEditing(false)}>
                                                <X size={15} /> Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="settings-form">
                                    <div className="settings-group">
                                        <h3 className="settings-group__title"><User size={16} /> Personal Info</h3>
                                        <div className="settings-fields">
                                            <div className="settings-field">
                                                <label>Full Name</label>
                                                <input
                                                    value={profileForm.name}
                                                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                                    disabled={!editing}
                                                    className="settings-field__input"
                                                />
                                            </div>
                                            <div className="settings-field">
                                                <label>Phone Number</label>
                                                <input
                                                    value={profileForm.phone}
                                                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                                    disabled={!editing}
                                                    placeholder="+880..."
                                                    className="settings-field__input"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="settings-group">
                                        <h3 className="settings-group__title"><MapPin size={16} /> Shipping Address</h3>
                                        <div className="settings-fields settings-fields--2col">
                                            <div className="settings-field settings-field--full">
                                                <label>Street Address</label>
                                                <input
                                                    value={profileForm.street}
                                                    onChange={(e) => setProfileForm({ ...profileForm, street: e.target.value })}
                                                    disabled={!editing}
                                                    className="settings-field__input"
                                                />
                                            </div>
                                            <div className="settings-field">
                                                <label>City</label>
                                                <input
                                                    value={profileForm.city}
                                                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                                                    disabled={!editing}
                                                    className="settings-field__input"
                                                />
                                            </div>
                                            <div className="settings-field">
                                                <label>ZIP Code</label>
                                                <input
                                                    value={profileForm.zip}
                                                    onChange={(e) => setProfileForm({ ...profileForm, zip: e.target.value })}
                                                    disabled={!editing}
                                                    className="settings-field__input"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
