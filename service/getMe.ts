"use server";

import { cookies } from "next/headers";

export const getMe = async () => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value || null;

        if (!accessToken) {
            return {
                success: false,
                message: "User not logged in",
            };
        }

        const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3000";

        const res = await fetch(`${backendUrl}/api/auth/me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Cookie: `accessToken=${accessToken}`,
            },
            cache: "no-store",
        });

        if (!res.ok) {
            return {
                success: false,
                message: "Failed to fetch user profile",
            };
        }

        const result = await res.json();
        return result;
    } catch (error: any) {
        console.error("[getMe] Fetch error:", error);
        return {
            success: false,
            message: error.message || "An unexpected error occurred",
        };
    }
};