"use client"

import { useState, useEffect } from "react"
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
  const [itemsPerPage, setItemsPerPage] = useState(8)
  const [pagination, setPagination] = useState<any>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (filters.category && filters.category !== "All Footwear") params.set("category", filters.category)
        if (filters.size) params.set("size", filters.size)
        if (filters.color) params.set("color", filters.color)
        if (filters.minPrice) params.set("minPrice", filters.minPrice)
        if (filters.maxPrice) params.set("maxPrice", filters.maxPrice)
        if (filters.sort) params.set("sort", filters.sort)

        params.set("page", currentPage.toString())
        params.set("limit", itemsPerPage.toString())

        const res = await fetch(`/api/products?${params.toString()}`)
        const data = await res.json()

        if (data.products) {
          setProducts(data.products)
          setPagination(data.pagination)
        } else {
          setProducts(Array.isArray(data) ? data : [])
          setPagination(null)
        }
      } catch (error) {
        console.error("Failed to fetch products", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [filters, currentPage, itemsPerPage])

  // Reset to first page when filters or limit change
  useEffect(() => {
    setCurrentPage(1)
  }, [filters.category, filters.size, filters.color, filters.minPrice, filters.maxPrice, filters.sort, itemsPerPage])

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
          <div className="flex items-center gap-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Showing <span className="text-foreground">{products.length}</span> of <span className="text-foreground">{pagination.total}</span> Results
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                className="bg-transparent text-[10px] font-black uppercase tracking-widest focus:outline-none cursor-pointer border-b border-foreground/20 hover:border-foreground"
              >
                <option value="8">8</option>
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="48">48</option>
              </select>
            </div>
          </div>
          {pagination.pages > 1 && (
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Page <span className="text-foreground">{currentPage}</span> / {pagination.pages}
            </p>
          )}
        </div>
      )}
      <div className={`grid gap-4 lg:gap-8 ${filters.view === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} view={filters.view} />
        ))}
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12 border-t border-border pt-12">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="rounded-none px-8 h-12 border-2 border-foreground font-black uppercase tracking-widest disabled:opacity-20 flex items-center gap-2 group"
          >
            <div className="group-hover:-translate-x-1 transition-transform">←</div> Prev
          </Button>

          <div className="flex items-center gap-2">
            {[...Array(pagination.pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-12 h-12 text-[10px] font-black transition-all border-2 ${currentPage === i + 1 ? "bg-foreground text-background border-foreground shadow-xl scale-110" : "bg-white text-foreground border-transparent hover:border-border"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            disabled={currentPage === pagination.pages}
            onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
            className="rounded-none px-8 h-12 border-2 border-foreground font-black uppercase tracking-widest disabled:opacity-20 flex items-center gap-2 group"
          >
            Next <div className="group-hover:translate-x-1 transition-transform">→</div>
          </Button>
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
      <div className="flex flex-col md:flex-row gap-6 border border-border p-4 group bg-white hover:border-foreground transition-all duration-300">
        <Link href={`/product/${product.slug}`} className="relative w-full md:w-64 aspect-[4/5] bg-muted overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {discount > 0 && (
            <span className="absolute top-3 left-3 px-2 py-1 text-[9px] font-black bg-red-500 text-white uppercase tracking-[0.2em] shadow-lg">
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
                      className={`w-10 h-10 border-2 transition-all p-0.5 ${selectedColor === color.name ? "border-foreground shadow-md scale-110" : "border-transparent hover:border-border"}`}
                    >
                      <div className="w-full h-full" style={{ backgroundColor: color.value }} />
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
                      className={`w-12 h-12 flex items-center justify-center text-[10px] font-black border transition-all ${selectedSize === size.value ? "bg-foreground text-background border-foreground shadow-lg" : "border-border hover:border-foreground"}`}
                    >
                      {size.value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleAddToCart} className="flex-1 rounded-none h-14 font-black tracking-widest uppercase shadow-lg">
              Add to Cart
            </Button>
            <Button onClick={handleBuyNow} variant="outline" className="flex-1 rounded-none h-14 border-2 border-foreground font-black tracking-widest uppercase hover:bg-foreground hover:text-background transition-all">
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
      <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden bg-muted mb-4 cursor-pointer" onClick={() => router.push(`/product/${product.slug}`)}>
        <Image
          src={(isHovered && product.images[1]) ? product.images[1] : product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {discount > 0 && (
            <span className="px-3 py-1.5 text-[9px] font-black bg-red-500 text-white uppercase tracking-[0.2em] shadow-xl">
              -{discount}%
            </span>
          )}
          {product.category === "Sneakers" && (
            <span className="px-3 py-1.5 text-[9px] font-black bg-foreground text-background uppercase tracking-[0.2em] shadow-xl">
              Trend
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-4 right-4 p-2.5 bg-background shadow-xl hover:bg-foreground hover:text-background transition-all duration-300 z-20 group/wish"
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
                  className={`w-6 h-6 border-2 transition-all p-0.5 ${selectedColor === color.name ? "border-foreground shadow-md scale-110" : "border-transparent hover:border-border"}`}
                >
                  <div className="w-full h-full" style={{ backgroundColor: color.value }} />
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
                  className={`min-w-[40px] h-10 px-2 text-[10px] font-black border transition-all ${selectedSize === size.value ? "bg-foreground text-background border-foreground shadow-lg" : "border-border hover:border-foreground"}`}
                >
                  {size.value}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={handleAddToCart} className="w-full rounded-none h-12 text-[10px] font-black uppercase tracking-widest shadow-xl">
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
