import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            );
        }

        const { action, ...payload } = body;
        const endpoint = action === "confirm" ? "/api/payments/confirm" : "/api/payments/create";

        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                Cookie: `accessToken=${accessToken}`,
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error: any) {
        console.error("[payments-proxy] Fetch error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Payment process failed" },
            { status: 500 }
        );
    }
}
