"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Image from "next/image"

export default function LoginPage() {
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            })

            if (res.ok) {
                toast.success("Welcome back, Admin")
                window.location.href = "/dashboard"
            } else {
                toast.error("Invalid password")
            }
        } catch (error) {
            toast.error("Connection failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row">
            {/* Left Decoration */}
            <div className="hidden lg:flex lg:w-1/2 bg-foreground relative overflow-hidden items-center justify-center p-20 text-background">
                <div className="absolute inset-0 opacity-20">
                    <Image
                        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070"
                        alt="Decoration"
                        fill
                        className="object-cover grayscale"
                    />
                </div>
                <div className="relative z-10 max-w-sm">
                    <h1 className="text-6xl font-black tracking-tighter uppercase mb-6 leading-none">Admin<br />Access</h1>
                    <p className="text-sm font-bold uppercase tracking-widest opacity-60">Inventory & Order Management System v1.0</p>
                </div>
                <div className="absolute bottom-12 left-12">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Outfitters Clone • 2024</p>
                </div>
            </div>

            {/* Right Form */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-20">
                <div className="w-full max-w-md">
                    <div className="mb-12">
                        <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Login</h2>
                        <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Please enter the administrative password</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <Lock className="w-3 h-3" />
                                Security Key
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full border-b-2 border-border px-0 py-4 text-xl font-bold focus:outline-none focus:border-foreground transition-all placeholder:text-muted/30"
                                autoFocus
                            />
                        </div>

                        <Button
                            disabled={loading}
                            className="w-full h-16 rounded-none font-black tracking-[0.2em] uppercase shadow-2xl group text-sm mt-10"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    Unlock Dashboard
                                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-all" />
                                </>
                            )}
                        </Button>

                        <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-10">
                            Unauthorized access is strictly prohibited
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
