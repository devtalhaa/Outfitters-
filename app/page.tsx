import dbConnect from "@/lib/mongodb"
import Slider from "@/lib/models/Slider"
import Category from "@/lib/models/Category"
import { HomeLayout } from "@/components/home-layout"

export default async function HomePage() {
  await dbConnect()

  // Fetch sliders directly from DB for immediate loading
  const sliderDocs = await Slider.find({ isActive: true }).sort({ order: 1 })

  // Serialize for Client Component
  const initialSliders = sliderDocs.map(doc => ({
    _id: doc._id.toString(),
    imageUrl: doc.imageUrl,
    order: doc.order,
    publicId: doc.publicId,
    isActive: doc.isActive
  }))

  // Fetch categories
  const categoryDocs = await Category.find({ isActive: true }).sort({ order: 1 })

  // Serialize categories
  const initialCategories = categoryDocs.map(doc => ({
    _id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    order: doc.order
  }))

  return <HomeLayout initialSliders={initialSliders} initialCategories={initialCategories} />
}
