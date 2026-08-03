/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from "jsonwebtoken";


const verifyToken = (token: string, secret: string) => {
    try {
        const verifiedToken = jwt.verify(token, secret);
        return {
            success: true,
            data: verifiedToken
        };
    } catch (error: any) {
        console.log("Token verification failed:", error);
        return {
            success: false,
            error: error.message
        }
    }
}


const decodeToken = (token: string) => {
    try {
        const decodedToken = jwt.decode(token);
        return {
            success: !!decodedToken,
            data: decodedToken
        };
    } catch (error: any) {
        console.log("Token decoding failed:", error);
        return {
            success: false,
            error: error.message
        }
    }
}


export const jwtUtils = {
    verifyToken,
    decodeToken
}