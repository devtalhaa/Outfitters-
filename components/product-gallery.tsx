"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
    images: string[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0)
    const [isZoomed, setIsZoomed] = useState(false)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isZoomed) return
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
        const x = ((e.pageX - left - window.scrollX) / width) * 100
        const y = ((e.pageY - top - window.scrollY) / height) * 100
        setMousePos({ x, y })
    }

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={cn(
                            "relative flex-shrink-0 w-20 h-24 bg-[#f5f5f5] border-2 transition-all duration-200 rounded-lg overflow-hidden",
                            selectedImage === index ? "border-foreground" : "border-transparent hover:border-border"
                        )}
                    >
                        <Image
                            src={image || "/placeholder.svg"}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover p-1"
                        />
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <div
                className="relative flex-1 aspect-[4/5] bg-[#f5f5f5] cursor-zoom-in overflow-hidden group rounded-2xl"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
            >
                <Image
                    src={images[selectedImage] || "/placeholder.svg"}
                    alt="Product main view"
                    fill
                    priority
                    className={cn(
                        "object-cover transition-transform duration-200",
                        isZoomed ? "scale-200" : "scale-100"
                    )}
                    style={isZoomed ? {
                        transformOrigin: `${mousePos.x}% ${mousePos.y}%`
                    } : undefined}
                />

                {/* Zoom Hint */}
                {!isZoomed && (
                    <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-background/80 backdrop-blur-sm text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 shadow-sm rounded-full">
                            Roll over to zoom
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}
