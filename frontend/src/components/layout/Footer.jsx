import { Link } from 'react-router-dom';
import {
    Facebook, Twitter, Instagram, Youtube,
    Mail, Phone, MapPin, CreditCard, Shield, Truck
} from 'lucide-react';
import './Footer.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        shop: [
            { name: 'All Products', path: '/products' },
            { name: 'New Arrivals', path: '/products?tag=new' },
            { name: 'Best Sellers', path: '/products?tag=bestseller' },
            { name: 'Sale', path: '/products?sale=true' },
            { name: 'Gift Cards', path: '/gift-cards' }
        ],
        support: [
            { name: 'Contact Us', path: '/contact' },
            { name: 'FAQs', path: '/faqs' },
            { name: 'Shipping Info', path: '/shipping' },
            { name: 'Returns & Exchanges', path: '/returns' },
            { name: 'Track Order', path: '/track-order' }
        ],
        company: [
            { name: 'About Us', path: '/about' },
            { name: 'Careers', path: '/careers' },
            { name: 'Press', path: '/press' },
            { name: 'Blog', path: '/blog' },
            { name: 'Affiliates', path: '/affiliates' }
        ],
        legal: [
            { name: 'Privacy Policy', path: '/privacy' },
            { name: 'Terms of Service', path: '/terms' },
            { name: 'Cookie Policy', path: '/cookies' },
            { name: 'Accessibility', path: '/accessibility' }
        ]
    };

    const socialLinks = [
        { name: 'Facebook', icon: Facebook, url: '#' },
        { name: 'Twitter', icon: Twitter, url: '#' },
        { name: 'Instagram', icon: Instagram, url: '#' },
        { name: 'Youtube', icon: Youtube, url: '#' }
    ];

    return (
        <footer className="footer">
            {/* Features Bar */}
            <div className="footer__features">
                <div className="container">
                    <div className="footer__features-grid">
                        <div className="footer__feature">
                            <Truck size={28} />
                            <div>
                                <h4>Free Shipping</h4>
                                <p>On orders over $50</p>
                            </div>
                        </div>
                        <div className="footer__feature">
                            <Shield size={28} />
                            <div>
                                <h4>Secure Payment</h4>
                                <p>100% secure checkout</p>
                            </div>
                        </div>
                        <div className="footer__feature">
                            <CreditCard size={28} />
                            <div>
                                <h4>Easy Returns</h4>
                                <p>30-day return policy</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="footer__main">
                <div className="container">
                    <div className="footer__grid">
                        {/* Brand */}
                        <div className="footer__brand">
                            <Link to="/" className="footer__logo">
                                <span className="footer__logo-icon">🛍️</span>
                                <span className="footer__logo-text">
                                    <span className="footer__logo-brand-main">Namira Nabila</span>
                                    <span className="footer__logo-brand-sub">Creations</span>
                                </span>
                            </Link>
                            <p className="footer__description">
                                Discover the best products from around the world. Quality, style, and value delivered to your doorstep.
                            </p>
                            <div className="footer__contact">
                                <a href="mailto:hello@shopverse.com" className="footer__contact-item">
                                    <Mail size={18} />
                                    hello@shopverse.com
                                </a>
                                <a href="tel:+1234567890" className="footer__contact-item">
                                    <Phone size={18} />
                                    +1 (234) 567-890
                                </a>
                                <span className="footer__contact-item">
                                    <MapPin size={18} />
                                    New York, NY 10001
                                </span>
                            </div>
                        </div>

                        {/* Links */}
                        <div className="footer__links-section">
                            <h3 className="footer__heading">Shop</h3>
                            <ul className="footer__links">
                                {footerLinks.shop.map((link) => (
                                    <li key={link.name}>
                                        <Link to={link.path}>{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="footer__links-section">
                            <h3 className="footer__heading">Support</h3>
                            <ul className="footer__links">
                                {footerLinks.support.map((link) => (
                                    <li key={link.name}>
                                        <Link to={link.path}>{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="footer__links-section">
                            <h3 className="footer__heading">Company</h3>
                            <ul className="footer__links">
                                {footerLinks.company.map((link) => (
                                    <li key={link.name}>
                                        <Link to={link.path}>{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div className="footer__newsletter">
                            <h3 className="footer__heading">Stay Updated</h3>
                            <p>Subscribe for exclusive offers and updates.</p>
                            <form className="footer__newsletter-form" onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="footer__newsletter-input"
                                />
                                <button type="submit" className="btn btn-primary footer__newsletter-btn">
                                    Subscribe
                                </button>
                            </form>
                            <div className="footer__social">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        className="footer__social-link"
                                        aria-label={social.name}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <social.icon size={20} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer__bottom">
                <div className="container">
                    <div className="footer__bottom-content">
                        <p className="footer__copyright">
                            © {currentYear} Namira Nabila Creations. All rights reserved.
                        </p>
                        <div className="footer__legal-links">
                            {footerLinks.legal.map((link, index) => (
                                <span key={link.name}>
                                    <Link to={link.path}>{link.name}</Link>
                                    {index < footerLinks.legal.length - 1 && <span className="footer__divider">•</span>}
                                </span>
                            ))}
                        </div>
                        <div className="footer__payment-icons">
                            <img src="https://cdn-icons-png.flaticon.com/128/349/349221.png" alt="Visa" />
                            <img src="https://cdn-icons-png.flaticon.com/128/349/349228.png" alt="Mastercard" />
                            <img src="https://cdn-icons-png.flaticon.com/128/349/349230.png" alt="Amex" />
                            <img src="https://cdn-icons-png.flaticon.com/128/174/174861.png" alt="PayPal" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
