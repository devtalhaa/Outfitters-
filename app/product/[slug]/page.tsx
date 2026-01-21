import { Header } from "@/components/header"
import { AnnouncementBar } from "@/components/announcement-bar"
import { ProductDetail } from "@/components/product-detail"
import { Footer } from "@/components/footer"
import { notFound } from "next/navigation"
import dbConnect from "@/lib/mongodb"
import Product from "@/lib/models/Product"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params

  await dbConnect()

  // Fetch product directly from database
  const productDoc = await Product.findOne({ slug }).lean()

  if (!productDoc) {
    notFound()
  }

  // Serialize the product for client component
  const product = {
    ...productDoc,
    _id: productDoc._id.toString(),
    createdAt: productDoc.createdAt?.toISOString(),
    updatedAt: productDoc.updatedAt?.toISOString()
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
