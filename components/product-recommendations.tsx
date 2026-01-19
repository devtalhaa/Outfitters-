"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

export function ProductRecommendations() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products?limit=8")
                const data = await res.json()

                if (data.products) {
                    setProducts(data.products)
                } else {
                    setProducts(Array.isArray(data) ? data.slice(0, 8) : [])
                }
            } catch (error) {
                console.error("Failed to fetch recommendations", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current
            const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth
            scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" })
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (products.length === 0) return null

    return (
        <section className="py-12 border-t border-border mt-12">
            <div className="flex items-center justify-between mb-8 px-4 lg:px-0">
                <h2 className="text-sm font-bold tracking-widest uppercase italic">You May Also Like</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll("left")}
                        className="p-2 border border-border hover:bg-muted transition-colors rounded-full"
                        aria-label="Previous products"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="p-2 border border-border hover:bg-muted transition-colors rounded-full"
                        aria-label="Next products"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 lg:px-0"
            >
                {products.map((product) => (
                    <Link
                        key={product._id}
                        href={`/product/${product.slug}`}
                        className="group flex-shrink-0 w-[200px] lg:w-[280px] snap-start"
                    >
                        <div className="aspect-[4/5] bg-[#f5f5f5] relative overflow-hidden mb-3">
                            <Image
                                src={product.images[0] || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <h3 className="text-xs font-black mb-1 group-hover:underline uppercase tracking-tight line-clamp-1">
                            {product.name}
                        </h3>
                        <p className="text-sm font-bold">PKR {product.price.toLocaleString()}</p>
                    </Link>
                ))}
            </div>
        </section>
    )
}
