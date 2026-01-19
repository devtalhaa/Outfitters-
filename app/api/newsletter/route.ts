import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Newsletter from "@/lib/models/Newsletter";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { email } = await req.json();

        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 });
        }

        const existing = await Newsletter.findOne({ email });
        if (existing) {
            return NextResponse.json({ message: "You are already subscribed!" }, { status: 200 });
        }

        const subscription = await Newsletter.create({ email });
        return NextResponse.json({ message: "Subscription successful!", subscription }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const [subscribers, total] = await Promise.all([
            Newsletter.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Newsletter.countDocuments({})
        ]);

        return NextResponse.json({
            subscribers,
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

export async function DELETE(req: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Subscription ID is required" }, { status: 400 });
        }

        await Newsletter.findByIdAndDelete(id);
        return NextResponse.json({ message: "Subscriber removed" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
