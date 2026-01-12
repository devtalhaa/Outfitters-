import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function CollectionHero() {
  return (
    <section className="bg-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/men" className="hover:text-foreground transition-colors">
            Men
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">Footwear</span>
        </nav>

        {/* Hero Content */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-5xl font-bold tracking-tight mb-2">MEN FOOTWEAR</h1>
            <p className="text-muted-foreground">Discover our latest collection of men&apos;s footwear</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">156</span> products
          </p>
        </div>

        {/* Category Tags */}
        <div className="flex flex-wrap gap-2 mt-6">
          {["All Footwear", "Sneakers", "Loafers", "Sandals", "Slides", "Sports Shoes", "Formal"].map(
            (category, index) => (
              <button
                key={category}
                className={`px-4 py-2 text-sm transition-colors ${
                  index === 0
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border hover:border-foreground"
                }`}
              >
                {category}
              </button>
            ),
          )}
        </div>
      </div>
    </section>
  )
}
