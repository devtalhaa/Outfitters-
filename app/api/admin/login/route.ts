import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import Admin from "@/lib/models/Admin";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret_key_change_me"
);

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { password } = await req.json();

        // Check if any admin exists. If not, seed with the ENV password
        let admin = await Admin.findOne();
        if (!admin) {
            const defaultPassword = process.env.ADMIN_PASSWORD || "admin123";
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(defaultPassword, salt);
            admin = await Admin.create({ passwordHash: hashedPassword });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, admin.passwordHash);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        // Create JWT
        const token = await new SignJWT({ role: "admin", id: admin._id })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(JWT_SECRET);

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax", // Changed from 'strict' to 'lax' for better redirect compatibility
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        return NextResponse.json({ message: "Login successful" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
