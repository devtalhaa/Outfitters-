"use client"

import { useState, useEffect, use } from "react"
import {
    ChevronLeft,
    Loader2,
    ShoppingBag,
    User,
    MapPin,
    CreditCard,
    Package,
    ArrowLeft,
    CheckCircle2,
    AlertTriangle,
    Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface PageProps {
    params: Promise<{ id: string }>
}

export default function OrderPage({ params }: PageProps) {
    const { id } = use(params)
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [globalShipping, setGlobalShipping] = useState<number>(250)
    const router = useRouter()

    const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]

    useEffect(() => {
        fetchOrder()
        fetchSettings()
    }, [id])

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/orders/${id}`)
            if (!res.ok) throw new Error("Order not found")
            const data = await res.json()
            setOrder(data)
        } catch (error) {
            toast.error("Failed to fetch order details")
            router.push("/dashboard")
        } finally {
            setLoading(false)
        }
    }

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/settings")
            const data = await res.json()
            if (data.shippingCost) {
                setGlobalShipping(data.shippingCost)
            }
        } catch (error) {
            console.error("Failed to fetch settings")
        }
    }

    const handleStatusUpdate = async (newStatus: string) => {
        setUpdating(true)
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            })
            if (res.ok) {
                toast.success(`Order status updated to ${newStatus}`)
                fetchOrder()
            } else {
                toast.error("Failed to update status")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-foreground mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Loading Order Record...</p>
            </div>
        )
    }

    if (!order) return null

    return (
        <div className="min-h-screen bg-[#fcfcfc] pb-20">
            {/* Header */}
            <div className="bg-white border-b border-border sticky top-0 z-20">
                <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="p-2 hover:bg-muted rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl font-black uppercase tracking-tight">Order #{order._id.slice(-8)}</h1>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 border-2 ${order.status === "Delivered" ? "bg-green-50 border-green-500 text-green-700" :
                                    order.status === "Cancelled" ? "bg-red-50 border-red-500 text-red-700" :
                                        "bg-yellow-50 border-yellow-500 text-yellow-700"
                                    }`}>
                                    {order.status}
                                </span>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">
                                Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'full' })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-[1600px] mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Left Column: Summary & Status */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Status Update Card */}
                        <div className="bg-white border-4 border-foreground p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-foreground text-background">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-black uppercase tracking-tight">Management Actions</h2>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6">Transition order lifecycle state:</p>
                            <div className="flex flex-wrap gap-3">
                                {statuses.map(status => (
                                    <button
                                        key={status}
                                        disabled={updating || order.status === status}
                                        onClick={() => handleStatusUpdate(status)}
                                        className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all border-2 ${order.status === status
                                            ? "bg-foreground text-background border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                            : "bg-white text-foreground border-border hover:border-foreground disabled:opacity-30"
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Items Card */}
                        <div className="bg-white border border-border overflow-hidden">
                            <div className="p-8 border-b border-border bg-muted/20">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                                    <Package className="w-5 h-5" />
                                    Order Items ({order.items.length})
                                </h3>
                            </div>
                            <div className="divide-y divide-border">
                                {order.items.map((item: any, idx: number) => (
                                    <div key={idx} className="p-8 flex gap-8 items-center group hover:bg-muted/5 transition-colors">
                                        <div className="relative w-24 h-32 bg-muted overflow-hidden border border-border">
                                            <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="text-lg font-black uppercase tracking-tight group-hover:underline">{item.name}</h4>
                                                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-2">
                                                        Article Code: {item.articleCode || "N/A"}
                                                    </p>
                                                </div>
                                                <p className="text-xl font-black">PKR {item.price.toLocaleString()}</p>
                                            </div>
                                            <div className="mt-6 flex gap-6">
                                                <div className="bg-muted px-4 py-2">
                                                    <span className="text-[9px] font-black uppercase text-muted-foreground block">Size</span>
                                                    <span className="text-sm font-black">{item.size}</span>
                                                </div>
                                                <div className="bg-muted px-4 py-2">
                                                    <span className="text-[9px] font-black uppercase text-muted-foreground block">Quantity</span>
                                                    <span className="text-sm font-black">{item.quantity}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Customer & Payment */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Customer Info */}
                        <div className="bg-white border border-border p-8 space-y-8">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                                    <User className="w-4 h-4" /> Customer Details
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase">Full Name</p>
                                        <p className="text-lg font-black uppercase tracking-tight">{order.customer.firstName} {order.customer.lastName}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase">Email Address</p>
                                        <p className="text-sm font-black">{order.customer.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase">Phone Number</p>
                                        <p className="text-sm font-black">{order.customer.phone}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-border">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Shipping Destination
                                </h4>
                                <div className="space-y-2">
                                    <p className="text-sm font-bold leading-relaxed">{order.customer.address}</p>
                                    <div className="inline-block bg-foreground text-background px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                                        {order.customer.city}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-border">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" /> Payment Info
                                </h4>
                                <div className="flex justify-between items-center bg-muted/30 p-4 border border-border">
                                    <span className="text-xs font-black uppercase tracking-widest">Method</span>
                                    <span className="text-sm font-black uppercase tracking-[0.2em]">{order.paymentMethod}</span>
                                </div>
                            </div>
                        </div>

                        {/* Financial Summary */}
                        <div className="bg-foreground text-background p-8 shadow-2xl">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-8">Financial Breakdown</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm opacity-80">
                                    <span>Product Subtotal</span>
                                    <span className="font-bold whitespace-nowrap">PKR {(order.totalAmount - globalShipping).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm opacity-80">
                                    <span>Shipping Cost</span>
                                    <span className="font-bold">PKR {globalShipping.toLocaleString()}</span>
                                </div>
                                <div className="pt-6 mt-6 border-t border-white/20 flex justify-between items-end">
                                    <span className="text-xs font-black uppercase tracking-[0.2em]">Total Amount</span>
                                    <span className="text-3xl font-black tracking-tighter">PKR {order.totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Final Verification Badge */}
                        <div className="border-2 border-dashed border-border p-6 flex items-center gap-4 opacity-50">
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                            <p className="text-[9px] font-black uppercase tracking-widest leading-loose">
                                System verified transaction • Secured by Outfitters Backend
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
