"use server"

import { cookies } from "next/headers";

export const getSubscriptionStatus = async () => {
     const cookieStore = await cookies();
    
        const accessToken = cookieStore.get("accessToken")?.value || null;
    
        if(!accessToken){
            // throw new Error("User Not Logged In!");
    
            return {
                success : false,
                message : "User not logged in!"
            }
        }

    const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3000";
    const res = await fetch(`${backendUrl}/api/subscription/status`, {
        headers: {
            // Authorization : accessToken as unknown as string,
            // Authorization : `${accessToken}`,
            // Authorization : `Bearer ${accessToken}`

            Cookie: `accessToken=${accessToken}`
        }
    });

    const result = await res.json();

    return result;
}