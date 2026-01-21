"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ChevronRight,
  Heart,
  Share2,
  Truck,
  RotateCcw,
  ShieldCheck,
  Info,
  Facebook,
  Twitter,
  Instagram,
  Loader2,
  Minus,
  Plus,
  Ruler,
  X
} from "lucide-react"
import { ProductGallery } from "@/components/product-gallery"
import { ProductRecommendations } from "@/components/product-recommendations"
import { ProductReviews } from "@/components/product-reviews"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useWishlist } from "@/context/wishlist-context"

interface Product {
  _id: string;
  id?: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  colors: { name: string; value: string }[];
  sizes: { value: string; stock: number }[];
  category: string;
  composition?: string;
  care?: string;
  sizeChart?: string;
  articleCode: string;
}

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "Default")
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [viewerCount, setViewerCount] = useState(12)
  const [isAdding, setIsAdding] = useState(false)
  const [showSizeChart, setShowSizeChart] = useState(false)
  const { toggleWishlist, isWishlisted } = useWishlist()
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => Math.max(5, Math.min(35, prev + (Math.random() > 0.5 ? 1 : -1))))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const selectedSizeInfo = product.sizes.find(s => s.value === selectedSize)
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0

  const handleAddToCart = (isBuyNow = false) => {
    if (!selectedSize) {
      toast.error("Please select a size first")
      return
    }

    setIsAdding(true)

    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const productId = product._id

    const existingItemIndex = cart.findIndex(
      (item: any) => (item.id === productId || item._id === productId) && item.size === selectedSize
    )

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity
    } else {
      cart.push({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: selectedSize,
        color: selectedColor,
        quantity: quantity
      })
    }

    localStorage.setItem("cart", JSON.stringify(cart))

    // Dispatch event to update other components (like Header basket count)
    window.dispatchEvent(new Event("storage"))

    setTimeout(() => {
      setIsAdding(false)
      toast.success(`${product.name} (Size ${selectedSize}) added to bag`)
      if (isBuyNow) {
        router.push("/checkout")
      }
    }, 500)
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[10px] font-bold tracking-wider sm:tracking-[0.2em] uppercase mb-4 sm:mb-6 lg:mb-10 text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-all">Home</Link>
        <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        <span className="text-foreground font-black truncate max-w-[150px] sm:max-w-none">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-20">
        {/* Left: Product Gallery */}
        <div className="space-y-4 sm:space-y-6">
          <ProductGallery images={product.images} />
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
            <div className="min-w-0">
              <span className="text-[8px] sm:text-[10px] font-bold tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground uppercase mb-1 sm:mb-2 block italic">
                {product.category} • {product.articleCode}
              </span>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tighter uppercase leading-none mb-1 sm:mb-2">
                {product.name}
              </h1>
            </div>
            <button
              onClick={() => toggleWishlist(product._id)}
              className="p-2 sm:p-3 border-2 border-foreground/10 hover:border-foreground transition-all group rounded-full flex-shrink-0"
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110 ${isWishlisted(product._id) ? "fill-red-500 text-red-500" : ""}`} />
            </button>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">PKR {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-xs sm:text-sm text-muted-foreground line-through font-bold">PKR {product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            {discount > 0 && (
              <span className="bg-red-500 text-white text-[8px] sm:text-[10px] font-black px-2 sm:px-3 py-1 sm:py-1.5 uppercase tracking-widest shadow-xl rounded-full">
                -{discount}% OFF
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-10 p-3 sm:p-5 bg-foreground/[0.03] border-l-4 border-foreground shadow-sm rounded-r-xl">
            <div className="relative w-2 h-2">
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping"></div>
              <div className="relative w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider sm:tracking-widest">
              <span className="font-black">{viewerCount} people</span> viewing
            </p>
          </div>

          <div className="mb-6 sm:mb-10">
            <p className="text-[9px] sm:text-[10px] font-black tracking-widest uppercase mb-3 sm:mb-4">Select Color: <span className="text-muted-foreground ml-1 underline">{selectedColor}</span></p>
            <div className="flex gap-3 sm:gap-4">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`group relative w-10 h-10 sm:w-12 sm:h-12 border-2 transition-all p-1 rounded-full ${selectedColor === color.name ? "border-foreground shadow-lg scale-110" : "border-transparent hover:border-border"}`}
                >
                  <div className="w-full h-full shadow-inner rounded-full" style={{ backgroundColor: color.value }} />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6 sm:mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2">
              <div className="flex items-center gap-2 sm:gap-4">
                <p className="text-[9px] sm:text-[10px] font-black tracking-widest uppercase">Select Size</p>
                {product.sizeChart && (
                  <button
                    onClick={() => setShowSizeChart(true)}
                    className="flex items-center gap-1 sm:gap-2 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest text-muted-foreground hover:text-foreground transition-colors underline"
                  >
                    <Ruler className="w-3 h-3 sm:w-4 sm:h-4" /> Chart
                  </button>
                )}
              </div>
              {selectedSizeInfo && selectedSizeInfo.stock <= 5 && selectedSizeInfo.stock > 0 && (
                <span className="text-[8px] sm:text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse">
                  Only {selectedSizeInfo.stock} left
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 sm:gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size.value}
                  disabled={size.stock === 0}
                  onClick={() => setSelectedSize(size.value)}
                  className={`h-11 sm:h-14 border-2 text-[9px] sm:text-[10px] font-black transition-all rounded-lg sm:rounded-xl ${size.stock === 0 ? "opacity-20 cursor-not-allowed bg-muted" : selectedSize === size.value ? "bg-foreground text-background border-foreground shadow-xl scale-105" : "bg-background text-foreground border-border hover:border-foreground"}`}
                >
                  {size.value}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6 sm:mb-10">
            <p className="text-[9px] sm:text-[10px] font-black tracking-widest uppercase mb-3 sm:mb-4">Quantity</p>
            <div className="flex items-center w-28 sm:w-36 border-2 border-border rounded-lg sm:rounded-xl overflow-hidden bg-background">
              <button
                type="button"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="p-3 sm:p-4 hover:bg-muted transition-colors border-r border-border"
              >
                <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <span className="flex-1 text-center font-black text-xs sm:text-sm">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(prev => Math.min(selectedSizeInfo?.stock || 50, prev + 1))}
                className="p-3 sm:p-4 hover:bg-muted transition-colors border-l border-border"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4 mb-8 sm:mb-12">
            <Button
              disabled={isAdding}
              onClick={() => handleAddToCart(false)}
              size="lg"
              className="w-full h-12 sm:h-16 text-[10px] sm:text-[11px] font-black tracking-[0.15em] sm:tracking-[0.25em] uppercase rounded-lg sm:rounded-xl shadow-2xl transition-all"
            >
              {isAdding ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : "ADD TO BAG"}
            </Button>
            <Button
              onClick={() => handleAddToCart(true)}
              variant="outline"
              size="lg"
              className="w-full h-12 sm:h-16 text-[10px] sm:text-[11px] font-black tracking-[0.15em] sm:tracking-[0.25em] uppercase rounded-lg sm:rounded-xl border-2 border-foreground hover:bg-foreground hover:text-background transition-all shadow-lg"
            >
              BUY NOW
            </Button>
          </div>

          <Accordion type="single" collapsible className="w-full divide-y divide-border border-t border-b border-border mb-8 sm:mb-12">
            <AccordionItem value="description" className="border-none">
              <AccordionTrigger className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest py-4 sm:py-6 hover:no-underline">Description</AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm leading-relaxed font-medium text-foreground/80 pb-6 sm:pb-8 uppercase tracking-tight">
                {product.description}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="composition" className="border-none">
              <AccordionTrigger className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest py-4 sm:py-6 hover:no-underline">Composition & Care</AccordionTrigger>
              <AccordionContent className="pb-6 sm:pb-8">
                <div className="grid grid-cols-1 gap-4 sm:gap-8 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">
                  <div className="p-3 sm:p-4 bg-muted/20">
                    <p className="text-muted-foreground mb-1 sm:mb-2">Material</p>
                    <p className="font-black text-foreground">{product.composition || "Premium Synthetic"}</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-muted/20">
                    <p className="text-muted-foreground mb-1 sm:mb-2">Care</p>
                    <p className="font-black text-foreground">{product.care || "Wipe clean"}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="grid grid-cols-3 gap-3 sm:gap-8 py-3 sm:py-4">
            <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
              <div className="p-2.5 sm:p-4 bg-foreground/5 rounded-full"><Truck className="w-4 h-4 sm:w-6 sm:h-6" /></div>
              <p className="text-[7px] sm:text-[9px] font-black uppercase tracking-wider sm:tracking-widest">Fast Delivery</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
              <div className="p-2.5 sm:p-4 bg-foreground/5 rounded-full"><RotateCcw className="w-4 h-4 sm:w-6 sm:h-6" /></div>
              <p className="text-[7px] sm:text-[9px] font-black uppercase tracking-wider sm:tracking-widest">Easy Returns</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
              <div className="p-2.5 sm:p-4 bg-foreground/5 rounded-full"><ShieldCheck className="w-4 h-4 sm:w-6 sm:h-6" /></div>
              <p className="text-[7px] sm:text-[9px] font-black uppercase tracking-wider sm:tracking-widest">Secure</p>
            </div>
          </div>
        </div>
      </div>

      <ProductReviews productId={product._id} />
      <ProductRecommendations />

      {/* Size Chart Modal */}
      {showSizeChart && product.sizeChart && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSizeChart(false)} />
          <div className="relative bg-white p-2 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <button
              onClick={() => setShowSizeChart(false)}
              className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white transition-colors z-10"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
            <h3 className="text-xl font-black uppercase tracking-tight text-center py-4">
              {product.category.includes("Men") ? "Men's" : product.category.includes("Women") ? "Women's" : "Footwear"} Size Chart
            </h3>
            <div className="relative aspect-[3/4] w-full">
              <img
                src={product.sizeChart}
                alt={`${product.name} Size Chart`}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
