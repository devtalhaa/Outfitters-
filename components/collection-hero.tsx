"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Loader2 } from "lucide-react"

interface CollectionHeroProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
  initialSliders?: any[]
  categories?: any[]
}

export function CollectionHero({ activeCategory, onCategoryChange, initialSliders = [], categories = [] }: CollectionHeroProps) {
  const [sliders, setSliders] = useState<any[]>(initialSliders)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // Only fetch if initialSliders is empty (fallback)
    if (initialSliders.length === 0) {
      const fetchSliders = async () => {
        try {
          const res = await fetch("/api/admin/slider")
          const data = await res.json()
          setSliders(data)
        } catch (error) {
          console.error("Failed to fetch sliders:", error)
        }
      }
      fetchSliders()
    }
  }, [initialSliders])

  useEffect(() => {
    if (sliders.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliders.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [sliders])

  const currentBg = sliders.length > 0
    ? sliders[currentIndex].imageUrl
    : ''

  return (
    <section className="h-[85vh] sm:h-[90vh] lg:h-screen relative -mt-16 lg:-mt-20 pt-16 lg:pt-20 bg-black overflow-hidden">
      {/* Background Image using Next.js Image for better loading */}
      {currentBg && (
        <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
          <Image
            src={currentBg}
            alt="Hero background"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      )}

      {/* Category List Section - Fixed at top with proper mobile sizing */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-md border-b border-border py-3 sm:py-4 lg:py-6 overflow-x-auto scrollbar-hide">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex justify-start lg:justify-center items-center gap-4 sm:gap-6 lg:gap-16 whitespace-nowrap min-w-max">
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => onCategoryChange(cat.name)}
                className={`text-[9px] sm:text-[10px] lg:text-[11px] font-black tracking-[0.15em] sm:tracking-[0.2em] lg:tracking-[0.3em] uppercase transition-all duration-300 relative group flex-shrink-0 py-1 ${activeCategory === cat.name ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {cat.name}
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-foreground transition-transform duration-300 origin-left ${activeCategory === cat.name ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Optional: Add indicators if multiple slides */}
      {sliders.length > 1 && (
        <div className="absolute bottom-6 sm:bottom-8 lg:bottom-10 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-20">
          {sliders.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-8 sm:w-10 lg:w-12 h-1 border transition-all ${i === currentIndex ? "border-foreground bg-foreground" : "border-foreground/20 bg-foreground/10 hover:border-foreground/50"}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
