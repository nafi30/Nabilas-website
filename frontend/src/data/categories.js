// Real product categories for Namira Nabila Creations

export const CATEGORIES = [
    {
        id: 'churi',
        name: 'Churi (Bangles)',
        nameBn: 'চুড়ি',
        icon: '💎',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600',
        description: 'Traditional and modern bangles in every style',
        gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
        subcategories: [
            { id: 'kashmiri', name: 'Kashmiri' },
            { id: 'raindrops', name: 'Raindrops' },
            { id: 'moon-drops', name: 'Moon Drops' },
            { id: 'reshmi', name: 'Reshmi' },
            { id: 'khajkata', name: 'Khajkata' },
            { id: 'jori', name: 'Jori' },
            { id: 'velvet', name: 'Velvet' },
            { id: 'kundon', name: 'Kundon' },
            { id: 'gajra', name: 'Gajra' },
            { id: 'stone', name: 'Stone' },
            { id: 'churi-alna', name: 'Churi Alna' },
            { id: 'churi-dala', name: 'Churi Dala' },
        ],
    },
    {
        id: 'makeup',
        name: 'Make-up Products',
        nameBn: 'মেকআপ',
        icon: '💄',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600',
        description: 'Premium cosmetics and beauty essentials',
        gradient: 'linear-gradient(135deg, #ef4444, #f87171)',
        subcategories: [
            { id: 'lip-oil', name: 'Lip Oil' },
            { id: 'lip-liner', name: 'Lip Liner' },
            { id: 'lipstick', name: 'Lipstick' },
            { id: 'eye-shadow', name: 'Eye Shadow Palate' },
            { id: 'foundation', name: 'Foundation' },
            { id: 'eye-liner', name: 'Eye Liner' },
            { id: 'maskara', name: 'Maskara' },
            { id: 'face-powder', name: 'Face Powder' },
            { id: 'compact-powder', name: 'Compact Powder' },
            { id: 'blush-highlighter', name: 'Blush & Highlighter' },
            { id: 'kajol', name: 'Kajol' },
        ],
    },
    {
        id: 'jewellery',
        name: 'Jewellery',
        nameBn: 'গহনা',
        icon: '✨',
        image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=600',
        description: 'Elegant accessories for every occasion',
        gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
        subcategories: [
            { id: 'kaner-dul', name: 'Kaner Dul (Earrings)' },
            { id: 'golar-set', name: 'Golar Set (Necklace Set)' },
            { id: 'ring', name: 'Ring' },
            { id: 'bracelet', name: 'Bracelet' },
            { id: 'payer-nupur', name: 'Payer Nupur (Anklet)' },
        ],
    },
    {
        id: 'shari',
        name: 'Shari (Sarees)',
        nameBn: 'শাড়ি',
        icon: '👗',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600',
        description: 'Authentic handwoven sarees from Tangail',
        gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
        subcategories: [
            { id: 'pure-suti', name: 'Pure Suti Shari (Original Tangail er Aarong Cotton)' },
            { id: 'sharee-combo', name: 'Sharee Combo' },
        ],
    },
];

// Flat list of all subcategories with their parent
export const ALL_SUBCATEGORIES = CATEGORIES.flatMap(cat =>
    cat.subcategories.map(sub => ({ ...sub, categoryId: cat.id, categoryName: cat.name }))
);

// Helper: get subcategories for a category ID
export const getSubcategories = (categoryId) =>
    CATEGORIES.find(c => c.id === categoryId)?.subcategories || [];

// Old categories export kept for backward compatibility during transition
export const categories = CATEGORIES.map(c => ({
    id: c.id,
    name: c.name,
    icon: c.icon,
    image: c.image,
    subcategories: c.subcategories
}));
