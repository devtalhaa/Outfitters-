"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navItems = [
  { label: "NEW ARRIVALS", href: "/new-arrivals", highlight: true },
  { label: "MEN", href: "/men", hasDropdown: true },
  { label: "WOMEN", href: "/women", hasDropdown: true },
  { label: "KIDS", href: "/kids", hasDropdown: true },
  { label: "ACCESSORIES", href: "/accessories", hasDropdown: true },
  { label: "SALE", href: "/sale", sale: true },
]

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
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
                    className={`px-6 py-4 border-b border-border hover:bg-muted transition-colors ${
                      item.sale ? "text-accent font-semibold" : ""
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
                className={`text-sm font-medium flex items-center gap-1 hover:opacity-70 transition-opacity ${
                  item.sale ? "text-accent" : ""
                }`}
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="h-3 w-3" />}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 lg:gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)} className="relative">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                0
              </span>
            </Button>
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
