"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronRight, Plus, Minus } from "lucide-react"

const productImages = [
  "/black-white-chunky-sneakers-side-view-on-gray-back.jpg",
  "/black-white-chunky-sneakers-back-view-on-gray-back.jpg",
  "/black-white-chunky-sneakers-top-angle-view-on-gray.jpg",
  "/black-white-chunky-sneakers-detail-view-on-gray-ba.jpg",
]

const colors = [
  { name: "Black", value: "#000000" },
  { name: "Gray", value: "#6B6B6B" },
]

const sizes = ["40", "41", "42", "43", "44", "45"]

export function ProductDetail() {
  const [selectedColor, setSelectedColor] = useState("Black")
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section)
  }

  return (
    <div className="px-4 py-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs mb-6">
        <a href="/" className="text-muted-foreground hover:text-foreground">
          Home
        </a>
        <ChevronRight className="w-3 h-3 text-muted-foreground" />
        <a href="/" className="text-muted-foreground hover:text-foreground">
          Men
        </a>
        <ChevronRight className="w-3 h-3 text-muted-foreground" />
        <a href="/" className="text-muted-foreground hover:text-foreground">
          Footwear
        </a>
        <ChevronRight className="w-3 h-3 text-muted-foreground" />
        <span className="text-foreground">Chunky Mesh Sneakers</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-1">
          {productImages.map((image, index) => (
            <div key={index} className="aspect-[5/6] bg-[#f5f5f5] relative overflow-hidden">
              <Image
                src={image || "/placeholder.svg"}
                alt={`Product view ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Product Info */}
        <div className="lg:pl-4">
          {/* Title */}
          <h1 className="text-sm font-bold tracking-wide uppercase mb-4">CHUNKY MESH SNEAKERS</h1>

          {/* Price */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm text-muted-foreground line-through">PKR 11,990</span>
            <span className="text-sm font-semibold">PKR 8,390</span>
            <span className="text-sm font-semibold">-30%</span>
          </div>

          {/* Installment Option */}
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-[#1a1a1a] text-white text-xs font-bold px-2 py-1">baadmay</span>
            <span className="text-sm">
              Pay in 3 Installments of <span className="text-[#00a884] font-semibold">Rs. 3216</span>
            </span>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <p className="text-sm mb-3">{selectedColor}</p>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-7 h-7 border-2 ${
                    selectedColor === color.name ? "border-foreground" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color.value }}
                  aria-label={color.name}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium tracking-wide uppercase">SELECT SIZE</p>
              <button className="text-xs underline underline-offset-4 hover:no-underline">SIZE GUIDE</button>
            </div>
            <div className="flex gap-4">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`text-sm py-1 ${
                    selectedSize === size
                      ? "font-bold underline underline-offset-4"
                      : "text-foreground hover:underline underline-offset-4"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button className="w-full bg-foreground text-background py-4 px-6 text-sm font-semibold tracking-wide uppercase flex items-center justify-between mb-8 hover:bg-foreground/90 transition-colors">
            <span>ADD TO CART</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </button>

          {/* Product Description */}
          <div className="mb-6">
            <h2 className="text-xs font-bold tracking-wide uppercase mb-4">PRODUCT DESCRIPTION</h2>
            <p className="text-sm leading-relaxed text-foreground">
              Step into style with our Chunky Mesh Sneakers—the perfect blend of comfort and attitude. Featuring
              breathable mesh construction and a secure laces closure, these kicks keep your feet happy all day long.
              Whether you&apos;re hitting the streets or catching up with friends, these sneakers deliver the comfort
              and edge your wardrobe deserves.
            </p>
          </div>

          {/* Accordion Sections */}
          <div className="border-t border-border">
            {/* Size Guide */}
            <div className="border-b border-border">
              <button
                onClick={() => toggleAccordion("sizeGuide")}
                className="w-full py-4 flex items-center justify-between text-left"
              >
                <span className="text-xs font-medium tracking-wide uppercase">SIZE GUIDE</span>
                {openAccordion === "sizeGuide" ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
              {openAccordion === "sizeGuide" && (
                <div className="pb-4 text-sm text-muted-foreground">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2">EU Size</th>
                        <th className="text-left py-2">UK Size</th>
                        <th className="text-left py-2">Foot Length (cm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="py-2">40</td>
                        <td className="py-2">6</td>
                        <td className="py-2">25.0</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2">41</td>
                        <td className="py-2">7</td>
                        <td className="py-2">25.5</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2">42</td>
                        <td className="py-2">8</td>
                        <td className="py-2">26.5</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2">43</td>
                        <td className="py-2">9</td>
                        <td className="py-2">27.0</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2">44</td>
                        <td className="py-2">10</td>
                        <td className="py-2">28.0</td>
                      </tr>
                      <tr>
                        <td className="py-2">45</td>
                        <td className="py-2">11</td>
                        <td className="py-2">28.5</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="border-b border-border">
              <button
                onClick={() => toggleAccordion("productDetails")}
                className="w-full py-4 flex items-center justify-between text-left"
              >
                <span className="text-xs font-medium tracking-wide uppercase">PRODUCT DETAILS & COMPOSITION</span>
                {openAccordion === "productDetails" ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
              {openAccordion === "productDetails" && (
                <div className="pb-4 text-sm text-muted-foreground space-y-2">
                  <p>
                    <strong>Article Code:</strong> FMS-SN-0124-BLK
                  </p>
                  <p>
                    <strong>Upper Material:</strong> Mesh, Synthetic
                  </p>
                  <p>
                    <strong>Sole:</strong> Rubber
                  </p>
                  <p>
                    <strong>Closure:</strong> Lace-up
                  </p>
                  <p>
                    <strong>Care:</strong> Wipe with a clean, dry cloth
                  </p>
                </div>
              )}
            </div>

            {/* Deliveries & Returns */}
            <div className="border-b border-border">
              <button
                onClick={() => toggleAccordion("delivery")}
                className="w-full py-4 flex items-center justify-between text-left"
              >
                <span className="text-xs font-medium tracking-wide uppercase">DELIVERIES & RETURNS</span>
                {openAccordion === "delivery" ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
              {openAccordion === "delivery" && (
                <div className="pb-4 text-sm text-muted-foreground space-y-2">
                  <p>
                    <strong>Standard Delivery:</strong> 3-5 working days
                  </p>
                  <p>
                    <strong>Express Delivery:</strong> 1-2 working days (selected cities)
                  </p>
                  <p>
                    <strong>Free Shipping:</strong> On orders above PKR 2,500
                  </p>
                  <p>
                    <strong>Returns:</strong> Easy 14-day return policy. Items must be unworn with original tags.
                  </p>
                  <p>
                    <strong>Exchange:</strong> Free exchange within 14 days of delivery.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
