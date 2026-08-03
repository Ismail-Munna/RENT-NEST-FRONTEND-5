"use server";

import { cookies } from "next/headers";

export const logout = async () => {
    let cookieStore;
    try {
        cookieStore = await cookies();
    } catch (e: any) {
        if (e.message?.includes("dynamic") || e.digest?.includes("DYNAMIC")) throw e;
        return;
    }
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
};