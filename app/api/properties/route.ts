import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3000";

        const res = await fetch(`${backendUrl}/api/properties?${searchParams.toString()}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            return NextResponse.json({ success: false, data: [] }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        console.error("[properties-proxy GET] Fetch error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to fetch properties" },
            { status: 500 }
        );
    }
}
