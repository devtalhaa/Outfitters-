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
  Loader2
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
  articleCode: string;
}

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "Default")
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [viewerCount, setViewerCount] = useState(12)
  const [isAdding, setIsAdding] = useState(false)
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
      cart[existingItemIndex].quantity += 1
    } else {
      cart.push({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: selectedSize,
        color: selectedColor,
        quantity: 1
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
    <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase mb-10 text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-all">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground font-black">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Left: Product Gallery */}
        <div className="space-y-6">
          <ProductGallery images={product.images} />
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase mb-2 block italic">
                {product.category} • {product.articleCode}
              </span>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tighter uppercase leading-none mb-2">
                {product.name}
              </h1>
            </div>
            <button
              onClick={() => toggleWishlist(product._id)}
              className="p-3 border-2 border-foreground/10 hover:border-foreground transition-all group"
            >
              <Heart className={`w-5 h-5 transition-transform group-hover:scale-110 ${isWishlisted(product._id) ? "fill-red-500 text-red-500" : ""}`} />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-10">
            <div className="flex flex-col">
              <span className="text-2xl lg:text-3xl font-black tracking-tight">PKR {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through font-bold">PKR {product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            {discount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1.5 uppercase tracking-widest shadow-xl">
                -{discount}% OFF
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mb-10 p-5 bg-foreground/[0.03] border-l-4 border-foreground shadow-sm">
            <div className="relative w-2 h-2">
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping"></div>
              <div className="relative w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-widest">
              <span className="font-black">{viewerCount} people</span> are currently eyeing this item
            </p>
          </div>

          <div className="mb-10">
            <p className="text-[10px] font-black tracking-widest uppercase mb-4">Select Color: <span className="text-muted-foreground ml-1 underline">{selectedColor}</span></p>
            <div className="flex gap-4">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`group relative w-12 h-12 border-2 transition-all p-1 ${selectedColor === color.name ? "border-foreground shadow-lg scale-110" : "border-transparent hover:border-border"}`}
                >
                  <div className="w-full h-full shadow-inner" style={{ backgroundColor: color.value }} />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black tracking-widest uppercase">Select Size (EU)</p>
              {selectedSizeInfo && selectedSizeInfo.stock <= 5 && selectedSizeInfo.stock > 0 && (
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse">
                  Only {selectedSizeInfo.stock} Available
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size.value}
                  disabled={size.stock === 0}
                  onClick={() => setSelectedSize(size.value)}
                  className={`h-14 border-2 text-[10px] font-black transition-all ${size.stock === 0 ? "opacity-20 cursor-not-allowed bg-muted" : selectedSize === size.value ? "bg-foreground text-background border-foreground shadow-xl scale-105" : "bg-background text-foreground border-border hover:border-foreground"}`}
                >
                  {size.value}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-12">
            <Button
              disabled={isAdding}
              onClick={() => handleAddToCart(false)}
              size="lg"
              className="w-full h-16 text-[11px] font-black tracking-[0.25em] uppercase rounded-none shadow-2xl transition-all"
            >
              {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : "ADD TO SHOPPING BAG"}
            </Button>
            <Button
              onClick={() => handleAddToCart(true)}
              variant="outline"
              size="lg"
              className="w-full h-16 text-[11px] font-black tracking-[0.25em] uppercase rounded-none border-2 border-foreground hover:bg-foreground hover:text-background transition-all shadow-lg"
            >
              BUY IT NOW
            </Button>
          </div>

          <Accordion type="single" collapsible className="w-full divide-y divide-border border-t border-b border-border mb-12">
            <AccordionItem value="description" className="border-none">
              <AccordionTrigger className="text-[10px] font-black uppercase tracking-widest py-6 hover:no-underline">Product Description</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed font-medium text-foreground/80 pb-8 uppercase tracking-tight">
                {product.description}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="composition" className="border-none">
              <AccordionTrigger className="text-[10px] font-black uppercase tracking-widest py-6 hover:no-underline">Composition & Care</AccordionTrigger>
              <AccordionContent className="pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-[10px] font-bold uppercase tracking-widest">
                  <div className="p-4 bg-muted/20">
                    <p className="text-muted-foreground mb-2">Material Structure</p>
                    <p className="font-black text-foreground">{product.composition || "Premium Synthetic Leather / Mesh"}</p>
                  </div>
                  <div className="p-4 bg-muted/20">
                    <p className="text-muted-foreground mb-2">Care Instructions</p>
                    <p className="font-black text-foreground">{product.care || "Wipe clean with a damp cloth. Do not machine wash."}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="grid grid-cols-3 gap-8 py-4">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-4 bg-foreground/5 rounded-full"><Truck className="w-6 h-6" /></div>
              <p className="text-[9px] font-black uppercase tracking-widest">Fast Logistics</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-4 bg-foreground/5 rounded-full"><RotateCcw className="w-6 h-6" /></div>
              <p className="text-[9px] font-black uppercase tracking-widest">Returns Policy</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-4 bg-foreground/5 rounded-full"><ShieldCheck className="w-6 h-6" /></div>
              <p className="text-[9px] font-black uppercase tracking-widest">Verfied Checkout</p>
            </div>
          </div>
        </div>
      </div>

      <ProductReviews productId={product._id} />
      <ProductRecommendations />
    </div>
  )
}
