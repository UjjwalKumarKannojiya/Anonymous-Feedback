import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NODE_ENV: process.env.NODE_ENV,
        NEXTAUTH_SECRET_SET: !!process.env.NEXTAUTH_SECRET,
        REACHED_FROM: "server-side-debug"
    });
}
