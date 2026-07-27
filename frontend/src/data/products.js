// Mock product data for development
export const products = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        description: "Experience crystal-clear sound with our premium wireless headphones featuring active noise cancellation and 30-hour battery life.",
        price: 299.99,
        originalPrice: 399.99,
        discount: 25,
        rating: 4.8,
        reviews: 2547,
        images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600",
            "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=600"
        ],
        category: "Electronics",
        subcategory: "Audio",
        brand: "SoundMax",
        colors: ["Black", "White", "Navy"],
        inStock: true,
        stockCount: 45,
        tags: ["bestseller", "featured"],
        specs: {
            "Battery Life": "30 hours",
            "Connectivity": "Bluetooth 5.2",
            "Driver Size": "40mm",
            "Weight": "250g"
        }
    },
    {
        id: 2,
        name: "Ultra Slim Smartwatch",
        description: "Stay connected with our ultra-slim smartwatch featuring health monitoring, GPS tracking, and 7-day battery life.",
        price: 449.99,
        originalPrice: 549.99,
        discount: 18,
        rating: 4.6,
        reviews: 1823,
        images: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
            "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600"
        ],
        category: "Electronics",
        subcategory: "Wearables",
        brand: "TechPro",
        colors: ["Silver", "Gold", "Black"],
        inStock: true,
        stockCount: 28,
        tags: ["new", "featured"],
        specs: {
            "Display": "1.4\" AMOLED",
            "Battery": "7 days",
            "Water Resistance": "5ATM",
            "Sensors": "Heart Rate, SpO2, GPS"
        }
    },
    {
        id: 3,
        name: "Designer Leather Bag",
        description: "Handcrafted from premium Italian leather, this designer bag combines elegance with functionality.",
        price: 189.99,
        originalPrice: 249.99,
        discount: 24,
        rating: 4.9,
        reviews: 892,
        images: [
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600",
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"
        ],
        category: "Fashion",
        subcategory: "Bags",
        brand: "LuxeStyle",
        colors: ["Brown", "Black", "Tan"],
        inStock: true,
        stockCount: 15,
        tags: ["bestseller"],
        specs: {
            "Material": "Italian Leather",
            "Dimensions": "12\" x 9\" x 4\"",
            "Compartments": "3 main + 2 pockets",
            "Closure": "Magnetic snap"
        }
    },
    {
        id: 4,
        name: "Minimalist Desk Lamp",
        description: "Modern LED desk lamp with adjustable brightness, color temperature control, and wireless charging base.",
        price: 79.99,
        originalPrice: 99.99,
        discount: 20,
        rating: 4.7,
        reviews: 1456,
        images: [
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600",
            "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600"
        ],
        category: "Home",
        subcategory: "Lighting",
        brand: "LumiDesign",
        colors: ["White", "Black", "Wood"],
        inStock: true,
        stockCount: 67,
        tags: ["featured"],
        specs: {
            "Light Source": "LED",
            "Color Temperature": "2700K-6500K",
            "Brightness Levels": "5",
            "Wireless Charging": "15W Qi"
        }
    },
    {
        id: 5,
        name: "Running Performance Shoes",
        description: "Engineered for speed and comfort, these running shoes feature responsive cushioning and breathable mesh.",
        price: 159.99,
        originalPrice: 199.99,
        discount: 20,
        rating: 4.8,
        reviews: 3241,
        images: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600"
        ],
        category: "Sports",
        subcategory: "Footwear",
        brand: "SpeedRun",
        colors: ["Red/Black", "Blue/White", "All Black"],
        sizes: ["7", "8", "9", "10", "11", "12"],
        inStock: true,
        stockCount: 89,
        tags: ["bestseller", "featured"],
        specs: {
            "Upper": "Breathable Mesh",
            "Sole": "Carbon Fiber Plate",
            "Drop": "8mm",
            "Weight": "215g"
        }
    },
    {
        id: 6,
        name: "Organic Skincare Set",
        description: "Complete skincare routine with organic, cruelty-free products including cleanser, toner, serum, and moisturizer.",
        price: 89.99,
        originalPrice: 129.99,
        discount: 31,
        rating: 4.9,
        reviews: 2156,
        images: [
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600",
            "https://images.unsplash.com/photo-1570194065650-d99fb4b8ccb0?w=600"
        ],
        category: "Beauty",
        subcategory: "Skincare",
        brand: "PureGlow",
        inStock: true,
        stockCount: 123,
        tags: ["bestseller", "organic"],
        specs: {
            "Products Included": "4",
            "Skin Type": "All skin types",
            "Certification": "Organic, Vegan",
            "Size": "Full-size bottles"
        }
    },
    {
        id: 7,
        name: "Mechanical Gaming Keyboard",
        description: "RGB mechanical keyboard with hot-swappable switches, aluminum frame, and customizable macros.",
        price: 149.99,
        originalPrice: 179.99,
        discount: 17,
        rating: 4.7,
        reviews: 1876,
        images: [
            "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600",
            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600"
        ],
        category: "Electronics",
        subcategory: "Accessories",
        brand: "GameMaster",
        colors: ["Black", "White"],
        inStock: true,
        stockCount: 54,
        tags: ["gaming", "featured"],
        specs: {
            "Switch Type": "Cherry MX (Hot-swap)",
            "Layout": "Full-size 104 keys",
            "Backlighting": "RGB per-key",
            "Connectivity": "USB-C / Wireless"
        }
    },
    {
        id: 8,
        name: "Premium Coffee Maker",
        description: "Barista-quality espresso at home with integrated grinder, milk frother, and touchscreen controls.",
        price: 599.99,
        originalPrice: 749.99,
        discount: 20,
        rating: 4.8,
        reviews: 967,
        images: [
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600",
            "https://images.unsplash.com/photo-1517353943141-e4e156a17b20?w=600"
        ],
        category: "Home",
        subcategory: "Kitchen",
        brand: "BrewPro",
        colors: ["Stainless Steel", "Black"],
        inStock: true,
        stockCount: 23,
        tags: ["premium", "featured"],
        specs: {
            "Pressure": "15 bar",
            "Grinder": "Built-in burr",
            "Water Tank": "2L",
            "Milk Frother": "Automatic steam wand"
        }
    },
    {
        id: 9,
        name: "Yoga & Fitness Mat",
        description: "Extra thick eco-friendly mat with alignment guides, non-slip surface, and carrying strap included.",
        price: 49.99,
        originalPrice: 69.99,
        discount: 29,
        rating: 4.6,
        reviews: 4521,
        images: [
            "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600",
            "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600"
        ],
        category: "Sports",
        subcategory: "Fitness",
        brand: "ZenFit",
        colors: ["Purple", "Blue", "Green", "Black"],
        inStock: true,
        stockCount: 234,
        tags: ["bestseller"],
        specs: {
            "Thickness": "6mm",
            "Material": "TPE Eco-foam",
            "Size": "72\" x 24\"",
            "Extras": "Alignment lines, Carrying strap"
        }
    },
    {
        id: 10,
        name: "Wireless Earbuds Pro",
        description: "True wireless earbuds with spatial audio, adaptive noise cancellation, and IPX5 water resistance.",
        price: 199.99,
        originalPrice: 249.99,
        discount: 20,
        rating: 4.7,
        reviews: 3892,
        images: [
            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600",
            "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600"
        ],
        category: "Electronics",
        subcategory: "Audio",
        brand: "SoundMax",
        colors: ["White", "Black", "Navy"],
        inStock: true,
        stockCount: 156,
        tags: ["new", "bestseller"],
        specs: {
            "Battery (Buds)": "8 hours",
            "Battery (Case)": "32 hours total",
            "Drivers": "11mm dynamic",
            "Features": "Spatial Audio, ANC, Transparency"
        }
    },
    {
        id: 11,
        name: "Vintage Polaroid Camera",
        description: "Instant film camera with a vintage aesthetic, built-in flash, and automatic exposure for perfect shots.",
        price: 129.99,
        originalPrice: 159.99,
        discount: 19,
        rating: 4.5,
        reviews: 1234,
        images: [
            "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600",
            "https://images.unsplash.com/photo-1495121553079-4c61bcce1894?w=600"
        ],
        category: "Electronics",
        subcategory: "Cameras",
        brand: "RetroSnap",
        colors: ["White", "Black", "Mint"],
        inStock: true,
        stockCount: 42,
        tags: ["vintage", "gift"],
        specs: {
            "Film Type": "Instant 600",
            "Flash": "Built-in automatic",
            "Lens": "Fixed focus",
            "Battery": "Rechargeable lithium"
        }
    },
    {
        id: 12,
        name: "Luxury Scented Candle Set",
        description: "Hand-poured soy candles in premium fragrances. Set of 3 with 50-hour burn time each.",
        price: 59.99,
        originalPrice: 79.99,
        discount: 25,
        rating: 4.8,
        reviews: 2341,
        images: [
            "https://images.unsplash.com/photo-1602607434949-58e33bcb2a3d?w=600",
            "https://images.unsplash.com/photo-1603006905393-c219e60b5f59?w=600"
        ],
        category: "Home",
        subcategory: "Decor",
        brand: "AromaLux",
        inStock: true,
        stockCount: 89,
        tags: ["gift", "bestseller"],
        specs: {
            "Material": "100% Soy Wax",
            "Burn Time": "50 hours each",
            "Fragrances": "Vanilla, Lavender, Sandalwood",
            "Size": "8oz each"
        }
    },
    {
        id: 13,
        name: "Handcrafted Silk Scarf",
        description: "Luxurious pure silk scarf with intricate hand-printed patterns. Perfect for any occasion.",
        price: 89.99,
        originalPrice: 119.99,
        discount: 25,
        rating: 4.9,
        reviews: 1456,
        images: [
            "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600",
            "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600"
        ],
        category: "Fashion",
        subcategory: "Accessories",
        brand: "SilkCraft",
        colors: ["Burgundy", "Navy", "Emerald"],
        inStock: true,
        stockCount: 34,
        tags: ["new", "featured"],
        specs: {
            "Material": "100% Pure Silk",
            "Dimensions": "90cm x 90cm",
            "Care": "Dry clean only",
            "Origin": "Handcrafted"
        }
    },
    {
        id: 14,
        name: "Ceramic Vase Set",
        description: "Modern minimalist ceramic vase set. Set of 3 in complementary sizes and shapes.",
        price: 69.99,
        originalPrice: 89.99,
        discount: 22,
        rating: 4.7,
        reviews: 987,
        images: [
            "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=600",
            "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600"
        ],
        category: "Home",
        subcategory: "Decor",
        brand: "ArtHome",
        colors: ["White", "Sage", "Terracotta"],
        inStock: true,
        stockCount: 56,
        tags: ["featured", "bestseller"],
        specs: {
            "Material": "Premium Ceramic",
            "Sizes": "Small, Medium, Large",
            "Style": "Minimalist Modern",
            "Finish": "Matte glazed"
        }
    }
];

export const categories = [
    {
        id: 1,
        name: "Electronics",
        icon: "💻",
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600",
        subcategories: ["Audio", "Wearables", "Accessories", "Cameras"]
    },
    {
        id: 2,
        name: "Fashion",
        icon: "👗",
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600",
        subcategories: ["Bags", "Clothing", "Shoes", "Accessories"]
    },
    {
        id: 3,
        name: "Home",
        icon: "🏠",
        image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600",
        subcategories: ["Lighting", "Kitchen", "Decor", "Furniture"]
    },
    {
        id: 4,
        name: "Sports",
        icon: "⚽",
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600",
        subcategories: ["Footwear", "Fitness", "Outdoor", "Equipment"]
    },
    {
        id: 5,
        name: "Beauty",
        icon: "✨",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600",
        subcategories: ["Skincare", "Makeup", "Haircare", "Fragrance"]
    }
];

export const banners = [
    {
        id: 1,
        title: "Summer Collection",
        subtitle: "Up to 50% Off",
        description: "Discover the hottest trends of the season",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200",
        cta: "Shop Now",
        link: "/products?category=fashion"
    },
    {
        id: 2,
        title: "Elegant Shari Collection",
        subtitle: "New Arrivals",
        description: "Authentic handwoven sarees for every occasion",
        type: "video",
        video: "https://videos.pexels.com/video-files/5765105/5765105-hd_1920_1080_25fps.mp4",
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200",
        cta: "Explore Shari",
        link: "/products?category=shari"
    },
    {
        id: 3,
        title: "Tech Essentials",
        subtitle: "New Arrivals",
        description: "Latest gadgets for the modern lifestyle",
        image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200",
        cta: "Explore",
        link: "/products?category=electronics"
    },
    {
        id: 4,
        title: "Home & Living",
        subtitle: "Create Your Space",
        description: "Premium home decor and essentials",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200",
        cta: "Browse",
        link: "/products?category=home"
    }
];
