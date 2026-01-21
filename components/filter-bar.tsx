"use client"

import { useState } from "react"
import { ChevronDown, SlidersHorizontal, Grid3X3, LayoutList, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"

const sizes = ["39", "40", "41", "42", "43", "44", "45"]
const colors = ["Black", "White", "Brown", "Navy", "Grey", "Tan"]
const priceRanges = [
  { label: "Under PKR 3,000", min: "", max: "3000" },
  { label: "PKR 3,000 - 5,000", min: "3000", max: "5000" },
  { label: "PKR 5,000 - 8,000", min: "5000", max: "8000" },
  { label: "Over PKR 8,000", min: "8000", max: "" }
]

interface FilterBarProps {
  filters: any
  updateFilters: (newFilters: any) => void
  activeCategory: string
  onCategoryChange: (category: string) => void
  categories?: any[]
}

export function FilterBar({ filters, updateFilters, activeCategory, onCategoryChange, categories = [] }: FilterBarProps) {
  const activeFiltersCount = (filters.size ? 1 : 0) + (filters.color ? 1 : 0) + (filters.minPrice || filters.maxPrice ? 1 : 0)

  const categoryNames = ["All Footwear", ...categories.map(c => c.name)]

  return (
    <div className="top-16 lg:top-20 z-40 bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
        {/* Category Filter Buttons - Horizontal scroll on mobile */}
        <div className="flex overflow-x-auto gap-1.5 sm:gap-2 mb-4 sm:mb-6 pb-2 -mx-2 px-2 scrollbar-hide">
          {categoryNames.map((category) => (
            <button
              key={category}
              onClick={(e) => {
                e.preventDefault()
                onCategoryChange(category)
              }}
              className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 text-[9px] sm:text-[10px] font-black tracking-wider sm:tracking-widest uppercase transition-all duration-300 border-2 flex-shrink-0 whitespace-nowrap ${activeCategory === category
                ? "bg-foreground text-background border-foreground shadow-lg scale-105"
                : "bg-background text-foreground border-border hover:border-foreground"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* Left Side - Filters */}
          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden gap-2 bg-transparent rounded-none border-2 border-foreground group relative">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-foreground text-background text-[9px] font-black flex items-center justify-center rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0">
                <SheetHeader className="p-6 border-b border-border">
                  <SheetTitle className="text-xl font-black uppercase tracking-tighter">Filters</SheetTitle>
                </SheetHeader>
                <div className="p-6 space-y-10">
                  <FilterSection
                    title="Size"
                    options={sizes}
                    currentValue={filters.size}
                    onChange={(val) => updateFilters({ size: val })}
                  />
                  <FilterSection
                    title="Color"
                    options={colors}
                    currentValue={filters.color}
                    onChange={(val) => updateFilters({ color: val })}
                  />
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest">Price Range</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {priceRanges.map(range => (
                        <button
                          key={range.label}
                          onClick={() => updateFilters({ minPrice: range.min, maxPrice: range.max })}
                          className={`text-left px-4 py-3 text-[10px] font-bold uppercase border transition-all ${filters.maxPrice === range.max ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"}`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-2">
              <FilterDropdown
                title="Size"
                options={sizes}
                currentValue={filters.size}
                onSelect={(val) => updateFilters({ size: val })}
              />
              <FilterDropdown
                title="Color"
                options={colors}
                currentValue={filters.color}
                onSelect={(val) => updateFilters({ color: val })}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-transparent rounded-none border-foreground/20 hover:border-foreground transition-all">
                    <span className="text-[10px] font-bold uppercase tracking-widest">Price Range</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 p-2 rounded-none">
                  {priceRanges.map(range => (
                    <DropdownMenuItem
                      key={range.label}
                      onClick={() => updateFilters({ minPrice: range.min, maxPrice: range.max })}
                      className={`text-[10px] font-bold uppercase p-3 cursor-pointer mb-1 last:mb-0 ${filters.maxPrice === range.max ? "bg-foreground text-background focus:bg-foreground focus:text-background" : ""}`}
                    >
                      {range.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Clear All */}
            {activeFiltersCount > 0 && (
              <button
                onClick={() => updateFilters({ size: "", color: "", minPrice: "", maxPrice: "" })}
                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-red-500 transition-colors ml-4 underline underline-offset-4"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Right Side - Sort & View */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-3 bg-transparent rounded-none border-foreground hover:bg-foreground hover:text-background transition-all">
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Sort: {filters.sort === "price-asc" ? "Low to High" : filters.sort === "price-desc" ? "High to Low" : filters.sort === "newest" ? "Newest" : "Featured"}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-none">
                <DropdownMenuItem onClick={() => updateFilters({ sort: "featured" })} className="text-[10px] font-bold uppercase p-3 cursor-pointer">Featured</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateFilters({ sort: "newest" })} className="text-[10px] font-bold uppercase p-3 cursor-pointer">Newest Arrivals</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateFilters({ sort: "price-asc" })} className="text-[10px] font-bold uppercase p-3 cursor-pointer">Price: Low to High</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateFilters({ sort: "price-desc" })} className="text-[10px] font-bold uppercase p-3 cursor-pointer">Price: High to Low</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="hidden sm:flex items-center border border-foreground">
              <button
                onClick={() => updateFilters({ view: "grid" })}
                className={`p-2.5 ${filters.view === "grid" ? "bg-foreground text-background" : "hover:bg-muted"}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => updateFilters({ view: "list" })}
                className={`p-2.5 ${filters.view === "list" ? "bg-foreground text-background" : "hover:bg-muted"}`}
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

function FilterDropdown({ title, options, currentValue, onSelect }: { title: string; options: string[]; currentValue: string; onSelect: (val: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`gap-2 bg-transparent rounded-none transition-all ${currentValue ? "border-foreground bg-muted ring-1 ring-foreground" : "border-foreground/20 hover:border-foreground"}`}>
          <span className="text-[10px] font-bold uppercase tracking-widest">{title}{currentValue && `: ${currentValue}`}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 p-2 rounded-none">
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => onSelect(currentValue === option ? "" : option)}
            className={`flex items-center justify-between text-[10px] font-bold uppercase p-3 cursor-pointer mb-1 last:mb-0 ${currentValue === option ? "bg-foreground text-background focus:bg-foreground focus:text-background" : ""}`}
          >
            {option}
            {currentValue === option && <X className="w-3 h-3" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function FilterSection({ title, options, currentValue, onChange }: { title: string; options: string[]; currentValue: string; onChange: (val: string) => void }) {
  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-black uppercase tracking-widest">{title}</h3>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(currentValue === option ? "" : option)}
            className={`px-3 py-3 text-[10px] font-bold uppercase border transition-all ${currentValue === option ? "bg-foreground text-background border-foreground shadow-md" : "border-border hover:border-foreground"}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
