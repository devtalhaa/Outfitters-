"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, ShoppingBag, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

const products = [
  {
    id: 1,
    name: "Classic White Sneakers",
    price: 4990,
    originalPrice: 6990,
    image: "/white-sneakers-minimal.jpg",
    hoverImage: "/white-sneakers-side-view.jpg",
    badge: "SALE",
    isNew: false,
    sizes: ["40", "41", "42", "43", "44"],
  },
  {
    id: 2,
    name: "Premium Leather Loafers",
    price: 7490,
    image: "/brown-leather-loafers.jpg",
    hoverImage: "/brown-leather-loafers-top-view.jpg",
    badge: "NEW",
    isNew: true,
    sizes: ["39", "40", "41", "42", "43"],
  },
  {
    id: 3,
    name: "Sport Running Shoes",
    price: 5990,
    originalPrice: 7490,
    image: "/black-running-shoes.jpg",
    hoverImage: "/black-running-shoes-angle.jpg",
    badge: "SALE",
    isNew: false,
    sizes: ["41", "42", "43", "44", "45"],
  },
  {
    id: 4,
    name: "Casual Slip-On Sandals",
    price: 2490,
    image: "/black-casual-sandals.jpg",
    hoverImage: "/black-casual-sandals-top.jpg",
    isNew: false,
    sizes: ["40", "41", "42", "43"],
  },
  {
    id: 5,
    name: "High-Top Canvas Sneakers",
    price: 4490,
    image: "/navy-high-top-sneakers.jpg",
    hoverImage: "/navy-high-top-sneakers-side.jpg",
    badge: "NEW",
    isNew: true,
    sizes: ["40", "41", "42", "43", "44"],
  },
  {
    id: 6,
    name: "Formal Oxford Shoes",
    price: 8990,
    image: "/black-formal-oxford-shoes.jpg",
    hoverImage: "/black-oxford-shoes-polished.jpg",
    isNew: false,
    sizes: ["39", "40", "41", "42", "43"],
  },
  {
    id: 7,
    name: "Chunky Platform Sneakers",
    price: 5490,
    originalPrice: 6990,
    image: "/white-chunky-platform-sneakers.jpg",
    hoverImage: "/white-platform-sneakers-angle.jpg",
    badge: "SALE",
    isNew: false,
    sizes: ["40", "41", "42", "43"],
  },
  {
    id: 8,
    name: "Suede Desert Boots",
    price: 6990,
    image: "/tan-suede-desert-boots.jpg",
    hoverImage: "/tan-suede-boots-side-view.jpg",
    badge: "NEW",
    isNew: true,
    sizes: ["41", "42", "43", "44", "45"],
  },
  {
    id: 9,
    name: "Minimalist White Trainers",
    price: 4290,
    image: "/minimalist-white-leather-trainers.jpg",
    hoverImage: "/placeholder.svg?height=400&width=400",
    isNew: false,
    sizes: ["40", "41", "42", "43", "44"],
  },
  {
    id: 10,
    name: "Classic Boat Shoes",
    price: 5490,
    image: "/placeholder.svg?height=400&width=400",
    hoverImage: "/placeholder.svg?height=400&width=400",
    isNew: false,
    sizes: ["40", "41", "42", "43"],
  },
  {
    id: 11,
    name: "Athletic Training Shoes",
    price: 6490,
    originalPrice: 8490,
    image: "/placeholder.svg?height=400&width=400",
    hoverImage: "/placeholder.svg?height=400&width=400",
    badge: "SALE",
    isNew: false,
    sizes: ["41", "42", "43", "44", "45"],
  },
  {
    id: 12,
    name: "Leather Monk Strap Shoes",
    price: 7990,
    image: "/placeholder.svg?height=400&width=400",
    hoverImage: "/placeholder.svg?height=400&width=400",
    badge: "NEW",
    isNew: true,
    sizes: ["39", "40", "41", "42", "43"],
  },
]

export function ProductGrid() {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center mt-12">
        <Button variant="outline" size="lg" className="px-12 bg-transparent">
          Load More Products
        </Button>
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: (typeof products)[0] }) {
  const [isHovered, setIsHovered] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="group relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted mb-3">
        <Image
          src={isHovered ? product.hoverImage : product.image}
          alt={product.name}
          fill
          className="object-cover transition-all duration-500"
        />

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold ${
              product.badge === "SALE" ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
            }`}
          >
            {product.badge}
            {product.badge === "SALE" && discount > 0 && ` -${discount}%`}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-accent text-accent" : ""}`} />
        </button>

        {/* Quick Actions - Show on Hover */}
        <div
          className={`absolute inset-x-0 bottom-0 bg-background/95 backdrop-blur-sm p-3 transition-all duration-300 ${
            isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
        >
          {/* Size Selector */}
          <div className="flex items-center justify-center gap-1 mb-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-8 h-8 text-xs border transition-colors ${
                  selectedSize === size
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary"
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button size="sm" className="flex-1 gap-1 text-xs">
              <ShoppingBag className="h-3 w-3" />
              Add to Cart
            </Button>
            <Button size="sm" variant="outline" className="px-2 bg-transparent">
              <Eye className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium line-clamp-2 group-hover:underline cursor-pointer">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="font-semibold">PKR {product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              PKR {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
