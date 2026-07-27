import { useState } from 'react';
import { databases, ID } from '../lib/appwrite';
import { products } from '../data/products';

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PRODUCTS_ID = import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID;

export default function Migrate() {
    const [status, setStatus] = useState('Ready to migrate');
    const [loading, setLoading] = useState(false);

    const runMigration = async () => {
        setLoading(true);
        setStatus('Starting migration...');

        try {
            for (const item of products) {
                setStatus(`Uploading: ${item.name}...`);
                await databases.createDocument(
                    DB_ID,
                    PRODUCTS_ID,
                    ID.unique(),
                    {
                        name: item.name,
                        description: item.description,
                        price: item.price,
                        category: item.category,
                        image: item.images[0], // Taking the first image
                        stock: item.stockCount || 0,
                        tag: item.tags ? item.tags[0] : ''
                    }
                );
            }
            setStatus('✅ SUCCESS! All products uploaded to Appwrite.');
        } catch (err) {
            console.error(err);
            setStatus('❌ ERROR: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '100px', textAlign: 'center', background: '#0a0a0a', color: 'white', minHeight: '100vh' }}>
            <h1>Product Migration Tool</h1>
            <p style={{ margin: '20px 0', color: '#888' }}>This will move your products from the code to Appwrite.</p>
            <div style={{ padding: '20px', border: '1px solid #333', borderRadius: '10px', display: 'inline-block' }}>
                <p style={{ marginBottom: '20px', fontWeight: 'bold' }}>{status}</p>
                <button 
                    onClick={runMigration} 
                    disabled={loading}
                    style={{
                        padding: '12px 24px',
                        background: '#ec4899',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Migrating...' : 'Start Migration'}
                </button>
            </div>
        </div>
    );
}
