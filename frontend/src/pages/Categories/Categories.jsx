import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import './Categories.css';

export default function Categories() {
    const [expandedCat, setExpandedCat] = useState(null);

    const toggleCategory = (catId) => {
        setExpandedCat(expandedCat === catId ? null : catId);
    };

    return (
        <main className="categories-page">
            <div className="container">
                <div className="categories-page__header">
                    <h1 className="categories-page__title">Shop by Category</h1>
                    <p className="categories-page__subtitle">
                        Browse our collection of authentic Bengali fashion, jewellery, and beauty essentials
                    </p>
                </div>

                {/* Category Cards */}
                <div className="catpage-grid">
                    {CATEGORIES.map((cat) => (
                        <div
                            key={cat.id}
                            className={`catpage-card ${expandedCat === cat.id ? 'expanded' : ''}`}
                        >
                            {/* Card Header */}
                            <div
                                className="catpage-card__header"
                                style={{ background: cat.gradient }}
                                onClick={() => toggleCategory(cat.id)}
                            >
                                <div className="catpage-card__icon">{cat.icon}</div>
                                <div className="catpage-card__info">
                                    <h2 className="catpage-card__name">{cat.name}</h2>
                                    <span className="catpage-card__name-bn">{cat.nameBn}</span>
                                    <p className="catpage-card__desc">{cat.description}</p>
                                </div>
                                <div className="catpage-card__meta">
                                    <span className="catpage-card__count">{cat.subcategories.length} types</span>
                                    <ChevronRight size={20} className="catpage-card__arrow" />
                                </div>
                            </div>

                            {/* Subcategory Tiles */}
                            <div className="catpage-card__subs">
                                <Link
                                    to={`/products?category=${cat.id}`}
                                    className="sub-tile sub-tile--all"
                                    style={{ borderColor: cat.gradient.includes('#ec4899') ? '#ec4899' : cat.gradient.includes('#8b5cf6') ? '#8b5cf6' : cat.gradient.includes('#f59e0b') ? '#f59e0b' : '#ef4444' }}
                                >
                                    <span className="sub-tile__icon">🛒</span>
                                    <span className="sub-tile__name">View All {cat.name}</span>
                                </Link>
                                {cat.subcategories.map(sub => (
                                    <Link
                                        key={sub.id}
                                        to={`/products?category=${cat.id}&sub=${sub.id}`}
                                        className="sub-tile"
                                    >
                                        <span className="sub-tile__name">{sub.name}</span>
                                        <ChevronRight size={14} className="sub-tile__arrow" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
