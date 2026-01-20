"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { AnnouncementBar } from "@/components/announcement-bar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, ChevronRight, Lock, ArrowLeft, CreditCard, Banknote } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export default function CheckoutPage() {
    const [cartItems, setCartItems] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [orderComplete, setOrderComplete] = useState<any>(null)
    const [paymentMethod, setPaymentMethod] = useState<"COD" | "Card">("COD")
    const router = useRouter()

    useEffect(() => {
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
            setCartItems(JSON.parse(savedCart))
        } else {
            router.push("/")
        }
    }, [])

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const shipping = 0
    const total = subtotal

    const { register, handleSubmit } = useForm()

    const onSubmit = async (data: any) => {
        setLoading(true)
        try {
            const orderData = {
                customer: data,
                items: cartItems.map(item => ({
                    productId: item.id || item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    size: item.size || item.selectedSize || "N/A",
                    color: item.color || item.selectedColor || "Default",
                    image: item.image || (item.images ? item.images[0] : "")
                })),
                totalAmount: total,
                paymentMethod: paymentMethod
            }

            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData)
            })

            if (res.ok) {
                const order = await res.json()
                setOrderComplete(order)
                localStorage.removeItem("cart")
                window.dispatchEvent(new Event("storage"))
                toast.success("Order placed successfully!")
            } else {
                const errorData = await res.json()
                throw new Error(errorData.error || "Failed to place order")
            }
        } catch (error: any) {
            toast.error(error.message || "Checkout failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (orderComplete) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <div className="p-6 bg-green-50 rounded-full mb-8">
                    <CheckCircle className="w-20 h-20 text-green-500" />
                </div>
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 text-center">Your Order is Secure!</h1>
                <p className="text-muted-foreground mb-8 text-center font-bold">Confirmation sent to {orderComplete.customer.email}</p>
                <div className="bg-foreground text-background px-6 py-3 text-[10px] font-black uppercase tracking-[0.3em] mb-12">
                    Order Ref: #{orderComplete._id.slice(-8).toUpperCase()}
                </div>
                <Link href="/">
                    <Button className="px-12 h-16 rounded-none font-black tracking-widest uppercase shadow-2xl">
                        Back to Shop
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#fcfcfc]">
            <AnnouncementBar />
            <div className="bg-white border-b border-border py-6">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-black tracking-tighter">OUTFITTERS</Link>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-4">
                        <Lock className="w-3 h-3" />
                        Secure Checkout
                    </div>
                </div>
            </div>

            <main className="flex-1 container mx-auto px-4 py-12 lg:py-20">
                <div className="grid lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-7">
                        <div className="flex items-center gap-4 mb-10">
                            <button onClick={() => router.back()} className="p-2 hover:bg-muted rounded-full transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-3xl font-black uppercase tracking-tight">Delivery Details</h1>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">First Name</label>
                                        <input {...register("firstName", { required: true })} className="w-full border-2 border-border focus:border-foreground px-5 py-4 text-sm font-bold focus:outline-none transition-all rounded-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Last Name</label>
                                        <input {...register("lastName", { required: true })} className="w-full border-2 border-border focus:border-foreground px-5 py-4 text-sm font-bold focus:outline-none transition-all rounded-none" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</label>
                                        <input {...register("email", { required: true })} type="email" className="w-full border-2 border-border focus:border-foreground px-5 py-4 text-sm font-bold focus:outline-none transition-all rounded-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone Number</label>
                                        <input {...register("phone", { required: true })} className="w-full border-2 border-border focus:border-foreground px-5 py-4 text-sm font-bold focus:outline-none transition-all rounded-none" placeholder="03XXXXXXXXX" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Shipping Address</label>
                                    <input {...register("address", { required: true })} className="w-full border-2 border-border focus:border-foreground px-5 py-4 text-sm font-bold focus:outline-none transition-all rounded-none" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">City / Region</label>
                                    <input {...register("city", { required: true })} className="w-full border-2 border-border focus:border-foreground px-5 py-4 text-sm font-bold focus:outline-none transition-all rounded-none" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xl font-black uppercase tracking-tight">Payment Method</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div
                                        onClick={() => setPaymentMethod("COD")}
                                        className={`p-6 border-2 cursor-pointer transition-all flex items-center justify-between ${paymentMethod === "COD" ? "border-foreground bg-foreground/[0.02]" : "border-border hover:border-foreground/50"}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "COD" ? "border-foreground" : "border-muted-foreground"}`}>
                                                {paymentMethod === "COD" && <div className="w-2.5 h-2.5 rounded-full bg-foreground" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black uppercase tracking-widest">Cash on Delivery</p>
                                                <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">Pay at your doorstep</p>
                                            </div>
                                        </div>
                                        <Banknote className="w-6 h-6 text-muted-foreground" />
                                    </div>

                                    <div
                                        className="p-6 border-2 border-border opacity-50 cursor-not-allowed flex items-center justify-between bg-muted/20 relative group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-black uppercase tracking-widest">Credit / Debit Card</p>
                                                <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">Visa, Mastercard, etc.</p>
                                            </div>
                                        </div>
                                        <CreditCard className="w-6 h-6 text-muted-foreground" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="bg-foreground text-background text-[9px] font-black px-2 py-1 uppercase tracking-widest">Coming Soon</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-foreground text-background p-8 border-l-8 border-accent mt-12 shadow-xl">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-70">Payment Policy Reminder</p>
                                <h4 className="text-lg font-black uppercase tracking-tight mb-2">Final Amount: PKR {total.toLocaleString()}</h4>
                                <p className="text-[11px] font-medium uppercase leading-relaxed opacity-80">
                                    {paymentMethod === "COD"
                                        ? "You have selected Cash on Delivery. Please have the exact amount ready for our delivery partner. Your items will be shipped within 2-3 business days."
                                        : "Online payment is currently undergoing maintenance. Please select Cash on Delivery to proceed with your order."}
                                </p>
                            </div>

                            <Button disabled={loading} className="w-full h-20 rounded-none font-black tracking-[0.3em] uppercase shadow-2xl text-base mt-12 transition-transform hover:scale-[1.01]">
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Complete Transaction"}
                            </Button>
                        </form>
                    </div>

                    <div className="lg:col-span-5 lg:sticky lg:top-24 h-fit">
                        <div className="bg-white border border-border p-8 shadow-sm">
                            <h2 className="text-xl font-black uppercase tracking-tight mb-8">Summary</h2>
                            <div className="space-y-6 mb-8 border-b border-border pb-8">
                                {cartItems.map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="relative w-16 h-20 bg-muted shrink-0 shadow-sm">
                                            <Image src={item.image || (item.images ? item.images[0] : "")} alt={item.name} fill className="object-cover" />
                                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-foreground text-background text-[10px] font-black flex items-center justify-center rounded-full shadow-lg">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[10px] font-black uppercase tracking-tight truncate">{item.name}</h4>
                                            <p className="text-[9px] text-muted-foreground uppercase font-bold mt-1">Size: {item.size || item.selectedSize} | Color: {item.color || item.selectedColor}</p>
                                            <p className="text-xs font-black mt-1">PKR {item.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>PKR {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    <span>Shipping</span>
                                    <span>FREE</span>
                                </div>
                                <div className="pt-6 border-t border-border flex justify-between items-baseline">
                                    <span className="text-sm font-black uppercase tracking-widest">Grand Total</span>
                                    <span className="text-2xl font-black tracking-tighter">PKR {total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
