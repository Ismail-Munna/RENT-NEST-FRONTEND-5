import { NextResponse, type NextRequest } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function GET(request: NextRequest) {
    // Accessing nextUrl.searchParams triggers a dynamic bailout during static generation.
    // We must call it outside of try/catch so Next.js can intercept the bailout exception.
    const searchParams = request.nextUrl.searchParams;
    const res = await fetch(`${API_BASE_URL}/api/properties?${searchParams.toString()}`, {
        cache: "no-store",
    });

    try {

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
