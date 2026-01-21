"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useWishlist } from "@/context/wishlist-context"

interface ProductGridProps {
  filters: any
}

export function ProductGrid({ filters }: ProductGridProps) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10) // Fixed for infinite scroll
  const [pagination, setPagination] = useState<any>(null)
  // Infinite scroll state
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const productObserverRef = useRef<IntersectionObserver | null>(null)
  const filtersRef = useRef(filters) // Track filter changes

  // Update filters ref when filters change
  useEffect(() => {
    filtersRef.current = filters
  }, [filters])

  // Initial fetch and reset when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setCurrentPage(1)
      setHasMore(true)
      try {
        const params = new URLSearchParams()
        if (filters.category && filters.category !== "All Footwear") params.set("category", filters.category)
        if (filters.size) params.set("size", filters.size)
        if (filters.color) params.set("color", filters.color)
        if (filters.minPrice) params.set("minPrice", filters.minPrice)
        if (filters.maxPrice) params.set("maxPrice", filters.maxPrice)
        if (filters.sort) params.set("sort", filters.sort)

        params.set("page", "1")
        params.set("limit", itemsPerPage.toString())

        const res = await fetch(`/api/products?${params.toString()}`)
        const data = await res.json()

        if (data.products) {
          setProducts(data.products)
          setPagination(data.pagination)
          setHasMore(1 < data.pagination.pages)
        } else {
          setProducts(Array.isArray(data) ? data : [])
          setPagination(null)
          setHasMore(false)
        }
      } catch (error) {
        console.error("Failed to fetch products", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [filters, itemsPerPage])

  // Fetch more products for infinite scroll
  const fetchMoreProducts = useCallback(async () => {
    if (loadingMore || !hasMore) return

    const nextPage = currentPage + 1
    setLoadingMore(true)

    try {
      const params = new URLSearchParams()
      const currentFilters = filtersRef.current
      if (currentFilters.category && currentFilters.category !== "All Footwear") params.set("category", currentFilters.category)
      if (currentFilters.size) params.set("size", currentFilters.size)
      if (currentFilters.color) params.set("color", currentFilters.color)
      if (currentFilters.minPrice) params.set("minPrice", currentFilters.minPrice)
      if (currentFilters.maxPrice) params.set("maxPrice", currentFilters.maxPrice)
      if (currentFilters.sort) params.set("sort", currentFilters.sort)

      params.set("page", nextPage.toString())
      params.set("limit", itemsPerPage.toString())

      const res = await fetch(`/api/products?${params.toString()}`)
      const data = await res.json()

      if (data.products && data.products.length > 0) {
        setProducts(prev => [...prev, ...data.products])
        setPagination(data.pagination)
        setCurrentPage(nextPage)
        setHasMore(nextPage < data.pagination.pages)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Failed to load more products", error)
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, hasMore, currentPage, itemsPerPage])

  // Intersection Observer callback for infinite scroll trigger
  const lastProductRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || loadingMore) return

    if (productObserverRef.current) {
      productObserverRef.current.disconnect()
    }

    productObserverRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMoreProducts()
      }
    }, { threshold: 0.1 })

    if (node) {
      productObserverRef.current.observe(node)
    }
  }, [loading, loadingMore, hasMore, fetchMoreProducts])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="w-12 h-12 animate-spin text-foreground mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Updating Collection...</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 border-y border-dashed border-border mx-4">
        <ShoppingBag className="w-12 h-12 text-muted-foreground opacity-20 mb-4" />
        <h3 className="text-xl font-black uppercase tracking-tight">No products found</h3>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">Try adjusting your filters or category</p>
      </div>
    )
  }

  return (
    <section className="container mx-auto px-4 py-8">
      {pagination && (
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-border">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Showing <span className="text-foreground">{products.length}</span> of <span className="text-foreground">{pagination.total}</span> Results
          </p>
        </div>
      )}
      <div className={`grid gap-4 lg:gap-8 ${filters.view === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
        {products.map((product, index) => {
          // Attach intersection observer to the 6th product from the end
          const isObserverTarget = index === products.length - 6

          return (
            <div key={product._id} ref={isObserverTarget ? lastProductRef : null}>
              <ProductCard product={product} view={filters.view} />
            </div>
          )
        })}
      </div>

      {/* Infinite scroll loading indicator */}
      {loadingMore && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-foreground mb-3" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
            Loading more products...
          </p>
        </div>
      )}

      {/* End of products indicator */}
      {!hasMore && products.length > 0 && (
        <div className="flex flex-col items-center justify-center py-12 border-t border-border mt-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
            Showing all {pagination?.total || products.length} products
          </p>
        </div>
      )}
    </section>
  )
}

function ProductCard({ product, view }: { product: any; view: string }) {
  const [isHovered, setIsHovered] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || "Default")
  const { toggleWishlist, isWishlisted } = useWishlist()
  const router = useRouter()

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product._id)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!selectedSize) {
      toast.error("Please select a size first")
      return
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingIndex = cart.findIndex((item: any) =>
      (item.id === product._id || item._id === product._id) &&
      item.size === selectedSize &&
      item.color === selectedColor
    )

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1
    } else {
      cart.push({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: selectedSize,
        color: selectedColor,
        quantity: 1
      })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    window.dispatchEvent(new Event("storage")) // Trigger header cart count update
    toast.success(`${product.name} (Size ${selectedSize}, Color ${selectedColor}) added to cart`)
  }

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!selectedSize) {
      toast.error("Please select a size first")
      return
    }
    handleAddToCart(e)
    router.push("/checkout")
  }

  if (view === "list") {
    return (
      <div className="flex flex-col md:flex-row gap-6 border border-border p-4 group bg-white hover:border-foreground transition-all duration-300 rounded-2xl">
        <Link href={`/product/${product.slug}`} className="relative w-full md:w-64 aspect-[4/5] bg-muted overflow-hidden rounded-xl">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {discount > 0 && (
            <span className="absolute top-3 left-3 px-2 py-1 text-[9px] font-black bg-red-500 text-white uppercase tracking-[0.2em] shadow-lg rounded-full">
              -{discount}% OFF
            </span>
          )}
        </Link>
        <div className="flex-1 flex flex-col justify-between py-2">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{product.category}</p>
                <h3 className="text-xl font-black uppercase tracking-tighter mb-2 group-hover:underline">{product.name}</h3>
              </div>
              <div className="text-right">
                <p className="text-lg font-black">PKR {product.price.toLocaleString()}</p>
                {product.originalPrice && <p className="text-[10px] text-muted-foreground line-through font-bold">PKR {product.originalPrice.toLocaleString()}</p>}
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3 mb-6 font-medium mt-4">{product.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-3">Available Colors</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color: any) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                      className={`w-10 h-10 border-2 transition-all p-0.5 rounded-full ${selectedColor === color.name ? "border-foreground shadow-md scale-110" : "border-transparent hover:border-border"}`}
                    >
                      <div className="w-full h-full rounded-full" style={{ backgroundColor: color.value }} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-3">Available Sizes</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size: any) => (
                    <button
                      key={size.value}
                      onClick={() => setSelectedSize(size.value)}
                      className={`w-12 h-12 flex items-center justify-center text-[10px] font-black border transition-all rounded-xl ${selectedSize === size.value ? "bg-foreground text-background border-foreground shadow-lg" : "border-border hover:border-foreground"}`}
                    >
                      {size.value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleAddToCart} className="flex-1 rounded-xl h-14 font-black tracking-widest uppercase shadow-lg">
              Add to Cart
            </Button>
            <Button onClick={handleBuyNow} variant="outline" className="flex-1 rounded-xl h-14 border-2 border-foreground font-black tracking-widest uppercase hover:bg-foreground hover:text-background transition-all">
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* Image Container */}
      <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden bg-muted mb-4 cursor-pointer rounded-2xl" onClick={() => router.push(`/product/${product.slug}`)}>
        <Image
          src={(isHovered && product.images[1]) ? product.images[1] : product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {discount > 0 && (
            <span className="px-3 py-1.5 text-[9px] font-black bg-red-500 text-white uppercase tracking-[0.2em] shadow-xl rounded-full">
              -{discount}%
            </span>
          )}
          {product.category === "Sneakers" && (
            <span className="px-3 py-1.5 text-[9px] font-black bg-foreground text-background uppercase tracking-[0.2em] shadow-xl rounded-full">
              Trend
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-4 right-4 p-2.5 bg-background shadow-xl hover:bg-foreground hover:text-background transition-all duration-300 z-20 group/wish rounded-full"
        >
          <Heart className={`h-4 w-4 transition-transform group-hover/wish:scale-125 ${isWishlisted(product._id) ? "fill-red-500 text-red-500" : ""}`} />
        </button>

        {/* Quick Actions overlay */}
        <div className={`absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm p-4 transition-all duration-500 z-10 ${isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
          <div className="mb-4">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 text-center">Available Colors</p>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {product.colors.map((color: any) => (
                <button
                  key={color.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(color.name);
                  }}
                  title={color.name}
                  className={`w-6 h-6 border-2 transition-all p-0.5 rounded-full ${selectedColor === color.name ? "border-foreground shadow-md scale-110" : "border-transparent hover:border-border"}`}
                >
                  <div className="w-full h-full rounded-full" style={{ backgroundColor: color.value }} />
                </button>
              ))}
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 text-center">Available Sizes</p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {product.sizes.map((size: any) => (
                <button
                  key={size.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(size.value);
                  }}
                  className={`min-w-[40px] h-10 px-2 text-[10px] font-black border transition-all rounded-lg ${selectedSize === size.value ? "bg-foreground text-background border-foreground shadow-lg" : "border-border hover:border-foreground"}`}
                >
                  {size.value}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={handleAddToCart} className="w-full rounded-xl h-12 text-[10px] font-black uppercase tracking-widest shadow-xl">
              Add to Cart
            </Button>
            <button onClick={handleBuyNow} className="w-full text-center py-2 text-[9px] font-black uppercase tracking-widest hover:underline transition-all">
              Quick Buy
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-1 block cursor-pointer" onClick={() => router.push(`/product/${product.slug}`)}>
        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">{product.category}</p>
        <h3 className="text-xs font-black uppercase tracking-tight group-hover:underline line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-3 pt-1">
          <span className="text-sm font-black tracking-tight">PKR {product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-[10px] text-muted-foreground line-through font-bold">
              PKR {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
