import { useState, useEffect, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, X, Package, Upload, AlertTriangle, ArrowUpDown } from 'lucide-react';
import { databases, storage, ID, Query } from '../../lib/appwrite';
import { CATEGORIES, getSubcategories } from '../../data/categories';

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PRODUCTS_ID = import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const EMPTY_FORM = { name: '', description: '', price: '', category: '', subcategory: '', image: '', stock: '', tag: '' };

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [images, setImages] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [sortField, setSortField] = useState('$createdAt');
    const [sortDir, setSortDir] = useState('desc');
    const fileInputRef = useRef(null);

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        try {
            const res = await databases.listDocuments(DB_ID, PRODUCTS_ID, [Query.limit(100), Query.orderDesc('$createdAt')]);
            setProducts(res.documents);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    // ---- Sorting ----
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDir('asc');
        }
    };

    const sorted = [...products]
        .filter(p =>
            p.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.category?.toLowerCase().includes(search.toLowerCase()) ||
            p.tag?.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            let va = a[sortField], vb = b[sortField];
            if (typeof va === 'string') va = va.toLowerCase();
            if (typeof vb === 'string') vb = vb.toLowerCase();
            if (va < vb) return sortDir === 'asc' ? -1 : 1;
            if (va > vb) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });

    // ---- Modal ----
    const openAddModal = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setImages([]);
        setShowModal(true);
    };

    const openEditModal = (product) => {
        setEditingId(product.$id);
        setForm({
            name: product.name || '',
            description: product.description || '',
            price: product.price?.toString() || '',
            category: product.category || '',
            subcategory: product.subcategory || '',
            image: product.image || '',
            stock: product.stock?.toString() || '',
            tag: product.tag || '',
        });
        setImages(product.image ? product.image.split(',').map(url => ({ file: null, url })) : []);
        setShowModal(true);
    };

    // ---- Drag & Drop Image ----
    const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
    const handleDragLeave = () => setDragging(false);
    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        if (files.length > 0) {
            setImages(prev => [...prev, ...files.map(f => ({ file: f, url: URL.createObjectURL(f) }))]);
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
        if (files.length > 0) {
            setImages(prev => [...prev, ...files.map(f => ({ file: f, url: URL.createObjectURL(f) }))]);
        }
    };

    const removeImage = (e, index) => {
        e.stopPropagation();
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleImageUpload = async () => {
        try {
            const finalUrls = [];
            for (const img of images) {
                if (img.file) {
                    const uploaded = await storage.createFile(BUCKET_ID, ID.unique(), img.file);
                    finalUrls.push(`${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${uploaded.$id}/view?project=${PROJECT_ID}`);
                } else {
                    finalUrls.push(img.url);
                }
            }
            return finalUrls.join(',');
        } catch (err) {
            console.error('Image upload error:', err);
            return form.image;
        }
    };

    const handleSave = async () => {
        if (!form.name || !form.price || !form.category) {
            alert('Please fill in Name, Price, and Category');
            return;
        }
        setSaving(true);
        try {
            const imageUrl = await handleImageUpload();
            const data = {
                name: form.name,
                description: form.description,
                price: parseFloat(form.price) || 0,
                category: form.category,
                subcategory: form.subcategory,
                image: imageUrl,
                stock: parseInt(form.stock) || 0,
                tag: form.tag,
            };

            if (editingId) {
                await databases.updateDocument(DB_ID, PRODUCTS_ID, editingId, data);
            } else {
                await databases.createDocument(DB_ID, PRODUCTS_ID, ID.unique(), data);
            }

            setShowModal(false);
            fetchProducts();
        } catch (err) {
            console.error('Save error:', err);
            alert('Error: ' + err.message);
        } finally { setSaving(false); }
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        try {
            await databases.deleteDocument(DB_ID, PRODUCTS_ID, id);
            fetchProducts();
        } catch (err) {
            console.error(err);
            alert('Error deleting: ' + err.message);
        }
    };

    const lowStockCount = products.filter(p => parseInt(p.stock) !== -1 && (p.stock || 0) < 10).length;

    const SortHeader = ({ field, children }) => (
        <th onClick={() => handleSort(field)} style={{ cursor: 'pointer', userSelect: 'none' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                {children}
                <ArrowUpDown size={12} style={{ opacity: sortField === field ? 1 : 0.3 }} />
            </span>
        </th>
    );

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>Products</h1>
                <p style={{ color: '#666', fontSize: '0.85rem' }}>
                    Manage your product catalog
                    {lowStockCount > 0 && (
                        <span style={{ marginLeft: '1rem', color: '#ef4444', fontWeight: 600 }}>
                            <AlertTriangle size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                            {lowStockCount} low stock
                        </span>
                    )}
                </p>
            </div>

            <div className="admin-section__header">
                <div className="admin-search">
                    <Search size={16} />
                    <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <button className="admin-btn admin-btn--primary" onClick={openAddModal}>
                    <Plus size={16} /> Add Product
                </button>
            </div>

            {loading ? (
                <div className="admin-empty"><p>Loading products...</p></div>
            ) : sorted.length === 0 ? (
                <div className="admin-empty">
                    <Package size={48} />
                    <p>No products found.</p>
                </div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <SortHeader field="name">Name</SortHeader>
                                <SortHeader field="category">Category</SortHeader>
                                <SortHeader field="price">Price</SortHeader>
                                <SortHeader field="stock">Stock</SortHeader>
                                <th>Tag</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.map(product => {
                                const isUnlimited = parseInt(product.stock) === -1;
                                const isLowStock = !isUnlimited && (product.stock || 0) < 10;
                                return (
                                    <tr key={product.$id} style={isLowStock ? { background: 'rgba(239,68,68,0.04)' } : {}}>
                                        <td>
                                            <img src={product.image?.split(',')[0]} alt="" className="admin-product-img" />
                                        </td>
                                        <td style={{ fontWeight: 600, color: '#fff' }}>{product.name}</td>
                                        <td>{product.category}</td>
                                        <td style={{ color: '#22c55e', fontWeight: 600 }}>{product.price?.toFixed(2)}<span style={{ fontSize: '1.2em', marginLeft: '4px', fontWeight: '500' }}>৳</span></td>
                                        <td>
                                            <span style={{
                                                color: isUnlimited ? '#22c55e' : (isLowStock ? '#ef4444' : '#ccc'),
                                                fontWeight: (isLowStock || isUnlimited) ? 700 : 400,
                                            }}>
                                                {isLowStock && <AlertTriangle size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />}
                                                {isUnlimited ? 'Unlimited' : (product.stock || 0)}
                                            </span>
                                        </td>
                                        <td>
                                            {product.tag && (
                                                <span className="status-badge status-badge--shipped">{product.tag}</span>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => openEditModal(product)}>
                                                    <Edit2 size={14} />
                                                </button>
                                                <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => handleDelete(product.$id, product.name)}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add/Edit Modal with Drag & Drop */}
            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal__header">
                            <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                            <button className="admin-modal__close" onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="admin-modal__body">
                            <div className="admin-field">
                                <label>Product Name *</label>
                                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Premium Silk Dress" />
                            </div>
                            <div className="admin-field">
                                <label>Description</label>
                                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Product description..." />
                            </div>
                            <div className="admin-field-row">
                                <div className="admin-field">
                                    <label>Price (৳) *</label>
                                    <input type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="2900" />
                                </div>
                                <div className="admin-field">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <label style={{ marginBottom: 0 }}>Stock</label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#ccc', cursor: 'pointer', textTransform: 'none', letterSpacing: 'normal', fontWeight: 500 }}>
                                            <input 
                                                type="checkbox" 
                                                checked={parseInt(form.stock) === -1}
                                                onChange={e => setForm({...form, stock: e.target.checked ? -1 : ''})}
                                                style={{ width: 'auto', padding: 0, margin: 0 }}
                                            />
                                            Unlimited
                                        </label>
                                    </div>
                                    <input 
                                        type="number" 
                                        value={parseInt(form.stock) === -1 ? '' : form.stock} 
                                        onChange={e => setForm({...form, stock: e.target.value})} 
                                        placeholder={parseInt(form.stock) === -1 ? 'Unlimited' : '50'} 
                                        disabled={parseInt(form.stock) === -1}
                                        style={{ opacity: parseInt(form.stock) === -1 ? 0.5 : 1 }}
                                    />
                                </div>
                            </div>
                            <div className="admin-field-row">
                                <div className="admin-field">
                                    <label>Category *</label>
                                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value, subcategory: ''})}>
                                        <option value="">Select...</option>
                                        {CATEGORIES.map(cat => (
                                            <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="admin-field">
                                    <label>Subcategory</label>
                                    <select value={form.subcategory} onChange={e => setForm({...form, subcategory: e.target.value})}>
                                        <option value="">Select subcategory...</option>
                                        {(CATEGORIES.find(c => c.name === form.category)?.subcategories || []).map(sub => (
                                            <option key={sub.id} value={sub.name}>{sub.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="admin-field-row">
                                <div className="admin-field">
                                    <label>Tag</label>
                                    <select value={form.tag} onChange={e => setForm({...form, tag: e.target.value})}>
                                        <option value="">None</option>
                                        <option value="bestseller">Bestseller</option>
                                        <option value="new">New Arrival</option>
                                        <option value="featured">Featured</option>
                                        <option value="sale">On Sale</option>
                                    </select>
                                </div>
                            </div>

                            {/* Drag & Drop Image Upload */}
                            <div className="admin-field">
                                <label>Product Image</label>
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        border: `2px dashed ${dragging ? '#ec4899' : 'rgba(255,255,255,0.12)'}`,
                                        borderRadius: 12,
                                        padding: '2rem',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        background: dragging ? 'rgba(236,72,153,0.05)' : 'rgba(255,255,255,0.02)',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {images.length > 0 ? (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                                            {images.map((img, idx) => (
                                                <div key={idx} style={{ position: 'relative' }}>
                                                    <img src={img.url} alt="Preview" style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover' }} />
                                                    <button 
                                                        onClick={(e) => removeImage(e, idx)} 
                                                        style={{ position: 'absolute', top: -8, right: -8, background: '#ef4444', border: 'none', color: '#fff', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 80, height: 80, border: '1px dashed #666', borderRadius: 8 }}>
                                                <Plus size={24} style={{ color: '#666' }} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                            <Upload size={32} style={{ color: '#666' }} />
                                            <span style={{ fontSize: '0.85rem', color: '#888' }}>
                                                Drag & drop images here, or <span style={{ color: '#ec4899' }}>click to browse</span>
                                            </span>
                                            <span style={{ fontSize: '0.7rem', color: '#555' }}>PNG, JPG, WebP up to 5MB</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>
                        <div className="admin-modal__footer">
                            <button className="admin-btn admin-btn--ghost" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
                                {saving ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
