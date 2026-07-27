import { Link } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './CartSidebar.css';

export default function CartSidebar({ isOpen, onClose }) {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

    const formatPrice = (price) => {
        return (
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                {Number(price).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                <span style={{ fontSize: '1.2em', marginLeft: '4px', fontWeight: '500' }}>৳</span>
            </span>
        );
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`cart-sidebar__backdrop ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="cart-sidebar__header">
                    <h2 className="cart-sidebar__title">
                        <ShoppingBag size={24} />
                        Your Cart
                        <span className="cart-sidebar__count">({cartItems.length})</span>
                    </h2>
                    <button className="cart-sidebar__close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                {cartItems.length === 0 ? (
                    <div className="cart-sidebar__empty">
                        <div className="cart-sidebar__empty-icon">🛒</div>
                        <h3>Your cart is empty</h3>
                        <p>Looks like you haven't added anything yet.</p>
                        <Link to="/products" className="btn btn-primary" onClick={onClose}>
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Items */}
                        <div className="cart-sidebar__items">
                            {cartItems.map((item) => (
                                <div key={`${item.id}-${JSON.stringify(item.selectedVariant)}`} className="cart-item">
                                    <div className="cart-item__image">
                                        <img src={item.images[0]} alt={item.name} />
                                    </div>
                                    <div className="cart-item__details">
                                        <Link
                                            to={`/product/${item.id}`}
                                            className="cart-item__name"
                                            onClick={onClose}
                                        >
                                            {item.name}
                                        </Link>
                                        {item.selectedVariant && (
                                            <p className="cart-item__variant">
                                                {Object.entries(item.selectedVariant).map(([key, value]) => (
                                                    <span key={key}>{key}: {value}</span>
                                                ))}
                                            </p>
                                        )}
                                        <p className="cart-item__price">{formatPrice(item.price)}</p>
                                        <div className="cart-item__actions">
                                            <div className="cart-item__quantity">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedVariant)}
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedVariant)}
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <button
                                                className="cart-item__remove"
                                                onClick={() => removeFromCart(item.id, item.selectedVariant)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="cart-sidebar__footer">
                            <div className="cart-sidebar__subtotal">
                                <span>Subtotal</span>
                                <span className="cart-sidebar__total-price">{formatPrice(getCartTotal())}</span>
                            </div>
                            <p className="cart-sidebar__shipping">Shipping calculated at checkout</p>

                            <Link to="/checkout" className="btn btn-primary cart-sidebar__checkout" onClick={onClose}>
                                Checkout
                                <ArrowRight size={18} />
                            </Link>

                            <Link to="/cart" className="cart-sidebar__view-cart" onClick={onClose}>
                                View Cart
                            </Link>

                            <button className="cart-sidebar__clear" onClick={clearCart}>
                                Clear Cart
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
