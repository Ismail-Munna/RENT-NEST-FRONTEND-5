import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

async function getAccessToken(request: Request): Promise<string | null> {
    const cookieStore = await cookies();
    let token = cookieStore.get("accessToken")?.value;

    if (!token) {
        const authHeader = request.headers.get("authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }
    }

    if (!token) {
        const rawCookies = request.headers.get("cookie");
        if (rawCookies) {
            const match = rawCookies.match(/accessToken=([^;]+)/);
            if (match) token = match[1];
        }
    }

    return token || null;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const accessToken = await getAccessToken(request);

        if (!accessToken) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            );
        }

        const res = await fetch(`${API_BASE_URL}/api/landlord/properties`, {
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
        console.error("[landlord-proxy POST] Fetch error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to create property" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const accessToken = await getAccessToken(request);

        if (!accessToken) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            );
        }

        const { requestId, status } = body;
        const res = await fetch(`${API_BASE_URL}/api/landlord/requests/${requestId}`, {
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
        console.error("[landlord-proxy PATCH] Fetch error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to update request status" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Property ID required" },
                { status: 400 }
            );
        }

        const accessToken = await getAccessToken(request);

        if (!accessToken) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            );
        }

        const res = await fetch(`${API_BASE_URL}/api/landlord/properties/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                Cookie: `accessToken=${accessToken}`,
            },
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error: any) {
        console.error("[landlord-proxy DELETE] Fetch error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to delete property" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Property ID required" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const accessToken = await getAccessToken(request);

        if (!accessToken) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            );
        }

        const res = await fetch(`${API_BASE_URL}/api/landlord/properties/${id}`, {
            method: "PUT",
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
        console.error("[landlord-proxy PUT] Fetch error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to update property" },
            { status: 500 }
        );
    }
}
