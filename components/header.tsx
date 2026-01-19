"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Heart, ShoppingBag, Menu, X, LayoutDashboard } from "lucide-react"
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
    <header className=" top-0 z-50 bg-white text-black shadow-sm ">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <div className="p-6">
                <Link href="/" className="text-2xl font-bold tracking-tighter">
                  OUTFITTERS
                </Link>
              </div>
              <nav className="flex flex-col">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`px-6 py-4 border-b border-border hover:bg-muted transition-colors ${item.sale ? "text-accent font-semibold" : ""
                      } ${item.highlight ? "font-semibold" : ""}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="text-xl lg:text-2xl font-bold tracking-tighter">
            OUTFITTERS
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

          {/* Actions */}
          <div className="flex items-center gap-1 lg:gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)} className="relative hover:bg-muted">
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/dashboard" className="hidden sm:flex p-2 hover:bg-muted rounded-md transition-colors">
              <LayoutDashboard className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </Link>
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="hidden sm:flex relative">
                <Heart className={`h-5 w-5 ${wishlist.length > 0 ? "fill-red-500 text-red-500" : ""}`} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[8px] font-black flex items-center justify-center animate-in zoom-in duration-300">
                    {wishlist.length}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-black flex items-center justify-center animate-in zoom-in duration-300">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="py-4 border-t border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search for products..."
                className="w-full pl-10 pr-10 py-3 border border-border focus:outline-none focus:border-foreground transition-colors"
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
