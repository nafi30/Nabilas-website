import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, TrendingUp, Zap } from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';
import { banners } from '../../data/products';
import { categories } from '../../data/categories';
import { useProducts } from '../../context/ProductContext';
import './Home.css';

export default function Home() {
    const { products } = useProducts();
    const [currentBanner, setCurrentBanner] = useState(0);
    const [countdown, setCountdown] = useState({
        hours: 23,
        minutes: 45,
        seconds: 30
    });

    // Banner auto-rotate
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBanner(prev => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Countdown timer
    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                }
                return { hours: 23, minutes: 59, seconds: 59 };
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const featuredProducts = products.filter(p => p.tags?.includes('featured'));
    const bestSellers = products.filter(p => p.tags?.includes('bestseller'));
    const newArrivals = products.filter(p => p.tags?.includes('new'));

    const nextBanner = () => setCurrentBanner(prev => (prev + 1) % banners.length);
    const prevBanner = () => setCurrentBanner(prev => (prev - 1 + banners.length) % banners.length);

    return (
        <main className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero__slider">
                    {banners.map((banner, index) => (
                        <div
                            key={banner.id}
                            className={`hero__slide ${index === currentBanner ? 'active' : ''}`}
                            style={banner.type !== 'video' ? { backgroundImage: `url(${banner.image})` } : {}}
                        >
                            {banner.type === 'video' && (
                                <video
                                    className="hero__video"
                                    src={banner.video}
                                    poster={banner.image}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                />
                            )}
                            <div className="hero__overlay" />
                            <div className="hero__content container">
                                <span className="hero__subtitle animate-fade-in-up">{banner.subtitle}</span>
                                <h1 className="hero__title animate-fade-in-up">{banner.title}</h1>
                                <p className="hero__description animate-fade-in-up">{banner.description}</p>
                                <Link to={banner.link} className="btn btn-primary hero__cta animate-fade-in-up">
                                    {banner.cta}
                                    <ArrowRight size={20} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Slider Controls */}
                <button className="hero__nav hero__nav--prev" onClick={prevBanner}>
                    <ChevronLeft size={24} />
                </button>
                <button className="hero__nav hero__nav--next" onClick={nextBanner}>
                    <ChevronRight size={24} />
                </button>

                {/* Slider Dots */}
                <div className="hero__dots">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            className={`hero__dot ${index === currentBanner ? 'active' : ''}`}
                            onClick={() => setCurrentBanner(index)}
                        />
                    ))}
                </div>
            </section>

            {/* Categories Section */}
            <section className="section categories-section">
                <div className="container">
                    <div className="section__header">
                        <h2 className="section__title section__title--serif">Shop by Category</h2>
                    </div>

                    <div className="categories-grid">
                        {['churi', 'shari', 'makeup', 'jewellery'].map(id => categories.find(c => c.id === id)).filter(Boolean).map((category) => (
                            <Link
                                key={category.id}
                                to={`/products?category=${category.id}`}
                                className="category-card"
                            >
                                <div className="category-card__image">
                                    <img src={category.image} alt={category.name} />
                                </div>
                                <div className="category-card__content">
                                    <h3 className="category-card__name">{category.name}</h3>
                                    <span className="category-card__count">
                                        {category.subcategories.length} subcategories
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Flash Sale Section */}
            <section className="section flash-sale-section">
                <div className="container">
                    <div className="flash-sale">
                        <div className="flash-sale__header">
                            <div className="flash-sale__title-wrapper">
                                <div>
                                    <h2 className="flash-sale__title section__title--serif">Flash Sale</h2>
                                    <p className="flash-sale__subtitle">Hurry up! Deals end soon</p>
                                </div>
                            </div>
                            <div className="flash-sale__countdown">
                                <div className="countdown-item">
                                    <span className="countdown-value">{String(countdown.hours).padStart(2, '0')}</span>
                                    <span className="countdown-label">Hours</span>
                                </div>
                                <span className="countdown-separator">:</span>
                                <div className="countdown-item">
                                    <span className="countdown-value">{String(countdown.minutes).padStart(2, '0')}</span>
                                    <span className="countdown-label">Minutes</span>
                                </div>
                                <span className="countdown-separator">:</span>
                                <div className="countdown-item">
                                    <span className="countdown-value">{String(countdown.seconds).padStart(2, '0')}</span>
                                    <span className="countdown-label">Seconds</span>
                                </div>
                            </div>
                        </div>

                        <div className="products-grid products-grid--4">
                            {bestSellers.slice(0, 4).map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="section">
                <div className="container">
                    <div className="section__header">
                        <div className="section__title-wrapper">
                            <h2 className="section__title section__title--serif">Featured Products</h2>
                        </div>
                        <Link to="/products?tag=featured" className="section__link">
                            View All
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="products-grid products-grid--4">
                        {featuredProducts.slice(0, 8).map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Promo Banner */}
            <section className="promo-section">
                <div className="container">
                    <div className="promo-banner">
                        <div className="promo-banner__content">
                            <span className="promo-banner__tag">Limited Time Offer</span>
                            <h2 className="promo-banner__title">Get 20% Off Your First Order</h2>
                            <p className="promo-banner__description">
                                Sign up today and receive exclusive discounts on your favorite products.
                            </p>
                            <div className="promo-banner__cta">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="promo-banner__input"
                                />
                                <button className="btn btn-primary">Subscribe</button>
                            </div>
                        </div>
                        <div className="promo-banner__image">
                            <img
                                src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600"
                                alt="Shopping bags"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* New Arrivals */}
            {newArrivals.length > 0 && (
                <section className="section">
                    <div className="container">
                        <div className="section__header">
                            <div className="section__title-wrapper">
                                <h2 className="section__title section__title--serif">New Arrivals</h2>
                            </div>
                            <Link to="/products?tag=new" className="section__link">
                                View All
                                <ArrowRight size={16} />
                            </Link>
                        </div>

                        <div className="products-grid products-grid--4">
                            {newArrivals.slice(0, 4).map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Brands Section */}
            <section className="section brands-section">
                <div className="container">
                    <h2 className="section__title text-center">Trusted by Top Brands</h2>
                    <div className="brands-grid">
                        {['Apple', 'Nike', 'Samsung', 'Adidas', 'Sony', 'Puma'].map((brand) => (
                            <div key={brand} className="brand-item">
                                <span>{brand}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
