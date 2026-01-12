import { Header } from "@/components/header"
import { AnnouncementBar } from "@/components/announcement-bar"
import { ProductDetail } from "@/components/product-detail"
import { Footer } from "@/components/footer"

export default function ProductPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <ProductDetail />
      </main>
      <Footer />
    </div>
  )
}
