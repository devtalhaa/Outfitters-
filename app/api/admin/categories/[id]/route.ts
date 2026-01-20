import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Category from "@/lib/models/Category"

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id
        await dbConnect()
        await Category.findByIdAndDelete(id)
        return NextResponse.json({ message: "Category deleted" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
    }
}
