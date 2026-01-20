"use client"

import { useState, useEffect } from "react"
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Plus,
    Search,
    Edit,
    Trash2,
    Image as ImageIcon,
    X,
    Loader2,
    LogOut,
    ExternalLink,
    Settings,
    Eye,
    ChevronRight,
    Lock,
    Mail,
    Hash,
    MoveVertical
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"

const FALLBACK_CATEGORIES = ["Sneakers", "Loafers", "Sandals", "Slides", "Sports Shoes", "Formal"]

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<"products" | "orders"
        | "newsletter"
        | "slider"
        | "categories"
        | "settings"
    >("products")
    const [isAddingProduct, setIsAddingProduct] = useState(false)
    const [editingProduct, setEditingProduct] = useState<any>(null)
    const [products, setProducts] = useState<any[]>([])
    const [dynamicCategories, setDynamicCategories] = useState<any[]>([])
    const [orders, setOrders] = useState<any[]>([])
    const [subscribers, setSubscribers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [limit, setLimit] = useState(12)
    const [pagination, setPagination] = useState<any>(null)
    const [orderCurrentPage, setOrderCurrentPage] = useState(1)
    const [orderLimit, setOrderLimit] = useState(10)
    const [orderPagination, setOrderPagination] = useState<any>(null)
    const [newsCurrentPage, setNewsCurrentPage] = useState(1)
    const [newsLimit, setNewsLimit] = useState(10)
    const [newsPagination, setNewsPagination] = useState<any>(null)
    const [authLoading, setAuthLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        checkAuth()
        fetchDynamicCategories()
    }, [])

    const checkAuth = async () => {
        try {
            console.log("Dashboard: Checking authentication status...");
            const res = await fetch("/api/admin/check")
            console.log("Dashboard: Auth check status:", res.status);
            if (!res.ok) {
                console.warn("Dashboard: Not authenticated, redirecting to /login");
                router.push("/login")
            } else {
                console.log("Dashboard: Authenticated, fetching data...");
                setAuthLoading(false)
                fetchData(1)
            }
        } catch (error) {
            console.error("Dashboard: Auth check failed:", error);
            router.push("/login")
        }
    }

    const fetchDynamicCategories = async () => {
        try {
            const res = await fetch("/api/admin/categories")
            const data = await res.json()
            setDynamicCategories(data)
        } catch (error) {
            console.error("Failed to fetch categories")
        }
    }

    const fetchData = async (
        page = currentPage,
        currentLimit = limit,
        oPage = orderCurrentPage,
        oLimit = orderLimit,
        nPage = newsCurrentPage,
        nLimit = newsLimit
    ) => {
        setLoading(true)
        try {
            const [prodRes, orderRes, newsRes] = await Promise.all([
                fetch(`/api/products?page=${page}&limit=${currentLimit}`),
                fetch(`/api/orders?page=${oPage}&limit=${oLimit}`),
                fetch(`/api/newsletter?page=${nPage}&limit=${nLimit}`)
            ])
            const prodData = await prodRes.json()
            const orderData = await orderRes.json()
            const newsData = await newsRes.json()

            if (prodData.products) {
                setProducts(prodData.products)
                setPagination(prodData.pagination)
            } else {
                setProducts(Array.isArray(prodData) ? prodData : [])
            }

            if (orderData.orders) {
                setOrders(orderData.orders)
                setOrderPagination(orderData.pagination)
            } else {
                setOrders(Array.isArray(orderData) ? orderData : [])
            }

            if (newsData.subscribers) {
                setSubscribers(newsData.subscribers)
                setNewsPagination(newsData.pagination)
            } else {
                setSubscribers(Array.isArray(newsData) ? newsData : [])
                setNewsPagination(null)
            }
        } catch (error) {
            toast.error("Failed to fetch dashboard data")
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            await fetch("/api/admin/logout", { method: "POST" })
            router.push("/login")
            toast.success("Logged out successfully")
        } catch (error) {
            toast.error("Logout failed")
        }
    }

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return
        try {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success("Product deleted")
                fetchData()
            }
        } catch (error) {
            toast.error("Failed to delete product")
        }
    }

    const handleDeleteSubscriber = async (id: string) => {
        if (!confirm("Are you sure you want to remove this subscriber?")) return
        try {
            await fetch(`/api/newsletter?id=${id}`, { method: "DELETE" })
            toast.success("Subscriber removed")
            fetchData()
        } catch (error) {
            toast.error("Failed to remove subscriber")
        }
    }

    if (authLoading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-foreground mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Authenticating...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f8f8f8] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-border hidden lg:flex flex-col sticky top-0 h-screen">
                <div className="p-8 border-b border-border">
                    <h1 className="text-xl font-black tracking-tighter uppercase">Admin Panel</h1>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Lironda Admin</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab("products")}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "products" ? "bg-foreground text-background" : "hover:bg-muted"
                            }`}
                    >
                        <Package className="w-4 h-4" />
                        Products
                    </button>
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "orders" ? "bg-foreground text-background" : "hover:bg-muted"
                            }`}
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Orders
                    </button>
                    <button
                        onClick={() => setActiveTab("categories")}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "categories" ? "bg-foreground text-background" : "hover:bg-muted"}`}
                    >
                        <Hash className="w-4 h-4" />
                        Categories
                    </button>
                    <button
                        onClick={() => setActiveTab("newsletter")}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "newsletter" ? "bg-foreground text-background" : "hover:bg-muted"
                            }`}
                    >
                        <Mail className="w-4 h-4" />
                        Newsletter
                    </button>
                    <button
                        onClick={() => setActiveTab("slider")}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "slider" ? "bg-foreground text-background" : "hover:bg-muted"
                            }`}
                    >
                        <ImageIcon className="w-4 h-4" />
                        Slider
                    </button>
                    <button
                        onClick={() => setActiveTab("settings")}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "settings" ? "bg-foreground text-background" : "hover:bg-muted"
                            }`}
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </button>
                </nav>

                <div className="p-4 border-t border-border space-y-2">
                    <Link
                        href="/"
                        target="_blank"
                        className="w-full flex items-center gap-3 px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-muted transition-all"
                    >
                        <ExternalLink className="w-3 h-3" />
                        View Website
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all"
                    >
                        <LogOut className="w-3 h-3" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
                <div className="max-w-[1600px] mx-auto">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tight">
                                {activeTab === "products" ? "Inventory" : activeTab === "orders" ? "Orders" : activeTab === "newsletter" ? "Newsletter Subscribers" : activeTab === "slider" ? "Slider Management" : activeTab === "categories" ? "Collection Categories" : "Security Settings"}
                            </h2>
                            <div className="flex items-center gap-6 mt-1">
                                <p className="text-sm text-muted-foreground">
                                    {activeTab === "products"
                                        ? `Showing ${pagination?.total || products.length} products available for sale`
                                        : activeTab === "orders"
                                            ? `Managing ${orders.length} customer purchases`
                                            : activeTab === "newsletter"
                                                ? `Managing ${subscribers.length} total subscribers`
                                                : activeTab === "slider"
                                                    ? "Manage homepage background slider images"
                                                    : activeTab === "categories"
                                                        ? "Manage product categories for your store"
                                                        : "Manage administrative credentials and security"}
                                </p>
                                {activeTab === "products" && (
                                    <div className="flex items-center gap-2 border-l border-border pl-6">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">{dynamicCategories.length || FALLBACK_CATEGORIES.length} Categories Available</p>
                                    </div>
                                )}
                                {activeTab === "products" && (
                                    <div className="flex items-center gap-2 border-l border-border pl-6">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Per Page:</span>
                                        <select
                                            value={limit}
                                            onChange={(e) => {
                                                const newLimit = parseInt(e.target.value)
                                                setLimit(newLimit)
                                                setCurrentPage(1)
                                                fetchData(1, newLimit, orderCurrentPage, orderLimit)
                                            }}
                                            className="bg-transparent text-[10px] font-black uppercase tracking-widest focus:outline-none cursor-pointer border-b border-foreground/20 hover:border-foreground"
                                        >
                                            <option value="12">12</option>
                                            <option value="24">24</option>
                                            <option value="48">48</option>
                                            <option value="96">96</option>
                                        </select>
                                    </div>
                                )}
                                {activeTab === "orders" && (
                                    <div className="flex items-center gap-2 border-l border-border pl-6">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Per Page:</span>
                                        <select
                                            value={orderLimit}
                                            onChange={(e) => {
                                                const newLimit = parseInt(e.target.value)
                                                setOrderLimit(newLimit)
                                                setOrderCurrentPage(1)
                                                fetchData(currentPage, limit, 1, newLimit)
                                            }}
                                            className="bg-transparent text-[10px] font-black uppercase tracking-widest focus:outline-none cursor-pointer border-b border-foreground/20 hover:border-foreground"
                                        >
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                        </select>
                                    </div>
                                )}
                                {activeTab === "newsletter" && (
                                    <div className="flex items-center gap-2 border-l border-border pl-6">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Per Page:</span>
                                        <select
                                            value={newsLimit}
                                            onChange={(e) => {
                                                const newLimit = parseInt(e.target.value)
                                                setNewsLimit(newLimit)
                                                setNewsCurrentPage(1)
                                                fetchData(currentPage, limit, orderCurrentPage, orderLimit, 1, newLimit)
                                            }}
                                            className="bg-transparent text-[10px] font-black uppercase tracking-widest focus:outline-none cursor-pointer border-b border-foreground/20 hover:border-foreground"
                                        >
                                            <option value="10">10</option>
                                            <option value="25">25</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                        {activeTab === "products" && (
                            <Button
                                onClick={() => setIsAddingProduct(true)}
                                className="rounded-none h-12 px-8 font-black tracking-widest uppercase shadow-lg"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Product
                            </Button>
                        )}
                    </div>

                    {loading && activeTab !== "settings" && activeTab !== "categories" ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white border border-border dashed">
                            <Loader2 className="w-10 h-10 animate-spin text-muted-foreground mb-4" />
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Loading dashboard data...</p>
                        </div>
                    ) : activeTab === "products" ? (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <div key={product._id} className="bg-white border border-border group relative overflow-hidden">
                                        <div className="aspect-[4/5] relative bg-muted">
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/dashboard/products/${product._id}`}
                                                    className="p-2 bg-white shadow-xl hover:bg-muted"
                                                    title="Detailed View & Stock Management"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setEditingProduct(product)
                                                        setIsAddingProduct(true)
                                                    }}
                                                    className="p-2 bg-white shadow-xl hover:bg-muted"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                    className="p-2 bg-white shadow-xl text-red-500 hover:bg-muted"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-xs font-bold uppercase tracking-tight">{product.name}</h4>
                                                <span className="text-xs font-black">PKR {product.price.toLocaleString()}</span>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                                                {product.category} • {product.articleCode}
                                            </p>
                                            <div className="mt-3 pt-3 border-t border-muted flex gap-2">
                                                {product.sizes?.map((s: any) => (
                                                    <span key={s.value} className={`text-[9px] font-bold px-1.5 py-0.5 border ${s.stock === 0 ? "opacity-30 line-through" : "bg-muted"}`}>
                                                        {s.value}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {pagination && (
                                <div className="flex flex-col items-center gap-6 pt-12 border-t border-border mt-8">
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="outline"
                                            disabled={currentPage === 1}
                                            onClick={() => {
                                                const newPage = currentPage - 1
                                                setCurrentPage(newPage)
                                                fetchData(newPage)
                                            }}
                                            className="rounded-none h-14 px-8 text-xs font-black uppercase tracking-widest border-2 border-foreground hover:bg-foreground hover:text-background disabled:opacity-20 transition-all active:scale-95"
                                        >
                                            Previous Page
                                        </Button>
                                        <div className="flex items-center gap-2">
                                            {[...Array(pagination.pages)].map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        const newPage = i + 1
                                                        setCurrentPage(newPage)
                                                        fetchData(newPage)
                                                    }}
                                                    className={`w-14 h-14 text-xs font-black border-2 transition-all active:scale-90 ${currentPage === i + 1 ? "bg-foreground text-background border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-border hover:border-foreground"}`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>
                                        <Button
                                            variant="outline"
                                            disabled={currentPage === pagination.pages}
                                            onClick={() => {
                                                const newPage = currentPage + 1
                                                setCurrentPage(newPage)
                                                fetchData(newPage)
                                            }}
                                            className="rounded-none h-14 px-8 text-xs font-black uppercase tracking-widest border-2 border-foreground hover:bg-foreground hover:text-background disabled:opacity-20 transition-all active:scale-95"
                                        >
                                            Next Page
                                        </Button>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                                        Page {currentPage} of {pagination.pages} • Total {pagination.total} Products
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : activeTab === "orders" ? (
                        <div className="space-y-8">
                            <div className="bg-white border border-border overflow-hidden shadow-xl">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-border bg-muted/30">
                                            <th className="p-8 text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground">Order ID</th>
                                            <th className="p-8 text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground">Customer</th>
                                            <th className="p-8 text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground">Total</th>
                                            <th className="p-8 text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground text-center">Status</th>
                                            <th className="p-8 text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground text-right">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/60">
                                        {orders.map((order) => (
                                            <tr
                                                key={order._id}
                                                onClick={() => router.push(`/dashboard/orders/${order._id}`)}
                                                className="hover:bg-muted/10 cursor-pointer transition-all group border-l-0 hover:border-l-8 border-foreground active:bg-muted/20"
                                            >
                                                <td className="p-8 font-mono text-[12px] uppercase font-black text-muted-foreground group-hover:text-foreground">#{order._id.slice(-8)}</td>
                                                <td className="p-8">
                                                    <p className="text-sm font-black uppercase tracking-tight">{order.customer.firstName} {order.customer.lastName}</p>
                                                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{order.customer.city}</p>
                                                </td>
                                                <td className="p-8">
                                                    <span className="text-base font-black tracking-tighter group-hover:scale-110 transition-transform inline-block">PKR {order.totalAmount.toLocaleString()}</span>
                                                </td>
                                                <td className="p-8 text-center">
                                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 border-2 ${order.status === "Delivered" ? "bg-green-50 border-green-500 text-green-700" :
                                                        order.status === "Cancelled" ? "bg-red-50 border-red-500 text-red-700" :
                                                            order.status === "Shipped" ? "bg-blue-50 border-blue-500 text-blue-700" :
                                                                "bg-yellow-50 border-yellow-500 text-yellow-700"
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="p-8 text-[11px] font-black text-muted-foreground uppercase text-right group-hover:text-foreground">
                                                    {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {orders.length === 0 && (
                                    <div className="py-32 flex flex-col items-center justify-center">
                                        <ShoppingBag className="w-16 h-16 text-muted-foreground opacity-20 mb-6" />
                                        <p className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground">No orders found in database</p>
                                    </div>
                                )}
                            </div>

                            {orderPagination && (
                                <div className="flex flex-col items-center gap-6 pt-12 border-t border-border mt-8">
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="outline"
                                            disabled={orderCurrentPage === 1}
                                            onClick={() => {
                                                const newPage = orderCurrentPage - 1
                                                setOrderCurrentPage(newPage)
                                                fetchData(currentPage, limit, newPage, orderLimit)
                                            }}
                                            className="rounded-none h-14 px-8 text-xs font-black uppercase tracking-widest border-2 border-foreground hover:bg-foreground hover:text-background disabled:opacity-20 transition-all active:scale-95"
                                        >
                                            Previous Page
                                        </Button>
                                        <div className="flex items-center gap-2">
                                            {[...Array(orderPagination.pages)].map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        const newPage = i + 1
                                                        setOrderCurrentPage(newPage)
                                                        fetchData(currentPage, limit, newPage, orderLimit)
                                                    }}
                                                    className={`w-14 h-14 text-xs font-black border-2 transition-all active:scale-90 ${orderCurrentPage === i + 1 ? "bg-foreground text-background border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-border hover:border-foreground"}`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>
                                        <Button
                                            variant="outline"
                                            disabled={orderCurrentPage === orderPagination.pages}
                                            onClick={() => {
                                                const newPage = orderCurrentPage + 1
                                                setOrderCurrentPage(newPage)
                                                fetchData(currentPage, limit, newPage, orderLimit)
                                            }}
                                            className="rounded-none h-14 px-8 text-xs font-black uppercase tracking-widest border-2 border-foreground hover:bg-foreground hover:text-background disabled:opacity-20 transition-all active:scale-95"
                                        >
                                            Next Page
                                        </Button>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                                        Page {orderCurrentPage} of {orderPagination.pages} • Total {orderPagination.total} Orders
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : activeTab === "newsletter" ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white border border-border">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-border bg-muted/30">
                                                <th className="p-8 text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground">Email Address</th>
                                                <th className="p-8 text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground">Subscribed On</th>
                                                <th className="p-8 text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/60">
                                            {subscribers.length === 0 ? (
                                                <tr>
                                                    <td colSpan={3} className="p-16 text-center text-muted-foreground">
                                                        <Mail className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                                        <p className="text-xs font-black uppercase tracking-widest">No subscribers found</p>
                                                    </td>
                                                </tr>
                                            ) : (
                                                subscribers.map((sub: any) => (
                                                    <tr key={sub._id} className="hover:bg-muted/10 transition-all group">
                                                        <td className="p-8 font-black uppercase tracking-tight">{sub.email}</td>
                                                        <td className="p-8 text-[11px] font-black text-muted-foreground uppercase">
                                                            {new Date(sub.createdAt).toLocaleDateString("en-US", {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </td>
                                                        <td className="p-8 text-right">
                                                            <button
                                                                onClick={() => handleDeleteSubscriber(sub._id)}
                                                                className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {newsPagination && (
                                <div className="flex flex-col items-center gap-6 pt-12 border-t border-border mt-8">
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="outline"
                                            disabled={newsCurrentPage === 1}
                                            onClick={() => {
                                                const newPage = newsCurrentPage - 1
                                                setNewsCurrentPage(newPage)
                                                fetchData(currentPage, limit, orderCurrentPage, orderLimit, newPage, newsLimit)
                                            }}
                                            className="rounded-none h-14 px-8 text-xs font-black uppercase tracking-widest border-2 border-foreground hover:bg-foreground hover:text-background disabled:opacity-20 transition-all active:scale-95"
                                        >
                                            Previous Page
                                        </Button>
                                        <div className="flex items-center gap-2">
                                            {[...Array(newsPagination.pages)].map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        const newPage = i + 1
                                                        setNewsCurrentPage(newPage)
                                                        fetchData(currentPage, limit, orderCurrentPage, orderLimit, newPage, newsLimit)
                                                    }}
                                                    className={`w-14 h-14 text-xs font-black border-2 transition-all active:scale-90 ${newsCurrentPage === i + 1 ? "bg-foreground text-background border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-border hover:border-foreground"}`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>
                                        <Button
                                            variant="outline"
                                            disabled={newsCurrentPage === newsPagination.pages}
                                            onClick={() => {
                                                const newPage = newsCurrentPage + 1
                                                setNewsCurrentPage(newPage)
                                                fetchData(currentPage, limit, orderCurrentPage, orderLimit, newPage, newsLimit)
                                            }}
                                            className="rounded-none h-14 px-8 text-xs font-black uppercase tracking-widest border-2 border-foreground hover:bg-foreground hover:text-background disabled:opacity-20 transition-all active:scale-95"
                                        >
                                            Next Page
                                        </Button>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                                        Page {newsCurrentPage} of {newsPagination.pages} • Total {newsPagination.total} Subscribers
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : activeTab === "slider" ? (
                        <SliderManager />
                    ) : activeTab === "categories" ? (
                        <CategoryManager />
                    ) : (
                        <AdminSettings />
                    )}
                </div>
            </main>

            {/* Product Modal */}
            {isAddingProduct && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => {
                        setIsAddingProduct(false)
                        setEditingProduct(null)
                    }} />
                    <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-none shadow-2xl flex flex-col">
                        <div className="p-6 border-b border-border sticky top-0 bg-white z-10 flex justify-between items-center">
                            <h3 className="text-xl font-black uppercase tracking-tight">
                                {editingProduct ? "Edit Product" : "New Product"}
                            </h3>
                            <button onClick={() => {
                                setIsAddingProduct(false)
                                setEditingProduct(null)
                            }}>
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>
                        <div className="p-8">
                            <ProductForm
                                initialData={editingProduct}
                                onSuccess={() => {
                                    setIsAddingProduct(false)
                                    setEditingProduct(null)
                                    fetchData()
                                }}
                                dynamicCategories={dynamicCategories}
                            />
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

function AdminSettings() {
    const [loading, setLoading] = useState(false)
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" })

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (passwords.new !== passwords.confirm) return toast.error("Passwords do not match")
        setLoading(true)
        try {
            const res = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: passwords.current,
                    newPassword: passwords.new
                })
            })
            if (res.ok) {
                toast.success("Security credentials updated")
                setPasswords({ current: "", new: "", confirm: "" })
            } else {
                const data = await res.json()
                toast.error(data.error || "Update failed")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-xl">
            <div className="bg-white border border-border p-10 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-foreground text-background">
                        <Lock className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight">Security</h3>
                </div>
                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Password</label>
                        <input
                            type="password"
                            required
                            className="w-full border-b border-border py-2 focus:outline-none focus:border-foreground"
                            value={passwords.current}
                            onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">New Password</label>
                        <input
                            type="password"
                            required
                            className="w-full border-b border-border py-2 focus:outline-none focus:border-foreground"
                            value={passwords.new}
                            onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Confirm New Password</label>
                        <input
                            type="password"
                            required
                            className="w-full border-b border-border py-2 focus:outline-none focus:border-foreground"
                            value={passwords.confirm}
                            onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                        />
                    </div>
                    <Button disabled={loading} className="w-full rounded-none h-14 font-black tracking-widest uppercase mt-4">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Security"}
                    </Button>
                </form>
            </div>
        </div>
    )
}

function ProductForm({ initialData, onSuccess, dynamicCategories = [] }: { initialData?: any, onSuccess: () => void, dynamicCategories?: any[] }) {
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState<File[]>([])
    const [previewUrls, setPreviewUrls] = useState<string[]>(initialData?.images || [])
    const [sizeChartFile, setSizeChartFile] = useState<File | null>(null)
    const [sizeChartPreview, setSizeChartPreview] = useState<string | null>(initialData?.sizeChart || null)
    const [sizes, setSizes] = useState<any[]>(initialData?.sizes || [
        { value: "39", stock: 10 },
        { value: "40", stock: 10 },
        { value: "41", stock: 10 },
        { value: "42", stock: 10 },
        { value: "43", stock: 10 },
        { value: "44", stock: 10 },
        { value: "45", stock: 10 }
    ])
    const [colors, setColors] = useState<any[]>(initialData?.colors || [
        { name: "Black", value: "#000000" }
    ])

    const { register, handleSubmit } = useForm({
        defaultValues: initialData || {
            name: "",
            price: "",
            originalPrice: "",
            description: "",
            category: "Sneakers",
            articleCode: ""
        }
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArr = Array.from(e.target.files)
            setImages(prev => [...prev, ...filesArr])
            const urls = filesArr.map(file => URL.createObjectURL(file))
            setPreviewUrls(prev => [...prev, ...urls])
        }
    }

    const handleSizeChartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSizeChartFile(file)
            setSizeChartPreview(URL.createObjectURL(file))
        }
    }

    const removeImage = (index: number) => {
        setPreviewUrls(prev => prev.filter((_, i) => i !== index))
    }

    const addSize = () => {
        const newSizeLabel = prompt("Enter specific size label (e.g. 20, 42, Medium):")
        if (newSizeLabel) {
            setSizes([...sizes, { value: newSizeLabel, stock: 10 }])
        }
    }

    const updateSize = (index: number, field: string, value: any) => {
        const newSizes = [...sizes]
        newSizes[index][field] = value
        setSizes(newSizes)
    }

    const removeSize = (index: number) => {
        setSizes(sizes.filter((_, i) => i !== index))
    }

    const addColor = () => {
        setColors([...colors, { name: "New Color", value: "#000000" }])
    }

    const updateColor = (index: number, field: string, value: any) => {
        const newColors = [...colors]
        newColors[index][field] = value
        setColors(newColors)
    }

    const removeColor = (index: number) => {
        if (colors.length > 1) {
            setColors(colors.filter((_, i) => i !== index))
        } else {
            toast.error("At least one color is required")
        }
    }

    const onSubmit = async (data: any) => {
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("name", data.name)
            formData.append("price", data.price)
            formData.append("originalPrice", data.originalPrice)
            formData.append("description", data.description)
            formData.append("category", data.category)
            formData.append("articleCode", data.articleCode)
            formData.append("colors", JSON.stringify(colors))
            formData.append("colors", JSON.stringify(colors))
            formData.append("sizes", JSON.stringify(sizes))
            if (sizeChartFile) formData.append("sizeChart", sizeChartFile)

            if (initialData) {
                const existingRemaining = previewUrls.filter(url => !url.startsWith("blob:"))
                formData.append("existingImages", JSON.stringify(existingRemaining))
                images.forEach(image => formData.append("newImages", image))

                const res = await fetch(`/api/products/${initialData._id}`, {
                    method: "PUT",
                    body: formData
                })
                if (!res.ok) throw new Error("Update failed")
                toast.success("Product updated")
            } else {
                images.forEach(image => formData.append("images", image))
                const res = await fetch("/api/products", {
                    method: "POST",
                    body: formData
                })
                if (!res.ok) throw new Error("Creation failed")
                toast.success("Product created")
            }
            onSuccess()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest">Product Name</label>
                    <input
                        {...register("name", { required: true })}
                        className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground"
                        placeholder="e.g. Chunky Mesh Sneakers"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest">Category</label>
                    <select
                        {...register("category", { required: true })}
                        className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground bg-white"
                    >
                        {(dynamicCategories.length > 0 ? dynamicCategories.map(c => c.name) : FALLBACK_CATEGORIES).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest">Price (PKR)</label>
                    <input
                        type="number"
                        {...register("price", { required: true })}
                        className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest">Original Price</label>
                    <input
                        type="number"
                        {...register("originalPrice")}
                        className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest">Article Code</label>
                    <input
                        {...register("articleCode", { required: true })}
                        className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground"
                    />
                </div>
            </div>

            <div className="space-y-2 text-xs">
                <label className="text-[10px] font-black uppercase tracking-widest block mb-4">Size & Stock Management</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {sizes.map((s, idx) => (
                        <div key={idx} className="flex flex-col gap-1 border border-border p-2 bg-muted/20 relative group">
                            <div className="flex justify-between items-center px-1">
                                <span className="text-[9px] font-black uppercase text-muted-foreground">Size</span>
                                <button type="button" onClick={() => removeSize(idx)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                            <input
                                value={s.value}
                                onChange={e => updateSize(idx, "value", e.target.value)}
                                className="bg-transparent border-none text-center font-black text-sm focus:ring-0 w-full"
                            />
                            <span className="text-[9px] font-black uppercase text-muted-foreground text-center">Stock</span>
                            <input
                                type="number"
                                value={s.stock}
                                onChange={e => updateSize(idx, "stock", parseInt(e.target.value))}
                                className="bg-transparent border-none text-center font-bold text-xs focus:ring-0 w-full"
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addSize}
                        className="border-2 border-dashed border-border flex flex-col items-center justify-center p-4 hover:border-foreground transition-all gap-1"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-[8px] font-black uppercase">Add Size</span>
                    </button>
                </div>
            </div>

            <div className="space-y-2 text-xs">
                <label className="text-[10px] font-black uppercase tracking-widest block mb-4">Color Management</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {colors.map((c, idx) => (
                        <div key={idx} className="flex items-center gap-3 border border-border p-3 bg-muted/10 relative group">
                            <div className="w-12 h-12 border-2 border-border relative shrink-0 overflow-hidden group/swatch">
                                <input
                                    type="color"
                                    value={c.value}
                                    onChange={e => updateColor(idx, "value", e.target.value)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    title="Choose color"
                                />
                                <div className="w-full h-full transition-transform group-hover/swatch:scale-110" style={{ backgroundColor: c.value }} />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/swatch:opacity-100 bg-black/20 pointer-events-none">
                                    <Edit className="w-3 h-3 text-white" />
                                </div>
                            </div>
                            <div className="flex-1 space-y-1">
                                <input
                                    value={c.name}
                                    onChange={e => updateColor(idx, "name", e.target.value)}
                                    placeholder="Color Name (e.g. Navy Blue)"
                                    className="w-full bg-transparent border-none font-bold text-xs focus:ring-0 p-0"
                                />
                                <p className="text-[9px] font-black uppercase text-muted-foreground">{c.value}</p>
                            </div>
                            <button type="button" onClick={() => removeColor(idx)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addColor}
                        className="border-2 border-dashed border-border flex items-center justify-center p-3 hover:border-foreground transition-all gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase">Add Color Variant</span>
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest block">Size Chart</label>
                <div className="flex items-start gap-4">
                    {sizeChartPreview ? (
                        <div className="relative w-32 h-32 border border-border bg-muted">
                            <Image src={sizeChartPreview} alt="Size Chart" fill className="object-cover" />
                            <button
                                type="button"
                                onClick={() => {
                                    setSizeChartFile(null)
                                    setSizeChartPreview(null)
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ) : (
                        <label className="w-32 h-32 border-2 border-dashed border-muted flex flex-col items-center justify-center cursor-pointer hover:border-foreground transition-colors bg-muted/5">
                            <Plus className="w-6 h-6 text-muted-foreground mb-2" />
                            <span className="text-[9px] font-black uppercase text-muted-foreground">Upload Image</span>
                            <input type="file" className="hidden" onChange={handleSizeChartChange} accept="image/*" />
                        </label>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest">Description</label>
                <textarea
                    {...register("description", { required: true })}
                    rows={4}
                    className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground resize-none"
                />
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest block">Product Images</label>
                <div className="flex flex-wrap gap-4">
                    {previewUrls.map((url, i) => (
                        <div key={i} className="relative w-24 h-32 border border-border bg-muted">
                            <Image src={url} alt="Preview" fill className="object-cover" />
                            <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"><X className="w-3 h-3" /></button>
                        </div>
                    ))}
                    <label className="w-24 h-32 border-2 border-dashed border-muted flex flex-col items-center justify-center cursor-pointer hover:border-foreground transition-colors">
                        <Plus className="w-6 h-6 text-muted-foreground" />
                        <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
                    </label>
                </div>
            </div>

            <Button disabled={loading} className="w-full h-14 rounded-none font-black tracking-widest uppercase mt-8">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : initialData ? "Update Product" : "Save Product"}
            </Button>
        </form>
    )
}

function SliderManager() {
    const [sliders, setSliders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        fetchSliders()
    }, [])

    const fetchSliders = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/admin/slider")
            const data = await res.json()
            setSliders(data)
        } catch (error) {
            toast.error("Failed to fetch sliders")
        } finally {
            setLoading(false)
        }
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append("image", file)

        try {
            const res = await fetch("/api/admin/slider", {
                method: "POST",
                body: formData,
            })
            if (res.ok) {
                toast.success("Image uploaded successfully")
                fetchSliders()
            } else {
                const data = await res.json()
                toast.error(data.error || "Upload failed")
            }
        } catch (error) {
            toast.error("Upload failed")
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this image?")) return

        try {
            const res = await fetch(`/api/admin/slider/${id}`, {
                method: "DELETE",
            })
            if (res.ok) {
                toast.success("Image deleted")
                fetchSliders()
            }
        } catch (error) {
            toast.error("Delete failed")
        }
    }

    const moveSlider = async (index: number, direction: "up" | "down") => {
        const newSliders = [...sliders]
        const targetIndex = direction === "up" ? index - 1 : index + 1
        if (targetIndex < 0 || targetIndex >= newSliders.length) return

        const item = newSliders.splice(index, 1)[0]
        newSliders.splice(targetIndex, 0, item)

        // Update orders locally
        const updatedSliders = newSliders.map((s, i) => ({ ...s, order: i }))
        setSliders(updatedSliders)

        // Save to DB
        try {
            await fetch("/api/admin/slider", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sliders: updatedSliders }),
            })
            toast.success("Order updated")
        } catch (error) {
            toast.error("Failed to update order")
            fetchSliders()
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white border border-border p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-tight">Upload New Slide</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                            Recommended: High resolution landscape images
                        </p>
                    </div>
                    <label className="cursor-pointer">
                        <div className="bg-foreground text-background px-8 h-12 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-foreground/90 transition-all">
                            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            {uploading ? "Uploading..." : "Add New Image"}
                        </div>
                        <input type="file" className="hidden" onChange={handleUpload} accept="image/*" disabled={uploading} />
                    </label>
                </div>
            </div>

            <div className="bg-white border border-border">
                <table className="w-full text-left order-collapse">
                    <thead>
                        <tr className="border-b-2 border-border bg-muted/30">
                            <th className="p-8 text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground">Preview</th>
                            <th className="p-8 text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground text-center">Order</th>
                            <th className="p-8 text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                        {loading ? (
                            <tr>
                                <td colSpan={3} className="p-16 text-center">
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                                </td>
                            </tr>
                        ) : sliders.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="p-16 text-center text-muted-foreground">
                                    <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                    <p className="text-xs font-black uppercase tracking-widest">No slider images found</p>
                                </td>
                            </tr>
                        ) : (
                            sliders.map((slider, index) => (
                                <tr key={slider._id} className="hover:bg-muted/10 transition-all">
                                    <td className="p-8">
                                        <div className="relative w-40 h-24 border border-border bg-muted overflow-hidden group">
                                            <Image src={slider.imageUrl} alt="Slider" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                    </td>
                                    <td className="p-8 text-center">
                                        <div className="flex items-center justify-center gap-4">
                                            <button
                                                onClick={() => moveSlider(index, "up")}
                                                disabled={index === 0}
                                                className="p-2 border border-border hover:bg-muted disabled:opacity-20"
                                            >
                                                <ChevronRight className="w-4 h-4 -rotate-90" />
                                            </button>
                                            <span className="text-sm font-black w-6">{slider.order + 1}</span>
                                            <button
                                                onClick={() => moveSlider(index, "down")}
                                                disabled={index === sliders.length - 1}
                                                className="p-2 border border-border hover:bg-muted disabled:opacity-20"
                                            >
                                                <ChevronRight className="w-4 h-4 rotate-90" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <button
                                            onClick={() => handleDelete(slider._id)}
                                            className="p-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function CategoryManager() {
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [newCategory, setNewCategory] = useState("")
    const [isAdding, setIsAdding] = useState(false)

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/admin/categories")
            const data = await res.json()
            setCategories(data)
        } catch (error) {
            toast.error("Failed to fetch categories")
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newCategory.trim()) return
        setIsAdding(true)
        try {
            const res = await fetch("/api/admin/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newCategory })
            })
            if (res.ok) {
                toast.success("Category added successfully")
                setNewCategory("")
                fetchCategories()
            } else {
                toast.error("Failed to add category")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsAdding(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This will not delete products in this category but will remove the filter.")) return
        try {
            const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success("Category deleted")
                fetchCategories()
            }
        } catch (error) {
            toast.error("Failed to delete category")
        }
    }

    const moveCategory = async (index: number, direction: "up" | "down") => {
        const newCategories = [...categories]
        const targetIndex = direction === "up" ? index - 1 : index + 1
        if (targetIndex < 0 || targetIndex >= categories.length) return

        [newCategories[index], newCategories[targetIndex]] = [newCategories[targetIndex], newCategories[index]]

        // Update orders
        const updatedWithOrders = newCategories.map((cat, i) => ({ ...cat, order: i }))
        setCategories(updatedWithOrders)

        try {
            await fetch("/api/admin/categories", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ categories: updatedWithOrders })
            })
        } catch (error) {
            toast.error("Failed to update order")
            fetchCategories()
        }
    }

    return (
        <div className="space-y-8">
            <div className="bg-white border border-border p-10 shadow-sm max-w-xl">
                <h3 className="text-xl font-black uppercase tracking-tight mb-6">Add New Category</h3>
                <form onSubmit={handleAdd} className="flex gap-4">
                    <input
                        type="text"
                        placeholder="e.g. SNEAKERS"
                        className="flex-1 border-b-2 border-border focus:border-foreground focus:outline-none py-2 font-bold uppercase tracking-widest text-sm"
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                    />
                    <Button disabled={isAdding} className="h-12 px-8 rounded-none font-black tracking-widest uppercase">
                        {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : "ADD"}
                    </Button>
                </form>
            </div>

            <div className="bg-white border border-border mt-8 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border bg-muted/50">
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category Name</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={3} className="p-20 text-center">
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fetching categories...</p>
                                </td>
                            </tr>
                        ) : categories.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="p-20 text-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No categories found</p>
                                </td>
                            </tr>
                        ) : (
                            categories.map((category, index) => (
                                <tr key={category._id} className="border-b border-border hover:bg-muted/30 transition-colors">
                                    <td className="p-6 w-32">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col gap-1">
                                                <button
                                                    onClick={() => moveCategory(index, "up")}
                                                    disabled={index === 0}
                                                    className="p-2 border border-border hover:bg-muted disabled:opacity-20"
                                                >
                                                    <ChevronRight className="w-4 h-4 -rotate-90" />
                                                </button>
                                                <button
                                                    onClick={() => moveCategory(index, "down")}
                                                    disabled={index === categories.length - 1}
                                                    className="p-2 border border-border hover:bg-muted disabled:opacity-20"
                                                >
                                                    <ChevronRight className="w-4 h-4 rotate-90" />
                                                </button>
                                            </div>
                                            <span className="text-sm font-black">{category.order + 1}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <Hash className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-black uppercase tracking-widest text-sm">{category.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <button
                                            onClick={() => handleDelete(category._id)}
                                            className="p-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
