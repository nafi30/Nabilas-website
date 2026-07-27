import { createContext, useContext, useState, useEffect } from 'react';
import { databases, Query } from '../lib/appwrite';
import { products as mockProducts } from '../data/products';

const ProductContext = createContext();

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PRODUCTS_ID = import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID;

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            if (!DB_ID || !PRODUCTS_ID) {
                console.warn('Appwrite DB or Products collection ID not set. Using mock products.');
                setProducts(mockProducts);
                setError(null);
                return;
            }

            const response = await databases.listDocuments(
                DB_ID,
                PRODUCTS_ID,
                [Query.limit(100), Query.orderDesc('$createdAt')]
            );
            
            if (!response.documents || response.documents.length === 0) {
                console.info('No documents in Appwrite collection. Using mock products.');
                setProducts(mockProducts);
            } else {
                // Map Appwrite fields to match expected frontend structure
                const formattedProducts = response.documents.map(doc => {
                    const stockVal = parseInt(doc.stock);
                    const isUnlimited = stockVal === -1;
                    
                    // Parse colors and sizes dynamically if provided from DB
                    let parsedColors = null;
                    if (Array.isArray(doc.colors)) {
                        parsedColors = doc.colors;
                    } else if (typeof doc.colors === 'string' && doc.colors.trim() !== '') {
                        parsedColors = doc.colors.split(',').map(c => c.trim()).filter(Boolean);
                    } else if (typeof doc.color === 'string' && doc.color.trim() !== '') {
                        parsedColors = doc.color.split(',').map(c => c.trim()).filter(Boolean);
                    }

                    let parsedSizes = null;
                    if (Array.isArray(doc.sizes)) {
                        parsedSizes = doc.sizes;
                    } else if (typeof doc.sizes === 'string' && doc.sizes.trim() !== '') {
                        parsedSizes = doc.sizes.split(',').map(s => s.trim()).filter(Boolean);
                    } else if (typeof doc.size === 'string' && doc.size.trim() !== '') {
                        parsedSizes = doc.size.split(',').map(s => s.trim()).filter(Boolean);
                    }

                    return {
                        ...doc,
                        id: doc.$id, 
                        images: doc.image ? doc.image.split(',') : [],
                        colors: parsedColors,
                        sizes: parsedSizes,
                        inStock: isUnlimited || stockVal > 0,
                        stockCount: isUnlimited ? 999999 : (stockVal || 0),
                        rating: 4.5,
                        reviews: 12,
                        discount: 0,
                        originalPrice: doc.price,
                        tags: doc.tag ? [doc.tag.toLowerCase()] : [],
                        brand: 'Namira Nabila'
                    };
                });

                setProducts(formattedProducts);
            }
            setError(null);
        } catch (err) {
            console.error('Error fetching products from Appwrite, falling back to mock products:', err);
            setProducts(mockProducts);
            setError(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <ProductContext.Provider value={{ products, loading, error, refreshProducts: fetchProducts }}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    return useContext(ProductContext);
}
