import { Header } from "@/components/header"
import { AnnouncementBar } from "@/components/announcement-bar"
import { CollectionHero } from "@/components/collection-hero"
import { FilterBar } from "@/components/filter-bar"
import { ProductGrid } from "@/components/product-grid"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <CollectionHero />
        <FilterBar />
        <ProductGrid />
      </main>
      <Footer />
    </div>
  )
}
