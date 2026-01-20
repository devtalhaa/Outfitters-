import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Slider from "@/lib/models/Slider";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
    try {
        await dbConnect();
        const sliders = await Slider.find({}).sort({ order: 1 });
        return NextResponse.json(sliders);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const formData = await req.formData();
        const file = formData.get("image") as File;

        if (!file) {
            return NextResponse.json({ error: "No image file provided" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResponse: any = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: "outfitters/slider" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        // Get the current max order
        const maxSlider = await Slider.findOne({}).sort({ order: -1 });
        const nextOrder = maxSlider ? maxSlider.order + 1 : 0;

        const slider = await Slider.create({
            imageUrl: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
            order: nextOrder,
            isActive: true,
        });

        return NextResponse.json(slider, { status: 201 });
    } catch (error: any) {
        console.error("Slider upload error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await dbConnect();
        const { sliders } = await req.json(); // Array of { _id, order }

        if (!Array.isArray(sliders)) {
            return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
        }

        const updates = sliders.map((s: any) =>
            Slider.findByIdAndUpdate(s._id, { order: s.order })
        );

        await Promise.all(updates);

        return NextResponse.json({ message: "Orders updated successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
