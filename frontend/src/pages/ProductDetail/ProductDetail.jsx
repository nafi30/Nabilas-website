import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Heart, ShoppingCart, Star, Minus, Plus,
    Truck, Shield, RotateCcw, Share2, ChevronRight, ChevronLeft,
    Check, X
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import ProductCard from '../../components/product/ProductCard';
import { useProducts } from '../../context/ProductContext';
import './ProductDetail.css';

export default function ProductDetail() {
    const { id } = useParams();
    const { products, loading } = useProducts();
    
    // Support both dummy integer IDs and Appwrite string IDs
    const product = products.find(p => p.id.toString() === id);

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);
    const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);
    const [activeTab, setActiveTab] = useState('description');
    const [isZoomed, setIsZoomed] = useState(false);
    const galleryRef = useRef(null);

    const productImages = product?.images || (product?.image ? product.image.split(',') : []);

    const handleScroll = (e) => {
        const scrollPosition = e.target.scrollLeft;
        const width = e.target.clientWidth;
        const index = Math.round(scrollPosition / width);
        if (index !== selectedImage) {
            setSelectedImage(index);
        }
    };

    const scrollToImage = (index) => {
        if (galleryRef.current) {
            const width = galleryRef.current.clientWidth;
            galleryRef.current.scrollTo({ left: width * index, behavior: 'smooth' });
            setSelectedImage(index);
        }
    };

    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();

    if (loading) {
        return (
            <main className="product-detail">
                <div className="container" style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
                    Loading product details...
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="product-detail">
                <div className="container">
                    <div className="product-detail__not-found">
                        <h1>Product Not Found</h1>
                        <p>The product you're looking for doesn't exist.</p>
                        <Link to="/products" className="btn btn-primary">
                            Browse Products
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const formatPrice = (price) => {
        return (
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                {Number(price).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                <span style={{ fontSize: '1.2em', marginLeft: '4px', fontWeight: '500' }}>৳</span>
            </span>
        );
    };

    const handleAddToCart = () => {
        const variant = {};
        if (selectedColor) variant.color = selectedColor;
        if (selectedSize) variant.size = selectedSize;

        addToCart(product, quantity, Object.keys(variant).length > 0 ? variant : null);
    };

    const handleToggleWishlist = () => {
        toggleWishlist(product);
    };

    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    const inWishlist = isInWishlist(product.id);

    return (
        <main className="product-detail">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <Link to="/">Home</Link>
                    <ChevronRight size={14} />
                    <Link to="/products">Products</Link>
                    <ChevronRight size={14} />
                    <Link to={`/products?category=${product.category.toLowerCase()}`}>
                        {product.category}
                    </Link>
                    <ChevronRight size={14} />
                    <span>{product.name}</span>
                </nav>

                {/* Product Main Section */}
                <div className="product-detail__main">
                    {/* Image Gallery */}
                    <div className="product-gallery">
                        <div className="product-gallery__main-wrapper">
                            <div 
                                className="product-gallery__carousel"
                                ref={galleryRef}
                                onScroll={handleScroll}
                            >
                                {productImages.map((image, index) => (
                                    <div 
                                        key={index} 
                                        className={`product-gallery__slide ${isZoomed ? 'zoomed' : ''}`} 
                                        onClick={() => setIsZoomed(!isZoomed)}
                                    >
                                        <img src={image} alt={`${product.name} ${index + 1}`} />
                                        {product.discount > 0 && index === 0 && (
                                            <span className="product-gallery__badge">-{product.discount}%</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {productImages.length > 1 && (
                                <>
                                    {selectedImage > 0 && (
                                        <button 
                                            className="product-gallery__arrow product-gallery__arrow--prev"
                                            onClick={() => scrollToImage(selectedImage - 1)}
                                            aria-label="Previous image"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                    )}
                                    {selectedImage < productImages.length - 1 && (
                                        <button 
                                            className="product-gallery__arrow product-gallery__arrow--next"
                                            onClick={() => scrollToImage(selectedImage + 1)}
                                            aria-label="Next image"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    )}
                                </>
                            )}
                        </div>

                        {productImages.length > 1 && (
                            <div className="product-gallery__dots">
                                {productImages.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`product-gallery__dot ${index === selectedImage ? 'active' : ''}`}
                                        onClick={() => scrollToImage(index)}
                                        title={`View image ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="product-info">
                        <div className="product-info__header">
                            <span className="product-info__brand">{product.brand}</span>
                            <button
                                className="product-info__share"
                                onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
                            >
                                <Share2 size={20} />
                            </button>
                        </div>

                        <h1 className="product-info__name">{product.name}</h1>

                        <div className="product-info__rating">
                            <div className="product-info__stars">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                                        className={i < Math.floor(product.rating) ? 'filled' : ''}
                                    />
                                ))}
                            </div>
                            <span className="product-info__rating-value">{product.rating}</span>
                            <span className="product-info__reviews">({product.reviews} reviews)</span>
                        </div>

                        <div className="product-info__pricing">
                            <span className="product-info__price">{formatPrice(product.price)}</span>
                            {product.originalPrice > product.price && (
                                <>
                                    <span className="product-info__original">{formatPrice(product.originalPrice)}</span>
                                    <span className="product-info__discount">Save {product.discount}%</span>
                                </>
                            )}
                        </div>

                        <p className="product-info__description">{product.description}</p>

                        {/* Color Selection */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="product-info__option">
                                <label>Color: <span>{selectedColor}</span></label>
                                <div className="product-info__colors">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            className={`product-info__color ${selectedColor === color ? 'active' : ''}`}
                                            onClick={() => setSelectedColor(color)}
                                            title={color}
                                            style={{
                                                backgroundColor: (() => {
                                                    const c = color.trim().toLowerCase();
                                                    if (c.startsWith('#') || c.startsWith('rgb') || c.startsWith('hsl')) return color;
                                                    const colorMap = {
                                                        'white': '#ffffff', 'black': '#1a1a1a', 'navy': '#1e3a5f', 'silver': '#c0c0c0',
                                                        'gold': '#ffd700', 'brown': '#8b4513', 'tan': '#d2b48c', 'wood': '#deb887',
                                                        'purple': '#9b59b6', 'blue': '#3498db', 'green': '#27ae60', 'mint': '#98ff98',
                                                        'red': '#e74c3c', 'pink': '#ff69b4', 'yellow': '#f1c40f', 'orange': '#e67e22',
                                                        'grey': '#888888', 'gray': '#888888', 'maroon': '#800000', 'olive': '#808000'
                                                    };
                                                    return colorMap[c] || color;
                                                })()
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selection */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="product-info__option">
                                <label>Size: <span>{selectedSize}</span></label>
                                <div className="product-info__sizes">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            className={`product-info__size ${selectedSize === size ? 'active' : ''}`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="product-info__option">
                            <label>Quantity</label>
                            <div className="product-info__quantity">
                                <button
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    disabled={quantity <= 1}
                                >
                                    <Minus size={18} />
                                </button>
                                <span>{quantity}</span>
                                <button
                                    onClick={() => setQuantity(prev => Math.min(product.stockCount, prev + 1))}
                                    disabled={quantity >= product.stockCount}
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                            {product.stockCount < 10 && (
                                <span className="product-info__stock-warning">
                                    Only {product.stockCount} left in stock
                                </span>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="product-info__actions">
                            <button
                                className="btn btn-primary product-info__add-to-cart"
                                onClick={handleAddToCart}
                            >
                                <ShoppingCart size={20} />
                                Add to Cart
                            </button>
                            <button
                                className={`product-info__wishlist ${inWishlist ? 'active' : ''}`}
                                onClick={handleToggleWishlist}
                            >
                                <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
                            </button>
                        </div>

                        {/* Features */}
                        <div className="product-info__features">
                            <div className="product-info__feature">
                                <Truck size={20} />
                                <div>
                                    <span>Free Shipping</span>
                                    <p>On orders over $50</p>
                                </div>
                            </div>
                            <div className="product-info__feature">
                                <RotateCcw size={20} />
                                <div>
                                    <span>Easy Returns</span>
                                    <p>30-day return policy</p>
                                </div>
                            </div>
                            <div className="product-info__feature">
                                <Shield size={20} />
                                <div>
                                    <span>Secure Checkout</span>
                                    <p>100% protected payment</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Tabs */}
                <div className="product-tabs">
                    <div className="product-tabs__header">
                        <button
                            className={activeTab === 'description' ? 'active' : ''}
                            onClick={() => setActiveTab('description')}
                        >
                            Description
                        </button>
                        <button
                            className={activeTab === 'specs' ? 'active' : ''}
                            onClick={() => setActiveTab('specs')}
                        >
                            Specifications
                        </button>
                        <button
                            className={activeTab === 'reviews' ? 'active' : ''}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Reviews ({product.reviews})
                        </button>
                    </div>

                    <div className="product-tabs__content">
                        {activeTab === 'description' && (
                            <div className="product-tabs__description">
                                <p>{product.description}</p>
                            </div>
                        )}

                        {activeTab === 'specs' && (
                            <div className="product-tabs__specs">
                                <table>
                                    <tbody>
                                        {product.specs && Object.entries(product.specs).map(([key, value]) => (
                                            <tr key={key}>
                                                <th>{key}</th>
                                                <td>{value}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <th>Brand</th>
                                            <td>{product.brand}</td>
                                        </tr>
                                        <tr>
                                            <th>Category</th>
                                            <td>{product.category}</td>
                                        </tr>
                                        <tr>
                                            <th>Availability</th>
                                            <td>
                                                {product.inStock ? (
                                                    <span className="in-stock"><Check size={14} /> In Stock</span>
                                                ) : (
                                                    <span className="out-of-stock"><X size={14} /> Out of Stock</span>
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="product-tabs__reviews">
                                <div className="reviews-summary">
                                    <div className="reviews-summary__score">
                                        <span className="reviews-summary__value">{product.rating}</span>
                                        <div className="reviews-summary__stars">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                                                    className={i < Math.floor(product.rating) ? 'filled' : ''}
                                                />
                                            ))}
                                        </div>
                                        <span className="reviews-summary__count">Based on {product.reviews} reviews</span>
                                    </div>
                                </div>
                                <p className="reviews-placeholder">
                                    Reviews will be loaded from the backend when connected.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="related-products">
                        <h2>You May Also Like</h2>
                        <div className="products-grid products-grid--4">
                            {relatedProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
