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
            <div className="container mx-auto px-4 py-32 text-center">
                <div className="flex justify-center mb-8 opacity-20">
                    <ShoppingBag className="w-24 h-24 text-foreground" />
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tight mb-4">Your bag is empty</h1>
                <p className="text-muted-foreground mb-12 max-w-md mx-auto font-medium">
                    Look like you haven&apos;t added anything to your bag yet.
                    Start exploring our premium collection and find your perfect pair.
                </p>
                <Link href="/">
                    <Button className="px-12 h-16 rounded-none font-black tracking-widest uppercase shadow-xl">
                        Explore Collection
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-12 text-muted-foreground">
                <Link href="/" className="hover:text-foreground transition-all">Home</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-foreground">Shopping Bag ({cartItems.length})</span>
            </nav>

            <div className="grid lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8">
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-12">SHOPPING BAG</h1>
                    <div className="space-y-10">
                        {cartItems.map((item, idx) => (
                            <div key={`${item.id || item._id}-${item.size}-${idx}`} className="flex gap-6 lg:gap-8 pb-10 border-b border-border last:border-0 group">
                                <Link href={`/product/${item.slug || ""}`} className="relative w-28 h-36 lg:w-40 lg:h-52 bg-muted shrink-0 overflow-hidden shadow-sm">
                                    <Image
                                        src={item.image || (item.images ? item.images[0] : "")}
                                        alt={item.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </Link>
                                <div className="flex-1 flex flex-col pt-2">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-base lg:text-lg font-black uppercase tracking-tight group-hover:underline decoration-2">
                                                {item.name}
                                            </h3>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">
                                                Ref: {item.articleCode || "OUTF-001"}
                                            </p>
                                        </div>
                                        <p className="text-lg font-black">PKR {(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                    <div className="flex gap-8 mb-6">
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Color</p>
                                            <p className="text-xs font-bold uppercase">{item.color || item.selectedColor || "Default"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Size (EU)</p>
                                            <p className="text-xs font-black uppercase">{item.size || item.selectedSize}</p>
                                        </div>
                                    </div>
                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex items-center border-2 border-foreground bg-white overflow-hidden shadow-sm">
                                            <button onClick={() => updateQuantity(item.id || item._id, item.size || item.selectedSize, -1)} className="p-2.5 hover:bg-muted font-bold text-lg leading-none" disabled={item.quantity <= 1}>
                                                −
                                            </button>
                                            <span className="w-10 text-center text-sm font-black">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id || item._id, item.size || item.selectedSize, 1)} className="p-2.5 hover:bg-muted font-bold text-lg leading-none">
                                                +
                                            </button>
                                        </div>
                                        <button onClick={() => removeItem(item.id || item._id, item.size || item.selectedSize)} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-red-500 flex items-center gap-2 group/remove transition-colors">
                                            <Trash2 className="w-4 h-4 transition-transform group-hover/remove:-rotate-12" />
                                            <span className="underline underline-offset-4">Remove Item</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
                    <div className="bg-foreground text-background p-10 shadow-2xl">
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-8 border-b border-background/20 pb-4">Order Summary</h2>
                        <div className="space-y-6 mb-10">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-70">
                                <span>Cart Subtotal</span>
                                <span>PKR {subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-70">
                                <span>Flat Shipping</span>
                                <span>FREE</span>
                            </div>
                            <div className="pt-6 border-t border-background/20 flex justify-between items-baseline">
                                <span className="text-base font-black uppercase tracking-widest">Total</span>
                                <span className="text-2xl font-black">PKR {total.toLocaleString()}</span>
                            </div>
                        </div>

                        <Button onClick={() => router.push("/checkout")} className="w-full h-16 bg-background text-foreground rounded-none font-black tracking-[0.25em] uppercase transition-transform hover:scale-[1.02] shadow-xl group">
                            Secure Checkout
                            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </Button>
                        <p className="text-[9px] text-center mt-6 font-bold uppercase tracking-widest opacity-50">Proceed to select payment method</p>
                    </div>
                </div>
            </div>

            <div className="mt-20">
                <ProductRecommendations />
            </div>
        </div>
    )
}
