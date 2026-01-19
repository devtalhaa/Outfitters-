import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/lib/models/Order";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const total = await Order.countDocuments();
        const orders = await Order.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return NextResponse.json({
            orders,
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
    let data;
    try {
        await dbConnect();
        data = await req.json();

        // Validate COD
        if (data.paymentMethod !== "COD") {
            return NextResponse.json({ error: "Only Cash on Delivery is supported" }, { status: 400 });
        }

        const order = await Order.create(data);
        return NextResponse.json(order, { status: 201 });
    } catch (error: any) {
        console.error("Order creation error:", error);
        if (data) console.error("Request data:", data);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
