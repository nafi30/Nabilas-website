import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    SlidersHorizontal, Grid3X3, List, ChevronDown, X,
    Search, Star
} from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';
import { CATEGORIES, getSubcategories } from '../../data/categories';
import { useProducts } from '../../context/ProductContext';
import './Products.css';

export default function Products() {
    const { products, loading } = useProducts();
    const [searchParams, setSearchParams] = useSearchParams();
    const [viewMode, setViewMode] = useState('grid');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        subcategory: searchParams.get('sub') || '',
        priceRange: [0, 10000],
        rating: 0,
        inStock: false,
        search: searchParams.get('search') || '',
        tag: searchParams.get('tag') || ''
    });
    const [sortBy, setSortBy] = useState('featured');

    // Update filters when URL changes
    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            category: searchParams.get('category') || '',
            subcategory: searchParams.get('sub') || '',
            search: searchParams.get('search') || '',
            tag: searchParams.get('tag') || ''
        }));
    }, [searchParams]);

    // Get subcategories for selected category
    const currentSubcategories = filters.category ? getSubcategories(filters.category) : [];

    // Get active category info
    const activeCat = CATEGORIES.find(c => c.id === filters.category);
    const activeSub = currentSubcategories.find(s => s.id === filters.subcategory);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchLower) ||
                p.description.toLowerCase().includes(searchLower) ||
                p.category.toLowerCase().includes(searchLower)
            );
        }

        // Category filter — match by category ID or category name
        if (filters.category) {
            const catObj = CATEGORIES.find(c => c.id === filters.category);
            if (catObj) {
                result = result.filter(p =>
                    p.category.toLowerCase() === catObj.name.toLowerCase() ||
                    p.category.toLowerCase() === catObj.id.toLowerCase()
                );
            }
        }

        // Subcategory filter
        if (filters.subcategory) {
            const subObj = currentSubcategories.find(s => s.id === filters.subcategory);
            if (subObj) {
                result = result.filter(p =>
                    p.subcategory?.toLowerCase() === subObj.name.toLowerCase() ||
                    p.subcategory?.toLowerCase() === subObj.id.toLowerCase()
                );
            }
        }

        // Tag filter
        if (filters.tag) {
            result = result.filter(p => p.tags?.includes(filters.tag));
        }

        // Price filter
        result = result.filter(p =>
            p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
        );

        // Rating filter
        if (filters.rating > 0) {
            result = result.filter(p => p.rating >= filters.rating);
        }

        // In stock filter
        if (filters.inStock) {
            result = result.filter(p => p.inStock);
        }

        // Sort
        switch (sortBy) {
            case 'price-low': result.sort((a, b) => a.price - b.price); break;
            case 'price-high': result.sort((a, b) => b.price - a.price); break;
            case 'rating': result.sort((a, b) => b.rating - a.rating); break;
            case 'newest': result.sort((a, b) => b.id - a.id); break;
            default: break;
        }

        return result;
    }, [filters, sortBy, currentSubcategories]);

    const handleCategoryChange = (catId) => {
        const newCat = filters.category === catId ? '' : catId;
        const newParams = new URLSearchParams(searchParams);
        if (newCat) {
            newParams.set('category', newCat);
        } else {
            newParams.delete('category');
        }
        newParams.delete('sub');
        setSearchParams(newParams);
    };

    const handleSubcategoryChange = (subId) => {
        const newSub = filters.subcategory === subId ? '' : subId;
        const newParams = new URLSearchParams(searchParams);
        if (newSub) {
            newParams.set('sub', newSub);
        } else {
            newParams.delete('sub');
        }
        setSearchParams(newParams);
    };

    const handleClearFilters = () => {
        setFilters({
            category: '', subcategory: '',
            priceRange: [0, 10000], rating: 0,
            inStock: false, search: '', tag: ''
        });
        setSearchParams({});
    };

    const activeFiltersCount = [
        filters.category, filters.subcategory, filters.rating > 0,
        filters.inStock, filters.search, filters.tag
    ].filter(Boolean).length;

    // Build page title
    const pageTitle = activeSub
        ? activeSub.name
        : activeCat
            ? activeCat.name
            : filters.search
                ? `Search: "${filters.search}"`
                : filters.tag
                    ? filters.tag.charAt(0).toUpperCase() + filters.tag.slice(1)
                    : 'All Products';

    return (
        <main className="products-page">
            <div className="container">
                {/* Page Header */}
                <div className="products-page__header">
                    <div>
                        <h1 className="products-page__title">{pageTitle}</h1>
                        <p className="products-page__count">{filteredProducts.length} products found</p>
                    </div>
                    <div className="products-page__controls">
                        <button className="products-page__filter-toggle" onClick={() => setIsMobileFilterOpen(true)}>
                            <SlidersHorizontal size={20} />
                            Filters
                            {activeFiltersCount > 0 && <span className="products-page__filter-badge">{activeFiltersCount}</span>}
                        </button>
                        <div className="products-page__sort">
                            <label>Sort by:</label>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="products-page__sort-select">
                                <option value="featured">Featured</option>
                                <option value="newest">Newest</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                            </select>
                            <ChevronDown size={16} className="products-page__sort-icon" />
                        </div>
                        <div className="products-page__view-toggle">
                            <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')} aria-label="Grid view">
                                <Grid3X3 size={20} />
                            </button>
                            <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')} aria-label="List view">
                                <List size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
                        Loading products...
                    </div>
                ) : (
                    <div className="products-page__content">
                        {/* Sidebar Filters */}
                    <aside className={`products-page__sidebar ${isMobileFilterOpen ? 'open' : ''}`}>
                        <div className="products-page__sidebar-header">
                            <h2>Filters</h2>
                            <button className="products-page__sidebar-close" onClick={() => setIsMobileFilterOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        {activeFiltersCount > 0 && (
                            <button className="products-page__clear-filters" onClick={handleClearFilters}>
                                Clear all filters
                            </button>
                        )}

                        {/* Search */}
                        <div className="filter-section">
                            <h3 className="filter-section__title">Search</h3>
                            <div className="filter-search">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={filters.search}
                                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                    className="filter-search__input"
                                />
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="filter-section">
                            <h3 className="filter-section__title">Categories</h3>
                            <div className="filter-options">
                                {CATEGORIES.map((cat) => (
                                    <label key={cat.id} className="filter-option">
                                        <input
                                            type="checkbox"
                                            checked={filters.category === cat.id}
                                            onChange={() => handleCategoryChange(cat.id)}
                                        />
                                        <span className="filter-option__checkbox" />
                                        <span className="filter-option__icon">{cat.icon}</span>
                                        <span className="filter-option__label">{cat.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Subcategories — only show when a category is selected */}
                        {filters.category && currentSubcategories.length > 0 && (
                            <div className="filter-section">
                                <h3 className="filter-section__title">
                                    {activeCat?.icon} {activeCat?.name} Types
                                </h3>
                                <div className="filter-options">
                                    {currentSubcategories.map((sub) => (
                                        <label key={sub.id} className="filter-option">
                                            <input
                                                type="checkbox"
                                                checked={filters.subcategory === sub.id}
                                                onChange={() => handleSubcategoryChange(sub.id)}
                                            />
                                            <span className="filter-option__checkbox" />
                                            <span className="filter-option__label">{sub.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Price Range */}
                        <div className="filter-section">
                            <h3 className="filter-section__title">Price Range</h3>
                            <div className="filter-price">
                                <div className="filter-price__inputs">
                                    <input type="number" placeholder="Min" value={filters.priceRange[0]}
                                        onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [Number(e.target.value), prev.priceRange[1]] }))} />
                                    <span>—</span>
                                    <input type="number" placeholder="Max" value={filters.priceRange[1]}
                                        onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], Number(e.target.value)] }))} />
                                </div>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="filter-section">
                            <h3 className="filter-section__title">Rating</h3>
                            <div className="filter-options">
                                {[4, 3, 2, 1].map((rating) => (
                                    <label key={rating} className="filter-option filter-option--rating">
                                        <input type="radio" name="rating" checked={filters.rating === rating}
                                            onChange={() => setFilters(prev => ({ ...prev, rating }))} />
                                        <span className="filter-option__radio" />
                                        <span className="filter-rating">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < rating ? 'currentColor' : 'none'} className={i < rating ? 'filled' : ''} />
                                            ))}
                                        </span>
                                        <span className="filter-option__label">& Up</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="filter-section">
                            <h3 className="filter-section__title">Availability</h3>
                            <label className="filter-option">
                                <input type="checkbox" checked={filters.inStock}
                                    onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))} />
                                <span className="filter-option__checkbox" />
                                <span className="filter-option__label">In Stock Only</span>
                            </label>
                        </div>

                        <button className="btn btn-primary products-page__apply-filters" onClick={() => setIsMobileFilterOpen(false)}>
                            Apply Filters ({filteredProducts.length} results)
                        </button>
                    </aside>

                    {isMobileFilterOpen && (
                        <div className="products-page__overlay" onClick={() => setIsMobileFilterOpen(false)} />
                    )}

                    {/* Products Grid */}
                    <div className="products-page__products">
                        {filteredProducts.length > 0 ? (
                            <div className={`products-grid ${viewMode === 'list' ? 'products-grid--list' : 'products-grid--3'}`}>
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} viewMode={viewMode} />
                                ))}
                            </div>
                        ) : (
                            <div className="products-page__empty">
                                <div className="products-page__empty-icon">🔍</div>
                                <h2>No products found</h2>
                                <p>Try adjusting your filters or search terms</p>
                                <button className="btn btn-primary" onClick={handleClearFilters}>
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                )}
            </div>
        </main>
    );
}
