import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Slider from "@/lib/models/Slider";
import cloudinary from "@/lib/cloudinary";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const slider = await Slider.findById(id);
        if (!slider) {
            return NextResponse.json({ error: "Slider image not found" }, { status: 404 });
        }

        // Delete from Cloudinary
        if (slider.publicId) {
            await cloudinary.uploader.destroy(slider.publicId);
        }

        // Delete from MongoDB
        await Slider.findByIdAndDelete(id);

        return NextResponse.json({ message: "Slider image deleted successfully" });
    } catch (error: any) {
        console.error("Slider delete error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
