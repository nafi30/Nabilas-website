import { useState } from 'react';
import { User, Lock, Store, Check, Save } from 'lucide-react';
import { account } from '../../lib/appwrite';
import { useAuth } from '../../auth/AuthContext';

export default function AdminSettings() {
    const { user } = useAuth();
    const [activeSection, setActiveSection] = useState('profile');

    // Profile
    const [name, setName] = useState(user?.name || '');
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileMsg, setProfileMsg] = useState('');

    // Password
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordMsg, setPasswordMsg] = useState('');

    // Store Info
    const [storeName, setStoreName] = useState('Namira Nabila Creations');
    const [storeDesc, setStoreDesc] = useState('Discover the best products from around the world. Quality, style, and value delivered to your doorstep.');
    const [storeSaving, setStoreSaving] = useState(false);
    const [storeMsg, setStoreMsg] = useState('');

    const handleProfileSave = async () => {
        setProfileSaving(true);
        setProfileMsg('');
        try {
            await account.updateName(name);
            setProfileMsg('✅ Name updated successfully!');
        } catch (err) {
            setProfileMsg('❌ ' + err.message);
        } finally {
            setProfileSaving(false);
        }
    };

    const handlePasswordSave = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordMsg('❌ New passwords do not match.');
            return;
        }
        if (newPassword.length < 8) {
            setPasswordMsg('❌ Password must be at least 8 characters.');
            return;
        }
        setPasswordSaving(true);
        setPasswordMsg('');
        try {
            await account.updatePassword(newPassword, oldPassword);
            setPasswordMsg('✅ Password changed successfully!');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setPasswordMsg('❌ ' + err.message);
        } finally {
            setPasswordSaving(false);
        }
    };

    const handleStoreSave = () => {
        setStoreSaving(true);
        // Store info is cosmetic for now — future: save to Appwrite
        setTimeout(() => {
            setStoreMsg('✅ Store info saved locally. (Database storage coming soon)');
            setStoreSaving(false);
        }, 500);
    };

    const sections = [
        { id: 'profile', label: 'Your Profile', icon: User },
        { id: 'password', label: 'Change Password', icon: Lock },
        { id: 'store', label: 'Store Info', icon: Store },
    ];

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>Settings</h1>
                <p style={{ color: '#666', fontSize: '0.85rem' }}>Manage your admin profile and store settings</p>
            </div>

            <div className="admin-settings-grid">
                {/* Settings Sidebar */}
                <div className="admin-settings-sidebar">
                    {sections.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveSection(id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '0.75rem 1rem', borderRadius: 10,
                                background: activeSection === id ? 'rgba(236,72,153,0.12)' : 'transparent',
                                color: activeSection === id ? '#ec4899' : '#888',
                                border: 'none', cursor: 'pointer', fontSize: '0.85rem',
                                fontWeight: activeSection === id ? 600 : 400,
                                textAlign: 'left', transition: 'all 0.2s',
                            }}
                        >
                            <Icon size={18} />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Settings Content */}
                <div style={{
                    background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 14, padding: '2rem',
                }}>
                    {/* Profile Section */}
                    {activeSection === 'profile' && (
                        <div>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                                <User size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                Your Profile
                            </h2>
                            <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Update your personal information</p>

                            <div className="admin-field">
                                <label>Email</label>
                                <input value={user?.email || ''} disabled style={{ opacity: 0.5 }} />
                                <span style={{ fontSize: '0.7rem', color: '#555', marginTop: '0.3rem', display: 'block' }}>Email cannot be changed</span>
                            </div>

                            <div className="admin-field">
                                <label>Display Name</label>
                                <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
                            </div>

                            {profileMsg && (
                                <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: profileMsg.startsWith('✅') ? '#22c55e' : '#ef4444' }}>
                                    {profileMsg}
                                </p>
                            )}

                            <button className="admin-btn admin-btn--primary" onClick={handleProfileSave} disabled={profileSaving}>
                                {profileSaving ? 'Saving...' : <><Save size={16} /> Save Profile</>}
                            </button>
                        </div>
                    )}

                    {/* Password Section */}
                    {activeSection === 'password' && (
                        <div>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                                <Lock size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                Change Password
                            </h2>
                            <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Update your account password</p>

                            <div className="admin-field">
                                <label>Current Password</label>
                                <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="••••••••" />
                            </div>

                            <div className="admin-field">
                                <label>New Password</label>
                                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min 8 characters" />
                            </div>

                            <div className="admin-field">
                                <label>Confirm New Password</label>
                                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                            </div>

                            {passwordMsg && (
                                <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: passwordMsg.startsWith('✅') ? '#22c55e' : '#ef4444' }}>
                                    {passwordMsg}
                                </p>
                            )}

                            <button className="admin-btn admin-btn--primary" onClick={handlePasswordSave} disabled={passwordSaving}>
                                {passwordSaving ? 'Changing...' : <><Lock size={16} /> Change Password</>}
                            </button>
                        </div>
                    )}

                    {/* Store Info Section */}
                    {activeSection === 'store' && (
                        <div>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                                <Store size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                Store Information
                            </h2>
                            <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Update your store name and description</p>

                            <div className="admin-field">
                                <label>Store Name</label>
                                <input value={storeName} onChange={e => setStoreName(e.target.value)} />
                            </div>

                            <div className="admin-field">
                                <label>Store Description</label>
                                <textarea value={storeDesc} onChange={e => setStoreDesc(e.target.value)} rows={4} />
                            </div>

                            <div style={{
                                background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)',
                                borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1.5rem',
                                fontSize: '0.8rem', color: '#93c5fd',
                            }}>
                                ℹ️ Store settings will be fully dynamic when the store configuration system is built.
                            </div>

                            {storeMsg && (
                                <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: '#22c55e' }}>
                                    {storeMsg}
                                </p>
                            )}

                            <button className="admin-btn admin-btn--primary" onClick={handleStoreSave} disabled={storeSaving}>
                                {storeSaving ? 'Saving...' : <><Save size={16} /> Save Store Info</>}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
