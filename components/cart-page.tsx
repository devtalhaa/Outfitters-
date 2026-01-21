"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductRecommendations } from "@/components/product-recommendations"
import { useRouter } from "next/navigation"

export function CartPage() {
    const [cartItems, setCartItems] = useState<any[]>([])
    const router = useRouter()

    useEffect(() => {
        const loadCart = () => {
            const savedCart = localStorage.getItem("cart")
            if (savedCart) {
                setCartItems(JSON.parse(savedCart))
            }
        }
        loadCart()
        window.addEventListener("storage", loadCart)
        return () => window.removeEventListener("storage", loadCart)
    }, [])

    const saveCart = (newCart: any[]) => {
        setCartItems(newCart)
        localStorage.setItem("cart", JSON.stringify(newCart))
        window.dispatchEvent(new Event("storage"))
    }

    const updateQuantity = (id: string, size: string, delta: number) => {
        const newCart = cartItems.map(item =>
            (item.id === id || item._id === id) && item.size === size
                ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                : item
        )
        saveCart(newCart)
    }

    const removeItem = (id: string, size: string) => {
        const newCart = cartItems.filter(item => !((item.id === id || item._id === id) && item.size === size))
        saveCart(newCart)
    }

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const shipping = 0
    const total = subtotal

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-3 sm:px-4 py-16 sm:py-32 text-center">
                <div className="flex justify-center mb-6 sm:mb-8 opacity-20">
                    <ShoppingBag className="w-16 h-16 sm:w-24 sm:h-24 text-foreground" />
                </div>
                <h1 className="text-xl sm:text-3xl font-black uppercase tracking-tight mb-3 sm:mb-4">Your bag is empty</h1>
                <p className="text-muted-foreground mb-8 sm:mb-12 max-w-md mx-auto font-medium text-sm sm:text-base px-4">
                    Start exploring our collection and find your perfect pair.
                </p>
                <Link href="/">
                    <Button className="px-8 sm:px-12 h-12 sm:h-16 rounded-none font-black tracking-widest uppercase shadow-xl text-xs sm:text-sm">
                        Explore Collection
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-12">
            <nav className="flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-[0.2em] mb-6 sm:mb-12 text-muted-foreground">
                <Link href="/" className="hover:text-foreground transition-all">Home</Link>
                <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span className="text-foreground">Bag ({cartItems.length})</span>
            </nav>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                <div className="lg:col-span-8 order-2 lg:order-1">
                    <h1 className="text-xl sm:text-3xl font-black uppercase tracking-tighter mb-6 sm:mb-12">SHOPPING BAG</h1>
                    <div className="space-y-6 sm:space-y-10">
                        {cartItems.map((item, idx) => (
                            <div key={`${item.id || item._id}-${item.size}-${idx}`} className="flex gap-3 sm:gap-6 lg:gap-8 pb-6 sm:pb-10 border-b border-border last:border-0 group">
                                <Link href={`/product/${item.slug || ""}`} className="relative w-20 h-28 sm:w-28 sm:h-36 lg:w-40 lg:h-52 bg-muted shrink-0 overflow-hidden shadow-sm">
                                    <Image
                                        src={item.image || (item.images ? item.images[0] : "")}
                                        alt={item.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </Link>
                                <div className="flex-1 flex flex-col pt-1 sm:pt-2 min-w-0">
                                    <div className="flex justify-between items-start mb-2 sm:mb-4 gap-2">
                                        <div className="min-w-0">
                                            <h3 className="text-xs sm:text-base lg:text-lg font-black uppercase tracking-tight group-hover:underline decoration-2 truncate">
                                                {item.name}
                                            </h3>
                                            <p className="text-[8px] sm:text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5 sm:mt-1 font-bold hidden sm:block">
                                                Ref: {item.articleCode || "OUTF-001"}
                                            </p>
                                        </div>
                                        <p className="text-sm sm:text-lg font-black flex-shrink-0">PKR {(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                    <div className="flex gap-4 sm:gap-8 mb-3 sm:mb-6">
                                        <div>
                                            <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-0.5 sm:mb-1">Color</p>
                                            <p className="text-[10px] sm:text-xs font-bold uppercase">{item.color || item.selectedColor || "Default"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-0.5 sm:mb-1">Size</p>
                                            <p className="text-[10px] sm:text-xs font-black uppercase">{item.size || item.selectedSize}</p>
                                        </div>
                                    </div>
                                    <div className="mt-auto flex items-center justify-between gap-2">
                                        <div className="flex items-center border sm:border-2 border-foreground bg-white overflow-hidden shadow-sm">
                                            <button onClick={() => updateQuantity(item.id || item._id, item.size || item.selectedSize, -1)} className="p-1.5 sm:p-2.5 hover:bg-muted font-bold text-sm sm:text-lg leading-none" disabled={item.quantity <= 1}>
                                                −
                                            </button>
                                            <span className="w-7 sm:w-10 text-center text-xs sm:text-sm font-black">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id || item._id, item.size || item.selectedSize, 1)} className="p-1.5 sm:p-2.5 hover:bg-muted font-bold text-sm sm:text-lg leading-none">
                                                +
                                            </button>
                                        </div>
                                        <button onClick={() => removeItem(item.id || item._id, item.size || item.selectedSize)} className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest text-muted-foreground hover:text-red-500 flex items-center gap-1 sm:gap-2 group/remove transition-colors">
                                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover/remove:-rotate-12" />
                                            <span className="underline underline-offset-2 sm:underline-offset-4 hidden sm:inline">Remove</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-4 order-1 lg:order-2 lg:sticky lg:top-24 h-fit">
                    <div className="bg-foreground text-background p-5 sm:p-10 shadow-2xl">
                        <h2 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-5 sm:mb-8 border-b border-background/20 pb-3 sm:pb-4">Order Summary</h2>
                        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-10">
                            <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-70">
                                <span>Subtotal</span>
                                <span>PKR {subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-70">
                                <span>Shipping</span>
                                <span>FREE</span>
                            </div>
                            <div className="pt-4 sm:pt-6 border-t border-background/20 flex justify-between items-baseline">
                                <span className="text-sm sm:text-base font-black uppercase tracking-widest">Total</span>
                                <span className="text-xl sm:text-2xl font-black">PKR {total.toLocaleString()}</span>
                            </div>
                        </div>

                        <Button onClick={() => router.push("/checkout")} className="w-full h-12 sm:h-16 bg-background text-foreground rounded-none font-black tracking-[0.15em] sm:tracking-[0.25em] uppercase transition-transform hover:scale-[1.02] shadow-xl group text-xs sm:text-sm">
                            Checkout
                            <ArrowRight className="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />
                        </Button>
                        <p className="text-[8px] sm:text-[9px] text-center mt-4 sm:mt-6 font-bold uppercase tracking-widest opacity-50">Proceed to payment</p>
                    </div>
                </div>
            </div>

            <div className="mt-12 sm:mt-20">
                <ProductRecommendations />
            </div>
        </div>
    )
}
