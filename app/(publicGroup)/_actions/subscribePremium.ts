"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const subscribePremium = async () => {
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
    const res = await fetch(`${backendUrl}/api/subscription/checkout`, {
            method : "POST",
            headers: {
                // Authorization : accessToken as unknown as string,
                // Authorization : `${accessToken}`,
                // Authorization : `Bearer ${accessToken}`
    
                Cookie: `accessToken=${accessToken}`
            }
        });
    
        const result = await res.json();
    
        if(result.success && result.data.paymentUrl){
            redirect(result.data.paymentUrl)
        }

        return result
}