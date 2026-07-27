import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './ProductCard.css';

export default function ProductCard({ product, viewMode = 'grid' }) {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();

    const formatPrice = (price) => {
        return (
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                {Number(price).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                <span style={{ fontSize: '1.2em', marginLeft: '4px', fontWeight: '500' }}>৳</span>
            </span>
        );
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
    };

    const handleToggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
    };

    const inWishlist = isInWishlist(product.id);

    if (viewMode === 'list') {
        return (
            <div className="product-card product-card--list">
                <Link to={`/product/${product.id}`} className="product-card__image-wrapper">
                    {!imageLoaded && <div className="product-card__skeleton skeleton" />}
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className={`product-card__image ${imageLoaded ? 'loaded' : ''}`}
                        onLoad={() => setImageLoaded(true)}
                    />
                    {product.discount > 0 && (
                        <span className="product-card__badge product-card__badge--sale">
                            -{product.discount}%
                        </span>
                    )}
                </Link>

                <div className="product-card__content">
                    <div className="product-card__meta">
                        <span className="product-card__category">{product.category}</span>
                        <div className="product-card__rating">
                            <Star size={14} fill="currentColor" />
                            <span>{product.rating}</span>
                            <span className="product-card__reviews">({product.reviews})</span>
                        </div>
                    </div>

                    <Link to={`/product/${product.id}`}>
                        <h3 className="product-card__name">{product.name}</h3>
                    </Link>

                    <p className="product-card__description">{product.description}</p>

                    <div className="product-card__footer">
                        <div className="product-card__pricing">
                            <span className="product-card__price">{formatPrice(product.price)}</span>
                            {product.originalPrice > product.price && (
                                <span className="product-card__original-price">
                                    {formatPrice(product.originalPrice)}
                                </span>
                            )}
                        </div>

                        <div className="product-card__actions">
                            <button
                                className={`product-card__wishlist ${inWishlist ? 'active' : ''}`}
                                onClick={handleToggleWishlist}
                                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                            >
                                <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleAddToCart}
                            >
                                <ShoppingCart size={18} />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="product-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link to={`/product/${product.id}`} className="product-card__image-wrapper">
                {!imageLoaded && <div className="product-card__skeleton skeleton" />}
                <img
                    src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
                    alt={product.name}
                    className={`product-card__image ${imageLoaded ? 'loaded' : ''}`}
                    onLoad={() => setImageLoaded(true)}
                />

                {/* Badges */}
                <div className="product-card__badges">
                    {product.discount > 0 && (
                        <span className="product-card__badge product-card__badge--sale">
                            -{product.discount}%
                        </span>
                    )}
                    {product.tags?.includes('new') && (
                        <span className="product-card__badge product-card__badge--new">
                            New
                        </span>
                    )}
                    {product.tags?.includes('bestseller') && (
                        <span className="product-card__badge product-card__badge--bestseller">
                            Bestseller
                        </span>
                    )}
                </div>

                {/* Quick Actions */}
                <div className={`product-card__quick-actions ${isHovered ? 'visible' : ''}`}>
                    <button
                        className={`product-card__quick-btn ${inWishlist ? 'active' : ''}`}
                        onClick={handleToggleWishlist}
                        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
                    </button>
                    <button
                        className="product-card__quick-btn"
                        onClick={handleAddToCart}
                        aria-label="Add to cart"
                    >
                        <ShoppingCart size={18} />
                    </button>
                    <Link
                        to={`/product/${product.id}`}
                        className="product-card__quick-btn"
                        aria-label="Quick view"
                    >
                        <Eye size={18} />
                    </Link>
                </div>

                {/* Add to Cart Button */}
                <button
                    className={`product-card__add-to-cart ${isHovered ? 'visible' : ''}`}
                    onClick={handleAddToCart}
                >
                    <ShoppingCart size={18} />
                    Add to Cart
                </button>
            </Link>

            <div className="product-card__content">
                <div className="product-card__meta">
                    <span className="product-card__category">{product.category}</span>
                    <div className="product-card__rating">
                        <Star size={14} fill="currentColor" />
                        <span>{product.rating}</span>
                    </div>
                </div>

                <Link to={`/product/${product.id}`}>
                    <h3 className="product-card__name">{product.name}</h3>
                </Link>

                <div className="product-card__pricing">
                    <span className="product-card__price">{formatPrice(product.price)}</span>
                    {product.originalPrice > product.price && (
                        <span className="product-card__original-price">
                            {formatPrice(product.originalPrice)}
                        </span>
                    )}
                </div>

                {/* Color Options */}
                {product.colors && product.colors.length > 0 && (
                    <div className="product-card__colors">
                        {product.colors.slice(0, 4).map((color) => (
                            <span
                                key={color}
                                className="product-card__color"
                                title={color}
                                style={{
                                    backgroundColor: color.toLowerCase() === 'white' ? '#f1f1f1' :
                                        color.toLowerCase() === 'black' ? '#1a1a1a' :
                                            color.toLowerCase() === 'navy' ? '#1e3a5f' :
                                                color.toLowerCase() === 'silver' ? '#c0c0c0' :
                                                    color.toLowerCase() === 'gold' ? '#ffd700' :
                                                        color.toLowerCase() === 'brown' ? '#8b4513' :
                                                            color.toLowerCase() === 'tan' ? '#d2b48c' :
                                                                color.toLowerCase() === 'wood' ? '#deb887' :
                                                                    color.toLowerCase() === 'purple' ? '#9b59b6' :
                                                                        color.toLowerCase() === 'blue' ? '#3498db' :
                                                                            color.toLowerCase() === 'green' ? '#27ae60' :
                                                                                color.toLowerCase() === 'mint' ? '#98ff98' :
                                                                                    color.toLowerCase() === 'stainless steel' ? '#b4b4b4' :
                                                                                        color.toLowerCase().includes('red') ? '#e74c3c' :
                                                                                            color.toLowerCase().includes('blue') ? '#3498db' :
                                                                                                color.toLowerCase()
                                }}
                            />
                        ))}
                        {product.colors.length > 4 && (
                            <span className="product-card__color-more">
                                +{product.colors.length - 4}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
