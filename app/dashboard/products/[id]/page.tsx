"use client"

import { useState, useEffect, use } from "react"
import {
    ChevronLeft,
    Save,
    Loader2,
    Package,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    Calendar,
    ArrowLeft,
    Plus,
    Trash2,
    X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface PageProps {
    params: Promise<{ id: string }>
}

export default function ProductDetailPage({ params }: PageProps) {
    const { id } = use(params)
    const [product, setProduct] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const router = useRouter()

    useEffect(() => {
        fetchProduct()
    }, [id])

    const fetchProduct = async () => {
        try {
            const res = await fetch("/api/products")
            const data = await res.json()
            const productList = data.products ? data.products : (Array.isArray(data) ? data : [])
            const found = productList.find((p: any) => p._id === id)
            if (found) {
                setProduct(found)
            } else {
                toast.error("Product not found")
                router.push("/dashboard")
            }
        } catch (error) {
            toast.error("Failed to fetch product details")
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const formData = new FormData()
            formData.append("name", product.name)
            formData.append("price", product.price.toString())
            formData.append("category", product.category)
            formData.append("articleCode", product.articleCode)
            formData.append("sizes", JSON.stringify(product.sizes))
            formData.append("existingImages", JSON.stringify(product.images))

            const res = await fetch(`/api/products/${id}`, {
                method: "PUT",
                body: formData
            })

            if (res.ok) {
                toast.success("Inventory updated successfully")
                fetchProduct()
            } else {
                throw new Error("Update failed")
            }
        } catch (error) {
            toast.error("Failed to save changes")
        } finally {
            setSaving(false)
        }
    }

    const updateSizeStock = (index: number, newStock: number) => {
        const newSizes = [...product.sizes]
        newSizes[index].stock = Math.max(0, newStock)
        setProduct({ ...product, sizes: newSizes })
    }

    const updateSizeValue = (index: number, newVal: string) => {
        const newSizes = [...product.sizes]
        newSizes[index].value = newVal
        setProduct({ ...product, sizes: newSizes })
    }

    const addSize = () => {
        const newSize = prompt("Enter new size (e.g. 20, 42, XL):")
        if (newSize) {
            setProduct({
                ...product,
                sizes: [...product.sizes, { value: newSize, stock: 0 }]
            })
        }
    }

    const removeSize = (index: number) => {
        if (confirm("Are you sure you want to remove this size?")) {
            const newSizes = product.sizes.filter((_: any, i: number) => i !== index)
            setProduct({ ...product, sizes: newSizes })
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-foreground mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Loading Inventory Details...</p>
            </div>
        )
    }

    const totalStock = product.sizes.reduce((acc: number, s: any) => acc + s.stock, 0)
    const lowStockSizes = product.sizes.filter((s: any) => s.stock < 10 && s.stock > 0)
    const outOfStockSizes = product.sizes.filter((s: any) => s.stock === 0)

    return (
        <div className="min-h-screen bg-[#fcfcfc] pb-20">
            {/* Header */}
            <div className="bg-white border-b border-border sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="p-2 hover:bg-muted rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold uppercase tracking-tight">{product.name}</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{product.articleCode}</span>
                                <span className="w-1 h-1 bg-muted-foreground rounded-full opacity-30" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{product.category}</span>
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="rounded-none h-12 px-8 font-black tracking-widest uppercase shadow-lg bg-foreground"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Inventory
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-12 gap-10">
                {/* Left Col */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white border border-border p-4 shadow-sm">
                        <div className="aspect-[4/5] relative bg-muted overflow-hidden">
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                        </div>
                    </div>

                    <div className="bg-white border border-border p-6 shadow-sm space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border pb-2">Inventory Stats</h3>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Package className="w-4 h-4 text-blue-500" />
                                <span className="text-xs font-bold uppercase">Total Units</span>
                            </div>
                            <span className="text-lg font-black">{totalStock}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                <span className="text-xs font-bold uppercase">Price</span>
                            </div>
                            <span className="text-lg font-black">PKR {product.price.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Alerts */}
                    {(lowStockSizes.length > 0 || outOfStockSizes.length > 0) && (
                        <div className="space-y-3">
                            {outOfStockSizes.map((s: any) => (
                                <div key={s.value} className="bg-red-50 border border-red-100 p-4 flex items-center gap-4">
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                    <p className="text-[10px] font-black uppercase tracking-tight text-red-700">Size {s.value} is Out of Stock</p>
                                </div>
                            ))}
                            {lowStockSizes.map((s: any) => (
                                <div key={s.value} className="bg-yellow-50 border border-yellow-100 p-4 flex items-center gap-4">
                                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                    <p className="text-[10px] font-black uppercase tracking-tight text-yellow-700">Size {s.value} is Low ({s.stock})</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Col */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white border border-border p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black uppercase tracking-tight">Size & Stock Control</h2>
                            <Button onClick={addSize} variant="outline" className="rounded-none border-2 border-foreground h-11 px-6 font-black tracking-widest text-[10px] uppercase">
                                <Plus className="w-4 h-4 mr-2" />
                                Add New Size
                            </Button>
                        </div>

                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {product.sizes.map((s: any, idx: number) => (
                                <div key={idx} className="border border-border p-6 flex flex-col items-center bg-muted/5 group relative hover:border-foreground transition-all">
                                    <button
                                        onClick={() => removeSize(idx)}
                                        className="absolute top-2 right-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>

                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Size label</span>
                                    <input
                                        value={s.value}
                                        onChange={(e) => updateSizeValue(idx, e.target.value)}
                                        className="text-2xl font-black mb-6 bg-transparent border-b border-transparent focus:border-foreground focus:outline-none text-center w-full"
                                    />

                                    <div className="flex items-center border border-border bg-white shadow-sm overflow-hidden">
                                        <button
                                            onClick={() => updateSizeStock(idx, s.stock - 1)}
                                            className="w-10 h-10 flex items-center justify-center hover:bg-muted border-r border-border font-bold text-xl"
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            value={s.stock}
                                            onChange={(e) => updateSizeStock(idx, parseInt(e.target.value) || 0)}
                                            className="w-16 h-10 text-center font-black text-sm border-none focus:ring-0"
                                        />
                                        <button
                                            onClick={() => updateSizeStock(idx, s.stock + 1)}
                                            className="w-10 h-10 flex items-center justify-center hover:bg-muted border-l border-border font-bold text-xl"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="mt-4">
                                        {s.stock === 0 ? (
                                            <span className="flex items-center gap-1 text-[8px] font-black uppercase text-red-500">
                                                <AlertTriangle className="w-3 h-3" /> Zero Inventory
                                            </span>
                                        ) : s.stock < 10 ? (
                                            <span className="flex items-center gap-1 text-[8px] font-black uppercase text-yellow-600">
                                                <TrendingUp className="w-3 h-3" /> Sell-out Risk
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-[8px] font-black uppercase text-green-500">
                                                <CheckCircle2 className="w-3 h-3" /> Ideal Stock
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {product.sizes.length === 0 && (
                            <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-border">
                                <Package className="w-12 h-12 text-muted-foreground opacity-20 mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">No sizes defined for this product</p>
                                <Button onClick={addSize} variant="link" className="mt-4 font-black uppercase text-[10px]">Add first size</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
