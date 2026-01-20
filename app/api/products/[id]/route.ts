import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import cloudinary from "@/lib/cloudinary";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const formData = await req.formData();

        const updateData: any = {};
        if (formData.has("name")) {
            updateData.name = formData.get("name");
            updateData.slug = (updateData.name as string).toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
        }
        if (formData.has("price")) updateData.price = parseFloat(formData.get("price") as string);
        if (formData.has("originalPrice")) updateData.originalPrice = parseFloat(formData.get("originalPrice") as string);
        if (formData.has("description")) updateData.description = formData.get("description");
        if (formData.has("category")) updateData.category = formData.get("category");
        if (formData.has("articleCode")) updateData.articleCode = formData.get("articleCode");
        if (formData.has("colors")) updateData.colors = JSON.parse(formData.get("colors") as string);
        if (formData.has("sizes")) updateData.sizes = JSON.parse(formData.get("sizes") as string);

        const newImages = formData.getAll("newImages") as File[];
        const existingImages = JSON.parse((formData.get("existingImages") as string) || "[]");

        const imageUrls = [...existingImages];

        for (const file of newImages) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadResponse: any = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "outfitters" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });
            imageUrls.push(uploadResponse.secure_url);
        }

        if (imageUrls.length > 0) {
            updateData.images = imageUrls;
        }

        if (formData.has("sizeChart")) {
            const sizeChartFile = formData.get("sizeChart") as File;
            const arrayBuffer = await sizeChartFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const uploadResponse: any = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "outfitters/size-charts" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });
            updateData.sizeChart = uploadResponse.secure_url;
        }

        const product = await Product.findByIdAndUpdate(id, updateData, { new: true });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
