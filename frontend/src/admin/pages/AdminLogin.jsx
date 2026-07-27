import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import './AdminLogin.css';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const [mfaChallengeId, setMfaChallengeId] = useState(null);
    const [otp, setOtp] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { user, login, verifyMfa } = useAuth();
    const navigate = useNavigate();
    const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

    // If already logged in as admin, instantly redirect to dashboard
    useEffect(() => {
        if (user && user.email === ADMIN_EMAIL) {
            navigate('/admin');
        }
    }, [user, navigate, ADMIN_EMAIL]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (mfaChallengeId) {
            const result = await verifyMfa(mfaChallengeId, otp);
            setLoading(false);
            if (result.success) {
                navigate('/admin');
            } else {
                setError(result.message || 'Invalid verification code.');
            }
            return;
        }

        if (email !== ADMIN_EMAIL) {
            setError('Unauthorized email address.');
            setLoading(false);
            return;
        }

        const result = await login(email, password);
        setLoading(false);

        if (result.requiresMfa) {
            setMfaChallengeId(result.challengeId);
            return;
        }

        if (result.success) {
            navigate('/admin');
        } else {
            setError(result.message || 'Authentication failed. Please try again.');
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <ShieldAlert size={40} className="admin-login-icon" />
                    <h1>Admin Portal</h1>
                    <p>Secure login for authorized personnel only.</p>
                </div>

                <form className="admin-login-form" onSubmit={handleSubmit}>
                    {mfaChallengeId ? (
                        <div className="admin-field">
                            <label>Verification Code</label>
                            <div className="admin-input-wrapper">
                                <Lock size={18} className="admin-input-icon" />
                                <input
                                    type="text"
                                    placeholder="6-digit code"
                                    value={otp}
                                    onChange={(e) => { setOtp(e.target.value); setError(''); }}
                                    required
                                    autoComplete="one-time-code"
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="admin-field">
                                <label>Admin Email</label>
                                <div className="admin-input-wrapper">
                                    <Mail size={18} className="admin-input-icon" />
                                    <input
                                        type="email"
                                        placeholder="admin@example.com"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div className="admin-field">
                                <label>Password</label>
                                <div className="admin-input-wrapper">
                                    <Lock size={18} className="admin-input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                        required
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        className="admin-toggle-password"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {error && <div className="admin-error-message">{error}</div>}

                    <button type="submit" className="admin-submit-btn" disabled={loading}>
                        {loading ? (
                            <span className="admin-spinner" />
                        ) : (
                            <>
                                <span>{mfaChallengeId ? 'Verify Code' : 'Secure Login'}</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>
                
                <div className="admin-login-footer">
                    <button type="button" onClick={() => navigate('/')}>
                        ← Return to Storefront
                    </button>
                </div>
            </div>
        </div>
    );
}
