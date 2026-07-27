import { useState } from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Package, ShoppingCart, Users,
    Settings, LogOut, Menu, X, ChevronRight, Store
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import Dashboard from './pages/Dashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminCustomers from './pages/AdminCustomers';
import AdminSettings from './pages/AdminSettings';
import './AdminLayout.css';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/customers', label: 'Customers', icon: Users },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Security: Only admin can access
    if (!user || user.email !== ADMIN_EMAIL) {
        return <Navigate to="/" replace />;
    }

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="admin">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div className="admin__overlay" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`admin__sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="admin__sidebar-header">
                    <div className="admin__logo">
                        <Store size={24} />
                        <div>
                            <h2>Namira Nabila</h2>
                            <span>Admin Panel</span>
                        </div>
                    </div>
                    <button className="admin__sidebar-close" onClick={() => setSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <nav className="admin__nav">
                    {navItems.map(({ path, label, icon: Icon, end }) => (
                        <NavLink
                            key={path}
                            to={path}
                            end={end}
                            className={({ isActive }) => `admin__nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <Icon size={20} />
                            <span>{label}</span>
                            <ChevronRight size={16} className="admin__nav-arrow" />
                        </NavLink>
                    ))}
                </nav>

                <div className="admin__sidebar-footer">
                    <div className="admin__user">
                        <div className="admin__user-avatar">{user.name?.charAt(0)}</div>
                        <div className="admin__user-info">
                            <span className="admin__user-name">{user.name}</span>
                            <span className="admin__user-role">Owner</span>
                        </div>
                    </div>
                    <button className="admin__logout" onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="admin__main">
                <header className="admin__topbar">
                    <button className="admin__menu-btn" onClick={() => setSidebarOpen(true)}>
                        <Menu size={24} />
                    </button>
                    <div className="admin__topbar-right">
                        <a href="/" target="_blank" rel="noopener noreferrer" className="admin__view-store">
                            <Store size={16} />
                            View Store
                        </a>
                    </div>
                </header>

                <main className="admin__content">
                    <Routes>
                        <Route index element={<Dashboard />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="customers" element={<AdminCustomers />} />
                        <Route path="settings" element={<AdminSettings />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}
