import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Search, ShoppingCart, Heart, User, Menu, X,
    Sun, Moon, ChevronDown, LogOut, Package, Settings
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../auth/AuthContext';
import { CATEGORIES } from '../../data/categories';
import CartSidebar from './CartSidebar';
import './Header.css';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedMobileCat, setExpandedMobileCat] = useState(null);

    const { theme, toggleTheme } = useTheme();
    const { getCartCount, openCart, isCartOpen, closeCart } = useCart();
    const { wishlistCount } = useWishlist();
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
        setIsUserMenuOpen(false);
        setExpandedMobileCat(null);
    }, [location]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'Categories', path: '/categories', hasMegaMenu: true },
        { name: 'Deals', path: '/products?tag=bestseller' },
        { name: 'About', path: '/about' }
    ];

    return (
        <>
            <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
                <div className="header__container container">
                    {/* Logo */}
                    <Link to="/" className="header__logo">
                        <span className="header__logo-icon">🛍️</span>
                        <span className="header__logo-text">
                            <span className="header__logo-brand-main">Namira Nabila</span>
                            <span className="header__logo-brand-sub">Creations</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="header__nav">
                        {navLinks.map((link) => (
                            <div key={link.name} className="header__nav-item">
                                {link.hasMegaMenu ? (
                                    <div className="header__mega-wrapper">
                                        <Link to="/categories" className="header__nav-link">
                                            {link.name}
                                            <ChevronDown size={16} />
                                        </Link>
                                        {/* Mega Menu */}
                                        <div className="header__mega-menu">
                                            <div className="header__mega-inner">
                                                {CATEGORIES.map((cat) => (
                                                    <div key={cat.id} className="header__mega-column">
                                                        <Link
                                                            to={`/products?category=${cat.id}`}
                                                            className="header__mega-title"
                                                        >
                                                            <span>{cat.icon}</span> {cat.name}
                                                        </Link>
                                                        <div className="header__mega-subs">
                                                            {cat.subcategories.map(sub => (
                                                                <Link
                                                                    key={sub.id}
                                                                    to={`/products?category=${cat.id}&sub=${sub.id}`}
                                                                    className="header__mega-sub-link"
                                                                >
                                                                    {sub.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        to={link.path}
                                        className={`header__nav-link ${location.pathname === link.path ? 'active' : ''}`}
                                    >
                                        {link.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="header__actions">
                        <button className="header__action-btn header__search-btn" onClick={() => setIsSearchOpen(true)} aria-label="Search">
                            <Search size={20} />
                        </button>
                        <button className="header__action-btn" onClick={toggleTheme} aria-label="Toggle theme">
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <Link to="/account" state={{ tab: 'favorites' }} className="header__action-btn header__wishlist-btn">
                            <Heart size={20} />
                            {wishlistCount > 0 && <span className="header__badge">{wishlistCount}</span>}
                        </Link>
                        <button className="header__action-btn header__cart-btn" onClick={openCart} aria-label="Open cart">
                            <ShoppingCart size={20} />
                            {getCartCount() > 0 && <span className="header__badge">{getCartCount()}</span>}
                        </button>

                        {/* User Menu */}
                        <div className="header__user-menu">
                            {isAuthenticated ? (
                                <>
                                    <button className="header__action-btn header__avatar-btn" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} aria-label="User menu" title={user.name}>
                                        <span className="header__avatar">{user.name?.charAt(0).toUpperCase()}</span>
                                    </button>
                                    {isUserMenuOpen && (
                                        <div className="header__user-dropdown">
                                            <div className="header__user-greeting">
                                                <span className="header__user-greeting-name">{user.name}</span>
                                                <span className="header__user-greeting-email">{user.email}</span>
                                            </div>
                                            <hr className="header__user-divider" />
                                            <Link to="/account" className="header__user-item"><User size={18} /> My Account</Link>
                                            <Link to="/account" state={{ tab: 'orders' }} className="header__user-item"><Package size={18} /> My Orders</Link>
                                            <Link to="/account" state={{ tab: 'favorites' }} className="header__user-item"><Heart size={18} /> Favorites</Link>
                                            <Link to="/account" state={{ tab: 'settings' }} className="header__user-item"><Settings size={18} /> Settings</Link>
                                            <hr className="header__user-divider" />
                                            <button className="header__user-item header__user-item--logout" onClick={() => { logout(); setIsUserMenuOpen(false); }}>
                                                <LogOut size={18} /> Sign Out
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link to="/login" className="header__action-btn" aria-label="Login"><User size={20} /></Link>
                            )}
                        </div>

                        <button className="header__mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`header__mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                    <div className="header__mobile-search">
                        <form onSubmit={handleSearch}>
                            <input type="text" placeholder="Search products..." className="input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </form>
                    </div>
                    <nav className="header__mobile-nav">
                        <Link to="/" className="header__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                        <Link to="/products" className="header__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>All Products</Link>
                        <Link to="/products?tag=bestseller" className="header__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Deals</Link>
                        <Link to="/about" className="header__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>About</Link>

                        <div className="header__mobile-categories">
                            <p className="header__mobile-label">Categories</p>
                            {CATEGORIES.map((cat) => (
                                <div key={cat.id}>
                                    <button
                                        className="header__mobile-cat-btn"
                                        onClick={() => setExpandedMobileCat(expandedMobileCat === cat.id ? null : cat.id)}
                                    >
                                        <span>{cat.icon} {cat.name}</span>
                                        <ChevronDown size={16} style={{
                                            transform: expandedMobileCat === cat.id ? 'rotate(180deg)' : 'none',
                                            transition: 'transform 0.2s'
                                        }} />
                                    </button>
                                    {expandedMobileCat === cat.id && (
                                        <div className="header__mobile-subs">
                                            <Link to={`/products?category=${cat.id}`} className="header__mobile-sub-link" onClick={() => setIsMobileMenuOpen(false)}>
                                                All {cat.name}
                                            </Link>
                                            {cat.subcategories.map(sub => (
                                                <Link
                                                    key={sub.id}
                                                    to={`/products?category=${cat.id}&sub=${sub.id}`}
                                                    className="header__mobile-sub-link"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="header__mobile-categories">
                            <p className="header__mobile-label">Account</p>
                            {isAuthenticated ? (
                                <>
                                    <Link to="/account" className="header__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                                        <User size={18} /> My Account
                                    </Link>
                                    <Link to="/account" state={{ tab: 'orders' }} className="header__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Package size={18} /> My Orders
                                    </Link>
                                    <button 
                                        className="header__mobile-link" 
                                        onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                        style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', color: '#ef4444' }}
                                    >
                                        <LogOut size={18} /> Sign Out
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" className="header__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                                    <User size={18} /> Sign In / Register
                                </Link>
                            )}
                        </div>
                    </nav>
                </div>
            </header>

            {/* Search Overlay */}
            {isSearchOpen && (
                <div className="search-overlay" onClick={() => setIsSearchOpen(false)}>
                    <div className="search-overlay__content" onClick={(e) => e.stopPropagation()}>
                        <form onSubmit={handleSearch} className="search-overlay__form">
                            <Search size={24} className="search-overlay__icon" />
                            <input type="text" placeholder="Search for products..." className="search-overlay__input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus />
                            <button type="button" className="search-overlay__close" onClick={() => setIsSearchOpen(false)}>
                                <X size={24} />
                            </button>
                        </form>
                        <div className="search-overlay__suggestions">
                            <p className="search-overlay__label">Popular Searches</p>
                            <div className="search-overlay__tags">
                                {['Churi', 'Shari', 'Earrings', 'Lipstick', 'Necklace'].map((tag) => (
                                    <button key={tag} className="search-overlay__tag" onClick={() => { navigate(`/products?search=${tag.toLowerCase()}`); setIsSearchOpen(false); }}>
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <CartSidebar isOpen={isCartOpen} onClose={closeCart} />

            {isUserMenuOpen && (
                <div className="header__overlay" onClick={() => setIsUserMenuOpen(false)} />
            )}
        </>
    );
}
