"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Heart, ShoppingBag, Menu, X, LayoutDashboard } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useWishlist } from "@/context/wishlist-context"

const navItems: any[] = []

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const { wishlist } = useWishlist()

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      const count = cart.reduce((acc: number, item: any) => acc + item.quantity, 0)
      setCartCount(count)
    }

    updateCartCount()
    window.addEventListener("storage", updateCartCount)

    // Check for updates every second as a fallback for same-tab updates
    const interval = setInterval(updateCartCount, 1000)

    return () => {
      window.removeEventListener("storage", updateCartCount)
      clearInterval(interval)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white text-black shadow-sm">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">

          {/* Logo - Smaller on mobile */}
          <Link href="/" className="relative h-10 w-32 sm:h-12 sm:w-40 lg:h-20 lg:w-64 flex-shrink-0">
            <Image
              src="/lironda-logo.png"
              alt="Lironda"
              fill
              className="object-contain object-left"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-medium flex items-center gap-1 hover:opacity-70 transition-opacity ${item.sale ? "text-accent" : ""
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions - Responsive icon sizing */}
          <div className="flex items-center gap-0.5 sm:gap-1 lg:gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)} className="relative hover:bg-muted h-9 w-9 sm:h-10 sm:w-10">
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Link href="/dashboard" className="hidden sm:flex p-2 hover:bg-muted rounded-md transition-colors">
              <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground hover:text-foreground" />
            </Link>
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="hidden sm:flex relative h-9 w-9 sm:h-10 sm:w-10">
                <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${wishlist.length > 0 ? "fill-red-500 text-red-500" : ""}`} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[8px] font-black flex items-center justify-center animate-in zoom-in duration-300">
                    {wishlist.length}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10">
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-primary text-primary-foreground text-[8px] sm:text-[10px] font-black flex items-center justify-center animate-in zoom-in duration-300">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Bar - Full width on mobile */}
        {searchOpen && (
          <div className="py-3 sm:py-4 border-t border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search products..."
                className="w-full pl-10 pr-10 py-2.5 sm:py-3 text-sm border border-border focus:outline-none focus:border-foreground transition-colors"
                autoFocus
              />
              <button onClick={() => setSearchOpen(false)} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

