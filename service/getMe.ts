"use server";

import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/config";

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

        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
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