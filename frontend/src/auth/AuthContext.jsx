import { createContext, useContext, useState, useEffect } from 'react';
import { account, databases, ID, Query } from '../lib/appwrite';

const AuthContext = createContext(null);

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PROFILES_ID = import.meta.env.VITE_APPWRITE_PROFILES_COLLECTION_ID;
const ORDERS_ID = import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        checkUserStatus();
    }, []);

    const fetchProfile = async (userId) => {
        try {
            const response = await databases.listDocuments(
                DB_ID,
                PROFILES_ID,
                [Query.equal('userId', userId)]
            );
            
            if (response.documents.length > 0) {
                setProfile(response.documents[0]);
                return response.documents[0];
            } else {
                const newProfile = await databases.createDocument(
                    DB_ID,
                    PROFILES_ID,
                    ID.unique(),
                    { userId, phone: '', street: '', city: '', state: '', zip: '', country: '' }
                );
                setProfile(newProfile);
                return newProfile;
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            return null;
        }
    };

    const fetchOrders = async (userId) => {
        try {
            const response = await databases.listDocuments(
                DB_ID,
                ORDERS_ID,
                [Query.equal('userId', userId), Query.orderDesc('$createdAt')]
            );
            setOrders(response.documents);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setOrders([]);
        }
    };

    const checkUserStatus = async () => {
        try {
            const session = await account.get();
            setUser(session);
            await fetchProfile(session.$id);
            await fetchOrders(session.$id);
        } catch (err) {
            setUser(null);
            setProfile(null);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setError('');
        try {
            await account.createEmailPasswordSession(email, password);
            const userDetails = await account.get();
            setUser(userDetails);
            await fetchProfile(userDetails.$id);
            await fetchOrders(userDetails.$id);
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        }
    };

    const register = async (name, email, password) => {
        setError('');
        try {
            await account.create(ID.unique(), email, password, name);
            return await login(email, password);
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        }
    };

    const updateProfile = async (updates) => {
        try {
            if (updates.name) {
                await account.updateName(updates.name);
                setUser(prev => ({ ...prev, name: updates.name }));
            }

            if (profile) {
                const { name, email, ...dbUpdates } = updates;
                const response = await databases.updateDocument(
                    DB_ID,
                    PROFILES_ID,
                    profile.$id,
                    dbUpdates
                );
                setProfile(response);
            }
            return { success: true };
        } catch (err) {
            console.error('Update profile error:', err);
            return { success: false, message: err.message };
        }
    };

    const logout = async () => {
        try {
            await account.deleteSession('current');
            setUser(null);
            setProfile(null);
            setOrders([]);
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const value = {
        user,
        profile,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        orders,
        refreshOrders: () => user && fetchOrders(user.$id),
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
