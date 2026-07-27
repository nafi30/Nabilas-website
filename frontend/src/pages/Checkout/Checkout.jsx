import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ChevronRight, Check, CreditCard, Truck,
    ShieldCheck, Lock, ArrowLeft
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../auth/AuthContext';
import { databases, ID, Permission, Role } from '../../lib/appwrite';
import './Checkout.css';

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const ORDERS_ID = import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID;

export default function Checkout() {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const [formData, setFormData] = useState({
        // Shipping
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        apartment: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
        phone: '',
        // Payment
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvv: '',
        saveCard: false
    });

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
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (step < 3) {
            setStep(step + 1);
        } else {
            setIsProcessing(true);

            try {
                // Save order to Appwrite
                const itemsSummary = cartItems.map(item => `${item.name} x${item.quantity}`).join(', ');

                await databases.createDocument(
                    DB_ID,
                    ORDERS_ID,
                    ID.unique(),
                    {
                        userId: user?.$id || 'guest',
                        items: itemsSummary,
                        total: parseFloat(total.toFixed(2)),
                        status: 'Processing',
                        shippingName: `${formData.firstName} ${formData.lastName}`,
                        shippingEmail: formData.email,
                        shippingPhone: formData.phone,
                        shippingStreet: formData.address,
                        shippingCity: formData.city,
                        shippingZip: formData.zipCode,
                        paymentMethod: 'card'
                    },
                    user ? [
                        Permission.read(Role.user(user.$id)),
                        Permission.update(Role.user(user.$id))
                    ] : []
                );

                clearCart();
                navigate('/checkout/success');
            } catch (err) {
                console.error('Order save error:', err);
                alert('Order could not be placed. Please try again.');
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const steps = [
        { number: 1, label: 'Shipping', icon: Truck },
        { number: 2, label: 'Payment', icon: CreditCard },
        { number: 3, label: 'Review', icon: ShieldCheck }
    ];

    if (cartItems.length === 0 && step !== 3) {
        return (
            <main className="checkout-page">
                <div className="container">
                    <div className="checkout-page__empty">
                        <h1>Your cart is empty</h1>
                        <p>Add some items before proceeding to checkout.</p>
                        <Link to="/products" className="btn btn-primary">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="checkout-page">
            <div className="container">
                {/* Header */}
                <div className="checkout-page__header">
                    <Link to="/cart" className="checkout-page__back">
                        <ArrowLeft size={20} />
                        Back to Cart
                    </Link>
                    <Link to="/" className="checkout-page__logo">
                        <span>🛍️</span>
                        <span>Namira Nabila Creations</span>
                    </Link>
                    <div className="checkout-page__secure">
                        <Lock size={16} />
                        Secure Checkout
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="checkout-steps">
                    {steps.map((s, index) => (
                        <div
                            key={s.number}
                            className={`checkout-step ${step === s.number ? 'active' : ''} ${step > s.number ? 'completed' : ''}`}
                        >
                            <div className="checkout-step__icon">
                                {step > s.number ? <Check size={18} /> : <s.icon size={18} />}
                            </div>
                            <span className="checkout-step__label">{s.label}</span>
                            {index < steps.length - 1 && (
                                <div className="checkout-step__line" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="checkout-page__content">
                    {/* Form */}
                    <div className="checkout-form">
                        <form onSubmit={handleSubmit}>
                            {/* Step 1: Shipping */}
                            {step === 1 && (
                                <div className="checkout-section animate-fade-in">
                                    <h2>Shipping Information</h2>

                                    <div className="form-group">
                                        <label htmlFor="email">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="your@email.com"
                                            required
                                            className="input"
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="firstName">First Name</label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                required
                                                className="input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="lastName">Last Name</label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                required
                                                className="input"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="address">Street Address</label>
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="123 Main Street"
                                            required
                                            className="input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="apartment">Apartment, suite, etc. (optional)</label>
                                        <input
                                            type="text"
                                            id="apartment"
                                            name="apartment"
                                            value={formData.apartment}
                                            onChange={handleInputChange}
                                            className="input"
                                        />
                                    </div>

                                    <div className="form-row form-row--3">
                                        <div className="form-group">
                                            <label htmlFor="city">City</label>
                                            <input
                                                type="text"
                                                id="city"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                required
                                                className="input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="state">State</label>
                                            <input
                                                type="text"
                                                id="state"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                required
                                                className="input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="zipCode">ZIP Code</label>
                                            <input
                                                type="text"
                                                id="zipCode"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                required
                                                className="input"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="phone">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+1 (555) 000-0000"
                                            required
                                            className="input"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Payment */}
                            {step === 2 && (
                                <div className="checkout-section animate-fade-in">
                                    <h2>Payment Method</h2>

                                    <div className="payment-methods">
                                        <label className="payment-method active">
                                            <input type="radio" name="paymentMethod" value="card" defaultChecked />
                                            <CreditCard size={20} />
                                            Credit/Debit Card
                                        </label>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="cardNumber">Card Number</label>
                                        <input
                                            type="text"
                                            id="cardNumber"
                                            name="cardNumber"
                                            value={formData.cardNumber}
                                            onChange={handleInputChange}
                                            placeholder="1234 5678 9012 3456"
                                            required
                                            className="input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="cardName">Name on Card</label>
                                        <input
                                            type="text"
                                            id="cardName"
                                            name="cardName"
                                            value={formData.cardName}
                                            onChange={handleInputChange}
                                            required
                                            className="input"
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="expiry">Expiry Date</label>
                                            <input
                                                type="text"
                                                id="expiry"
                                                name="expiry"
                                                value={formData.expiry}
                                                onChange={handleInputChange}
                                                placeholder="MM/YY"
                                                required
                                                className="input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="cvv">CVV</label>
                                            <input
                                                type="text"
                                                id="cvv"
                                                name="cvv"
                                                value={formData.cvv}
                                                onChange={handleInputChange}
                                                placeholder="123"
                                                required
                                                className="input"
                                            />
                                        </div>
                                    </div>

                                    <label className="form-checkbox">
                                        <input
                                            type="checkbox"
                                            name="saveCard"
                                            checked={formData.saveCard}
                                            onChange={handleInputChange}
                                        />
                                        <span className="form-checkbox__box" />
                                        Save card for future purchases
                                    </label>
                                </div>
                            )}

                            {/* Step 3: Review */}
                            {step === 3 && (
                                <div className="checkout-section animate-fade-in">
                                    <h2>Review Your Order</h2>

                                    <div className="review-section">
                                        <h3>Shipping Address</h3>
                                        <p>
                                            {formData.firstName} {formData.lastName}<br />
                                            {formData.address}{formData.apartment && `, ${formData.apartment}`}<br />
                                            {formData.city}, {formData.state} {formData.zipCode}<br />
                                            {formData.phone}
                                        </p>
                                        <button
                                            type="button"
                                            className="review-section__edit"
                                            onClick={() => setStep(1)}
                                        >
                                            Edit
                                        </button>
                                    </div>

                                    <div className="review-section">
                                        <h3>Payment Method</h3>
                                        <p>
                                            <CreditCard size={16} />
                                            Card ending in {formData.cardNumber.slice(-4) || '****'}
                                        </p>
                                        <button
                                            type="button"
                                            className="review-section__edit"
                                            onClick={() => setStep(2)}
                                        >
                                            Edit
                                        </button>
                                    </div>

                                    <div className="review-items">
                                        <h3>Order Items ({cartItems.length})</h3>
                                        {cartItems.map((item) => (
                                            <div key={`${item.id}-${JSON.stringify(item.selectedVariant)}`} className="review-item">
                                                <img src={item.images[0]} alt={item.name} />
                                                <div className="review-item__info">
                                                    <span className="review-item__name">{item.name}</span>
                                                    <span className="review-item__quantity">Qty: {item.quantity}</span>
                                                </div>
                                                <span className="review-item__price">
                                                    {formatPrice(item.price * item.quantity)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Navigation */}
                            <div className="checkout-nav">
                                {step > 1 && (
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setStep(step - 1)}
                                    >
                                        Back
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>Processing...</>
                                    ) : step === 3 ? (
                                        <>Place Order • {formatPrice(total)}</>
                                    ) : (
                                        <>
                                            Continue
                                            <ChevronRight size={18} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="checkout-summary">
                        <h2>Order Summary</h2>

                        <div className="checkout-summary__items">
                            {cartItems.map((item) => (
                                <div key={`${item.id}-${JSON.stringify(item.selectedVariant)}`} className="checkout-summary__item">
                                    <div className="checkout-summary__image">
                                        <img src={item.images[0]} alt={item.name} />
                                        <span className="checkout-summary__qty">{item.quantity}</span>
                                    </div>
                                    <div className="checkout-summary__info">
                                        <span className="checkout-summary__name">{item.name}</span>
                                        {item.selectedVariant && (
                                            <span className="checkout-summary__variant">
                                                {Object.values(item.selectedVariant).join(' / ')}
                                            </span>
                                        )}
                                    </div>
                                    <span className="checkout-summary__price">
                                        {formatPrice(item.price * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="checkout-summary__totals">
                            <div className="checkout-summary__row">
                                <span>Subtotal</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <div className="checkout-summary__row">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                            </div>
                            <div className="checkout-summary__row">
                                <span>Tax</span>
                                <span>{formatPrice(tax)}</span>
                            </div>
                            <div className="checkout-summary__divider"></div>
                            <div className="checkout-summary__row checkout-summary__row--total">
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
