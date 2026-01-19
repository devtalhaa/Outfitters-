import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Wishlist from "@/lib/models/Wishlist";
import Product from "@/lib/models/Product";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "UserId is required" }, { status: 400 });
        }

        let wishlist = await Wishlist.findOne({ userId }).populate("products");

        if (!wishlist) {
            wishlist = await Wishlist.create({ userId, products: [] });
        }

        return NextResponse.json(wishlist);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { userId, productId } = await req.json();

        if (!userId || !productId) {
            return NextResponse.json({ error: "UserId and ProductId are required" }, { status: 400 });
        }

        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            wishlist = await Wishlist.create({ userId, products: [productId] });
        } else {
            const index = wishlist.products.indexOf(productId);
            if (index > -1) {
                // Remove if already exists (toggle off)
                wishlist.products.splice(index, 1);
            } else {
                // Add if it doesn't exist (toggle on)
                wishlist.products.push(productId);
            }
            await wishlist.save();
        }

        // Return populated wishlist
        const updatedWishlist = await Wishlist.findOne({ userId }).populate("products");
        return NextResponse.json(updatedWishlist);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
