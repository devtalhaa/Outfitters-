"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { AnnouncementBar } from "@/components/announcement-bar"
import { CollectionHero } from "@/components/collection-hero"
import { FilterBar } from "@/components/filter-bar"
import { ProductGrid } from "@/components/product-grid"
import { Footer } from "@/components/footer"

export default function HomePage() {
  const [filters, setFilters] = useState({
    category: "All Footwear",
    size: "",
    color: "",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
    view: "grid" as "grid" | "list"
  })

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <CollectionHero
          activeCategory={filters.category}
          onCategoryChange={(cat) => updateFilters({ category: cat })}
        />
        <FilterBar
          filters={filters}
          updateFilters={updateFilters}
          activeCategory={filters.category}
          onCategoryChange={(cat) => updateFilters({ category: cat })}
        />
        <ProductGrid
          filters={filters}
        />
      </main>
      <Footer />
    </div>
  )
}
