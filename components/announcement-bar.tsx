"use client"

import { useState } from "react"
import { X } from "lucide-react"

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-primary text-primary-foreground py-2.5 px-4 text-center text-sm relative">
      <p className="font-medium">
        Welcome to Lironda
      </p>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
        aria-label="Close announcement"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
