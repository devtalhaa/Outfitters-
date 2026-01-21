"use client"

import React from "react"
import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
export function Footer() {
  const [email, setEmail] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error("Please enter an email address")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })
      const data = await res.json()

      if (res.ok) {
        toast.success(data.message || "Subscribed successfully!")
        setEmail("")
      } else {
        toast.error(data.error || "Subscription failed")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Join Our Newsletter</h3>
            <p className="text-primary-foreground/70 mb-4 sm:mb-6 text-sm sm:text-base">
              Subscribe to get special offers and exclusive deals.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-11 sm:h-12 px-4 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-primary-foreground/50 text-sm"
              />
              <Button
                type="submit"
                disabled={loading}
                variant="secondary"
                className="h-11 sm:h-12 px-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold text-sm w-full sm:w-auto"
              >
                {loading ? "..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* About */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="block relative h-14 w-40 sm:h-20 sm:w-64 mb-4 sm:mb-6">
              <Image
                src="/lironda-logo.png"
                alt="Lironda"
                fill
                className="object-contain object-left"
              />
            </Link>
            <p className="text-xs sm:text-sm text-primary-foreground/70 mb-4">
              Pakistan&apos;s leading fashion brand offering trendy apparel and footwear.
            </p>
            <div className="flex gap-3">
              <Link href="https://www.facebook.com/share/14SMRFXyUV2/" className="hover:opacity-70 transition-opacity">
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link href="http://www.instagram.com/lironda.pk" className="hover:opacity-70 transition-opacity">
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link href="#" className="hover:opacity-70 transition-opacity">
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link href="#" className="hover:opacity-70 transition-opacity">
                <Youtube className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-primary-foreground/70">
              <li>
                <Link href="#" className="hover:text-primary-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-foreground">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-foreground">
                  Store Locator
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-foreground">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contact</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-primary-foreground/70">
              <li className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mt-0.5 shrink-0" />
                <span>123 Fashion Street, Lahore</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span>+92 42 1234 5678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span className="break-all">support@outfitters.pk</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-primary-foreground/70">
            <p>© 2026 LIRONDA. All rights reserved.</p>

          </div>
        </div>
      </div>
    </footer>
  )
}

