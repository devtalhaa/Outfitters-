"use client"

import { useWishlist } from "@/context/wishlist-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnnouncementBar } from "@/components/announcement-bar"
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function WishlistPage() {
    const { wishlist, toggleWishlist, loading } = useWishlist()

    return (
        <div className="min-h-screen flex flex-col bg-[#fcfcfc]">
            <AnnouncementBar />
            <Header />

            <main className="flex-1 container mx-auto px-4 py-12 lg:py-20">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="p-3 bg-red-50 rounded-full">
                            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-tight">Your Wishlist</h1>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                                {wishlist.length} {wishlist.length === 1 ? "Item" : "Items"} saved for later
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-4 border-foreground border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : wishlist.length === 0 ? (
                        <div className="text-center py-20 bg-white border border-dashed border-border">
                            <ShoppingBag className="w-16 h-16 text-muted-foreground opacity-20 mx-auto mb-6" />
                            <h2 className="text-xl font-black uppercase tracking-tight mb-2">Your wishlist is empty</h2>
                            <p className="text-sm text-muted-foreground mb-8 font-medium">Start exploring our collection and save your favorites!</p>
                            <Link href="/">
                                <Button className="px-12 h-14 rounded-none font-black tracking-widest uppercase shadow-xl">
                                    Shop Collection
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {wishlist.map((product: any) => (
                                <div key={product._id} className="group bg-white border border-border p-4 transition-all hover:border-foreground flex gap-6 sm:gap-8 items-center">
                                    <Link href={`/product/${product.slug}`} className="relative w-24 h-32 sm:w-32 sm:h-40 bg-muted shrink-0 overflow-hidden">
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </Link>

                                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">{product.category}</p>
                                            <h3 className="text-lg font-black uppercase tracking-tight group-hover:underline">{product.name}</h3>
                                            <p className="text-base font-black">PKR {product.price.toLocaleString()}</p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Link href={`/product/${product.slug}`} className="flex-1 sm:flex-none">
                                                <Button size="sm" className="w-full sm:w-auto h-12 px-6 rounded-none font-black tracking-widest uppercase flex items-center gap-2">
                                                    View Item <ArrowRight className="w-3 h-3" />
                                                </Button>
                                            </Link>
                                            <button
                                                onClick={() => toggleWishlist(product._id)}
                                                className="p-3 text-muted-foreground hover:text-red-500 transition-colors bg-muted/30 hover:bg-red-50"
                                                title="Remove from wishlist"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
