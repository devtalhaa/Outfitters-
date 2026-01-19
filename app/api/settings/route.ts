import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Settings from "@/lib/models/Settings";

export async function GET() {
    try {
        await dbConnect();
        const settings = await Settings.find({});
        const settingsMap = settings.reduce((acc: any, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        // Default values if not set
        if (!settingsMap.shippingCost) {
            settingsMap.shippingCost = 250;
        }

        return NextResponse.json(settingsMap);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const data = await req.json();
        const { key, value } = data;

        if (!key) {
            return NextResponse.json({ error: "Key is required" }, { status: 400 });
        }

        const setting = await Settings.findOneAndUpdate(
            { key },
            { value },
            { upsert: true, new: true }
        );

        return NextResponse.json(setting);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
