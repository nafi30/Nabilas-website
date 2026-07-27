import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './Cart.css';

export default function Cart() {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

    const formatPrice = (price) => {
        return (
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                {Number(price).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                <span style={{ fontSize: '1.2em', marginLeft: '4px', fontWeight: '500' }}>৳</span>
            </span>
        );
    };

    const subtotal = getCartTotal();
    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    if (cartItems.length === 0) {
        return (
            <main className="cart-page">
                <div className="container">
                    <div className="cart-page__empty">
                        <ShoppingBag size={64} className="cart-page__empty-icon" />
                        <h1>Your Cart is Empty</h1>
                        <p>Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/products" className="btn btn-primary">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="cart-page">
            <div className="container">
                <div className="cart-page__header">
                    <h1>Shopping Cart</h1>
                    <span className="cart-page__count">{cartItems.length} items</span>
                </div>

                <div className="cart-page__content">
                    {/* Cart Items */}
                    <div className="cart-page__items">
                        <div className="cart-table">
                            <div className="cart-table__header">
                                <span>Product</span>
                                <span>Price</span>
                                <span>Quantity</span>
                                <span>Total</span>
                                <span></span>
                            </div>

                            {cartItems.map((item) => (
                                <div
                                    key={`${item.id}-${JSON.stringify(item.selectedVariant)}`}
                                    className="cart-table__row"
                                >
                                    <div className="cart-table__product">
                                        <Link to={`/product/${item.id}`} className="cart-table__image">
                                            <img src={item.images[0]} alt={item.name} />
                                        </Link>
                                        <div className="cart-table__info">
                                            <Link to={`/product/${item.id}`} className="cart-table__name">
                                                {item.name}
                                            </Link>
                                            {item.selectedVariant && (
                                                <p className="cart-table__variant">
                                                    {Object.entries(item.selectedVariant).map(([key, value]) => (
                                                        <span key={key}>{key}: {value}</span>
                                                    ))}
                                                </p>
                                            )}
                                            <span className="cart-table__brand">{item.brand}</span>
                                        </div>
                                    </div>

                                    <div className="cart-table__price">
                                        <span className="cart-table__label">Price:</span>
                                        {formatPrice(item.price)}
                                    </div>

                                    <div className="cart-table__quantity">
                                        <span className="cart-table__label">Quantity:</span>
                                        <div className="cart-table__quantity-controls">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedVariant)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedVariant)}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="cart-table__total">
                                        <span className="cart-table__label">Total:</span>
                                        {formatPrice(item.price * item.quantity)}
                                    </div>

                                    <button
                                        className="cart-table__remove"
                                        onClick={() => removeFromCart(item.id, item.selectedVariant)}
                                        aria-label="Remove item"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-page__actions">
                            <Link to="/products" className="btn btn-secondary">
                                Continue Shopping
                            </Link>
                            <button className="btn btn-secondary" onClick={clearCart}>
                                Clear Cart
                            </button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="cart-page__summary">
                        <div className="order-summary">
                            <h2>Order Summary</h2>

                            {/* Coupon */}
                            <div className="order-summary__coupon">
                                <Tag size={18} />
                                <input type="text" placeholder="Enter coupon code" />
                                <button className="btn btn-secondary">Apply</button>
                            </div>

                            <div className="order-summary__details">
                                <div className="order-summary__row">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="order-summary__row">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                                </div>
                                {shipping === 0 && (
                                    <p className="order-summary__free-shipping">
                                        🎉 You qualify for free shipping!
                                    </p>
                                )}
                                <div className="order-summary__row">
                                    <span>Tax (8%)</span>
                                    <span>{formatPrice(tax)}</span>
                                </div>
                                <div className="order-summary__divider"></div>
                                <div className="order-summary__row order-summary__row--total">
                                    <span>Total</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                            </div>

                            <Link to="/checkout" className="btn btn-primary order-summary__checkout">
                                Proceed to Checkout
                                <ArrowRight size={18} />
                            </Link>

                            <div className="order-summary__security">
                                <span>🔒 Secure Checkout</span>
                                <span>💳 Multiple Payment Options</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
