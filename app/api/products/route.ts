import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import cloudinary from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const size = searchParams.get("size");
        const color = searchParams.get("color");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const sort = searchParams.get("sort");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "8");
        const skip = (page - 1) * limit;

        const query: any = {};

        if (category && category !== "All Footwear") {
            query.category = category;
        }

        if (size) {
            query["sizes.value"] = size;
        }

        if (color) {
            query["colors.name"] = color;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        const total = await Product.countDocuments(query);
        let productsQuery = Product.find(query);

        if (sort) {
            switch (sort) {
                case "price-asc":
                    productsQuery = productsQuery.sort({ price: 1 });
                    break;
                case "price-desc":
                    productsQuery = productsQuery.sort({ price: -1 });
                    break;
                case "newest":
                    productsQuery = productsQuery.sort({ createdAt: -1 });
                    break;
                default:
                    productsQuery = productsQuery.sort({ createdAt: -1 });
            }
        } else {
            productsQuery = productsQuery.sort({ createdAt: -1 });
        }

        const products = await productsQuery.skip(skip).limit(limit);

        return NextResponse.json({
            products,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const formData = await req.formData();

        const name = formData.get("name") as string;
        const price = parseFloat(formData.get("price") as string);
        const originalPrice = formData.get("originalPrice") ? parseFloat(formData.get("originalPrice") as string) : undefined;
        const description = formData.get("description") as string;
        const category = formData.get("category") as string;
        const articleCode = formData.get("articleCode") as string;
        const colors = JSON.parse(formData.get("colors") as string);
        const sizes = JSON.parse(formData.get("sizes") as string);
        const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

        // Handle Size Chart
        let sizeChartUrl = undefined;
        const sizeChartFile = formData.get("sizeChart") as File | null;
        if (sizeChartFile) {
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
            sizeChartUrl = uploadResponse.secure_url;
        }

        const imageFiles = formData.getAll("images") as File[];
        const imageUrls: string[] = [];

        for (const file of imageFiles) {
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

        const product = await Product.create({
            name,
            slug,
            price,
            originalPrice,
            description,
            category,
            articleCode,
            colors,
            sizes,
            images: imageUrls,
            sizeChart: sizeChartUrl,
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        console.error("Product creation error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
