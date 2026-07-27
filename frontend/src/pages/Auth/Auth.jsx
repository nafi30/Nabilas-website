import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import './Auth.css';

export default function Auth() {
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');

    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [mfaChallengeId, setMfaChallengeId] = useState(null);
    const [otp, setOtp] = useState('');

    const { user, login, register, verifyMfa } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.email === import.meta.env.VITE_ADMIN_EMAIL) {
                navigate('/admin');
            } else {
                navigate('/account');
            }
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFormError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormError('');

        if (mfaChallengeId) {
            const result = await verifyMfa(mfaChallengeId, otp);
            setLoading(false);
            if (result.success) {
                navigate('/admin');
            } else {
                setFormError(result.message || 'Invalid verification code.');
            }
            return;
        }

        let result;
        if (mode === 'login') {
            result = await login(form.email, form.password);
        } else {
            if (!form.name.trim()) {
                setFormError('Please enter your name.');
                setLoading(false);
                return;
            }
            result = await register(form.name, form.email, form.password);
        }

        setLoading(false);

        if (result.requiresMfa) {
            setMfaChallengeId(result.challengeId);
            return;
        }

        if (result.success) {
            navigate('/admin');
        } else {
            setFormError(result.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="auth-page">
            {/* Left — Branding Panel */}
            <div className="auth-page__panel">
                <div className="auth-page__panel-content">
                    <Link to="/" className="auth-page__logo">
                        <ShoppingBag size={28} />
                        <span>Namira Nabila Creations</span>
                    </Link>
                    <div className="auth-page__panel-text">
                        <h2>Premium quality,<br />crafted with love.</h2>
                        <p>Join our community and enjoy exclusive access to our curated collections, order tracking, and personalized shopping experience.</p>
                    </div>
                    <div className="auth-page__features">
                        {['Exclusive member discounts', 'Order tracking & history', 'Saved favorites', 'Priority customer care'].map((f) => (
                            <div key={f} className="auth-page__feature">
                                <span className="auth-page__feature-dot" />
                                <span>{f}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="auth-page__panel-bg" />
            </div>

            {/* Right — Form */}
            <div className="auth-page__form-side">
                <div className="auth-page__form-wrapper">
                    {/* Mobile Logo */}
                    <Link to="/" className="auth-page__mobile-logo">
                        <ShoppingBag size={22} />
                        <span>Namira Nabila Creations</span>
                    </Link>

                    {/* Mode Toggle */}
                    {!mfaChallengeId && (
                        <div className="auth-page__toggle">
                            <button
                                className={`auth-page__toggle-btn ${mode === 'login' ? 'active' : ''}`}
                                onClick={() => { setMode('login'); setFormError(''); }}
                            >
                                Sign In
                            </button>
                            <button
                                className={`auth-page__toggle-btn ${mode === 'register' ? 'active' : ''}`}
                                onClick={() => { setMode('register'); setFormError(''); }}
                            >
                                Create Account
                            </button>
                        </div>
                    )}

                    <div className="auth-page__heading">
                        {mfaChallengeId ? (
                            <>
                                <h1>Verification Required</h1>
                                <p>Please enter the 6-digit code sent to your email.</p>
                            </>
                        ) : (
                            <>
                                <h1>{mode === 'login' ? 'Welcome back' : 'Join us today'}</h1>
                                <p>{mode === 'login'
                                    ? 'Sign in to your account to continue shopping.'
                                    : 'Create your account in seconds.'}
                                </p>
                            </>
                        )}
                    </div>

                    <form className="auth-page__form" onSubmit={handleSubmit}>
                        {mfaChallengeId ? (
                            <div className="auth-field">
                                <label className="auth-field__label">Verification Code</label>
                                <div className="auth-field__input-wrapper">
                                    <Lock size={18} className="auth-field__icon" />
                                    <input
                                        type="text"
                                        name="otp"
                                        placeholder="123456"
                                        value={otp}
                                        onChange={(e) => { setOtp(e.target.value); setFormError(''); }}
                                        className="auth-field__input"
                                        required
                                        autoComplete="one-time-code"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Name — register only */}
                                {mode === 'register' && (
                                    <div className="auth-field">
                                        <label className="auth-field__label">Full Name</label>
                                        <div className="auth-field__input-wrapper">
                                            <User size={18} className="auth-field__icon" />
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Namira Nabila"
                                                value={form.name}
                                                onChange={handleChange}
                                                className="auth-field__input"
                                                required
                                                autoComplete="name"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Email */}
                                <div className="auth-field">
                                    <label className="auth-field__label">Email Address</label>
                                    <div className="auth-field__input-wrapper">
                                        <Mail size={18} className="auth-field__icon" />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="you@example.com"
                                            value={form.email}
                                            onChange={handleChange}
                                            className="auth-field__input"
                                            required
                                            autoComplete="email"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="auth-field">
                                    <div className="auth-field__label-row">
                                        <label className="auth-field__label">Password</label>
                                        {mode === 'login' && (
                                            <button type="button" className="auth-field__forgot">Forgot password?</button>
                                        )}
                                    </div>
                                    <div className="auth-field__input-wrapper">
                                        <Lock size={18} className="auth-field__icon" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            placeholder="••••••••"
                                            value={form.password}
                                            onChange={handleChange}
                                            className="auth-field__input"
                                            required
                                            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                                        />
                                        <button
                                            type="button"
                                            className="auth-field__toggle-password"
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label="Toggle password visibility"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Error */}
                        {formError && (
                            <div className="auth-page__error" role="alert">
                                {formError}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            className="auth-page__submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="auth-page__spinner" />
                            ) : (
                                <>
                                    <span>{mfaChallengeId ? 'Verify & Sign In' : mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {!mfaChallengeId && (
                        <p className="auth-page__switch">
                            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                            <button
                                type="button"
                                className="auth-page__switch-btn"
                                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setFormError(''); }}
                            >
                                {mode === 'login' ? 'Create one' : 'Sign in'}
                            </button>
                        </p>
                    )}

                    <p className="auth-page__back">
                        <Link to="/">← Back to store</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
