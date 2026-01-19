import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Review from "@/lib/models/Review";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
        return NextResponse.json(reviews);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const { productId, user, rating, content } = body;

        if (!productId || !user || !rating || !content) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const review = await Review.create({
            productId,
            user,
            rating,
            content,
            helpful: 0
        });

        return NextResponse.json(review, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const { reviewId } = body;

        if (!reviewId) {
            return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
        }

        const review = await Review.findByIdAndUpdate(reviewId, { $inc: { helpful: 1 } }, { new: true });
        return NextResponse.json(review);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
