import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function GET() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/categories`, {
            cache: "no-store",
        });

        if (!res.ok) {
            return NextResponse.json({ success: false, data: [] }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        console.error("[categories-proxy GET] Fetch error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to fetch categories" },
            { status: 500 }
        );
    }
}
