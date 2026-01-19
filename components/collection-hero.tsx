"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface CollectionHeroProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CollectionHero({ activeCategory, onCategoryChange }: CollectionHeroProps) {
  const categories = ["All Footwear", "Sneakers", "Loafers", "Sandals", "Slides", "Sports Shoes", "Formal"]

  return (
    <section
      className="h-screen relative -mt-16 lg:-mt-20 pt-16 lg:pt-20"
      style={{
        backgroundImage: 'url(/black-oxford-shoes-polished.jpg)',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* <div className="container mx-auto px-4 py-8 relative z-10 bg-background/80 backdrop-blur-sm"> */}
      {/*       
        <nav className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase mb-6 text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">Footwear</span>
        </nav> */}


      {/* <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase mb-2">FOOTWEAR</h1>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest italic">Discover our latest collection of premium men&apos;s footwear</p>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            Explore the ultimate style
          </p>
        </div> */}



      {/* </div> */}
    </section >
  )
}
