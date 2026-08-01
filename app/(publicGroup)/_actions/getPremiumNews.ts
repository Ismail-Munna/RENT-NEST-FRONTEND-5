"use server"

import { cookies } from "next/headers";

export const getPremiumNews = async ({query } : { query?: { [key: string]: string | string[] | undefined } }) => {

    // Bad Approach
    // const searchTerm = `${search?.searchTerm ? `?searchTerm=${search.searchTerm}` : ""}`;

    const params = new URLSearchParams()

    if(query && query.searchTerm){
        params.set("searchTerm", query.searchTerm as string)
    }

    //  /premium?searchTerm=nextjs
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
    const res = await fetch(`${backendUrl}/api/premium?${params.toString()}`, {
        headers: {
            // Authorization : accessToken as unknown as string,
            // Authorization : `${accessToken}`,
            // Authorization : `Bearer ${accessToken}`

            Cookie: `accessToken=${accessToken}`
        },
        cache : "no-cache",
        next : {
            revalidate : 60 * 60 * 6,
            tags : ["premium-posts"]
        }
    });

    const result = await res.json();

    return result;
}