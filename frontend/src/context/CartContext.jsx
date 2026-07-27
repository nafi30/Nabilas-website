import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1, selectedVariant = null) => {
        setCartItems(prev => {
            const existingIndex = prev.findIndex(
                item => item.id === product.id &&
                    JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant)
            );

            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex].quantity += quantity;
                return updated;
            }

            return [...prev, { ...product, quantity, selectedVariant }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId, selectedVariant = null) => {
        setCartItems(prev =>
            prev.filter(item =>
                !(item.id === productId &&
                    JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant))
            )
        );
    };

    const updateQuantity = (productId, quantity, selectedVariant = null) => {
        if (quantity <= 0) {
            removeFromCart(productId, selectedVariant);
            return;
        }

        setCartItems(prev =>
            prev.map(item =>
                item.id === productId &&
                    JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant)
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    return (
        <CartContext.Provider value={{
            cartItems,
            isCartOpen,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getCartCount,
            openCart,
            closeCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
