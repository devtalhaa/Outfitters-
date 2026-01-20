import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Category from "@/lib/models/Category"

export async function GET() {
    try {
        await dbConnect()
        const categories = await Category.find({}).sort({ order: 1 })
        return NextResponse.json(categories)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const { name } = await req.json()
        if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 })

        await dbConnect()
        const slug = name.toLowerCase().replace(/ /g, "-")

        // Check if exists
        const exists = await Category.findOne({ slug })
        if (exists) return NextResponse.json({ error: "Category already exists" }, { status: 400 })

        // Get max order
        const lastCategory = await Category.findOne().sort({ order: -1 })
        const order = lastCategory ? lastCategory.order + 1 : 0

        const category = await Category.create({ name, slug, order })
        return NextResponse.json(category)
    } catch (error) {
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { categories } = await req.json() // Array of { id, order }
        if (!Array.isArray(categories)) return NextResponse.json({ error: "Invalid data" }, { status: 400 })

        await dbConnect()
        const updates = categories.map(cat =>
            Category.findByIdAndUpdate(cat._id || cat.id, { order: cat.order })
        )
        await Promise.all(updates)

        return NextResponse.json({ message: "Order updated" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
    }
}
