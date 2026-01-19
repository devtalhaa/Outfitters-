export interface Product {
    id: string
    slug: string
    name: string
    price: number
    originalPrice?: number
    description: string
    images: string[]
    colors: { name: string; value: string }[]
    sizes: { value: string; stock: number }[]
    category: string
    composition?: string
    care?: string
    articleCode: string
}

export const products: Product[] = [
    {
        id: "1",
        slug: "chunky-mesh-sneakers",
        name: "Chunky Mesh Sneakers",
        price: 8390,
        originalPrice: 11990,
        description: "Step into style with our Chunky Mesh Sneakers—the perfect blend of comfort and attitude. Featuring breathable mesh construction and a secure laces closure, these kicks keep your feet happy all day long.",
        images: [
            "/black-white-chunky-sneakers-side-view-on-gray-back.jpg",
            "/black-white-chunky-sneakers-back-view-on-gray-back.jpg",
            "/black-white-chunky-sneakers-top-angle-view-on-gray.jpg",
            "/black-white-chunky-sneakers-detail-view-on-gray-ba.jpg",
        ],
        colors: [
            { name: "Triple Black", value: "#000000" },
            { name: "Steel Gray", value: "#6B6B6B" },
        ],
        sizes: [
            { value: "40", stock: 5 },
            { value: "41", stock: 0 },
            { value: "42", stock: 12 },
            { value: "43", stock: 2 },
            { value: "44", stock: 8 },
            { value: "45", stock: 0 },
        ],
        category: "Footwear",
        articleCode: "FMS-SN-0124-BLK",
        composition: "60% Polyester, 40% PU. Sole: 100% TR.",
        care: "Wipe clean with a damp cloth."
    },
    {
        id: "2",
        slug: "classic-white-sneakers",
        name: "Classic White Sneakers",
        price: 4990,
        originalPrice: 6990,
        description: "Minimalist and clean, these white sneakers are a staple for any wardrobe. Made with premium synthetic leather.",
        images: ["/white-sneakers-minimal.jpg", "/white-sneakers-side-view.jpg"],
        colors: [{ name: "White", value: "#FFFFFF" }],
        sizes: [{ value: "40", stock: 10 }, { value: "41", stock: 5 }],
        category: "Footwear",
        articleCode: "FMS-SN-0224-WHT"
    },
    {
        id: "3",
        slug: "premium-leather-loafers",
        name: "Premium Leather Loafers",
        price: 7490,
        description: "Handcrafted leather loafers for a sophisticated look. Perfect for formal and semi-formal occasions.",
        images: ["/brown-leather-loafers.jpg", "/brown-leather-loafers-top-view.jpg"],
        colors: [{ name: "Brown", value: "#5C4033" }],
        sizes: [{ value: "40", stock: 3 }, { value: "41", stock: 0 }],
        category: "Footwear",
        articleCode: "FMS-SN-0324-BRN"
    },
    {
        id: "4",
        slug: "black-casual-sandals",
        name: "Black Casual Sandals",
        price: 3490,
        originalPrice: 4490,
        description: "Comfortable and light casual sandals for everyday wear.",
        images: ["/black-casual-sandals.jpg", "/black-casual-sandals-top.jpg"],
        colors: [{ name: "Black", value: "#000000" }],
        sizes: [{ value: "40", stock: 15 }, { value: "41", stock: 20 }],
        category: "Footwear",
        articleCode: "FMS-SN-0424-BLK"
    }
]
