import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function PATCH(request: Request) {
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

        const { userId, status } = body;

        const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                Cookie: `accessToken=${accessToken}`,
            },
            body: JSON.stringify({ status }),
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error: any) {
        console.error("[admin-proxy PATCH] Fetch error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to update user status" },
            { status: 500 }
        );
    }
}

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

        const res = await fetch(`${API_BASE_URL}/api/admin/categories`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                Cookie: `accessToken=${accessToken}`,
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error: any) {
        console.error("[admin-proxy POST] Fetch error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to create category" },
            { status: 500 }
        );
    }
}
