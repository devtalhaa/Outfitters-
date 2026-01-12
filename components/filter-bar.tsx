"use client"

import { useState } from "react"
import { ChevronDown, SlidersHorizontal, Grid3X3, LayoutList, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"

const sizes = ["39", "40", "41", "42", "43", "44", "45"]
const colors = ["Black", "White", "Brown", "Navy", "Grey", "Tan"]
const priceRanges = ["Under PKR 3,000", "PKR 3,000 - 5,000", "PKR 5,000 - 8,000", "Over PKR 8,000"]

export function FilterBar() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const removeFilter = (filter: string) => {
    setSelectedFilters(selectedFilters.filter((f) => f !== filter))
  }

  return (
    <div className="sticky top-16 lg:top-20 z-40 bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left Side - Filters */}
          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden gap-2 bg-transparent">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <FilterSection title="Size" options={sizes} />
                  <FilterSection title="Color" options={colors} />
                  <FilterSection title="Price" options={priceRanges} />
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-2">
              <FilterDropdown title="Size" options={sizes} />
              <FilterDropdown title="Color" options={colors} />
              <FilterDropdown title="Price" options={priceRanges} />
            </div>

            {/* Active Filters */}
            {selectedFilters.length > 0 && (
              <div className="hidden lg:flex items-center gap-2 ml-4 pl-4 border-l border-border">
                {selectedFilters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => removeFilter(filter)}
                    className="flex items-center gap-1 px-2 py-1 bg-muted text-sm"
                  >
                    {filter}
                    <X className="h-3 w-3" />
                  </button>
                ))}
                <button
                  onClick={() => setSelectedFilters([])}
                  className="text-sm text-muted-foreground hover:text-foreground underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Right Side - Sort & View */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  Sort by: Featured
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Featured</DropdownMenuItem>
                <DropdownMenuItem>Best Selling</DropdownMenuItem>
                <DropdownMenuItem>Newest</DropdownMenuItem>
                <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
                <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="hidden sm:flex items-center border border-border">
              <button
                onClick={() => setView("grid")}
                className={`p-2 ${view === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 ${view === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              >
                <LayoutList className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterDropdown({ title, options }: { title: string; options: string[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          {title}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {options.map((option) => (
          <DropdownMenuItem key={option} className="flex items-center gap-2">
            <Checkbox id={option} />
            <label htmlFor={option} className="flex-1 cursor-pointer">
              {option}
            </label>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function FilterSection({ title, options }: { title: string; options: string[] }) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold">{title}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 cursor-pointer">
            <Checkbox id={`mobile-${option}`} />
            <span className="text-sm">{option}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
