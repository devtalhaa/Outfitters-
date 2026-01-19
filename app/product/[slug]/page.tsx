import { Header } from "@/components/header"
import { AnnouncementBar } from "@/components/announcement-bar"
import { ProductDetail } from "@/components/product-detail"
import { Footer } from "@/components/footer"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params

  // Fetch from live API
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products`, { cache: 'no-store' })
  const data = await res.json()

  // Handle paginated response structure
  const productList = data.products ? data.products : (Array.isArray(data) ? data : [])
  const product = productList.find((p: any) => p.slug === slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <ProductDetail product={product} />
      </main>
      <Footer />
    </div>
  )
}
