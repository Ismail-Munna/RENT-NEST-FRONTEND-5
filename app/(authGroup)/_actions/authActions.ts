"use server";

import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.BACKEND_API_URL || "https://rent-nest-backend.vercel.app";

export type AuthState = {
    success?: boolean;
    statusCode?: number;
    message?: string;
    data?: any;
    error?: string;
};

export const loginAction = async (redirectTo: string, prevState: AuthState, formData: FormData): Promise<AuthState> => {
    const email = formData.get("email");
    const password = formData.get("password");

    const payload = { email, password };
    try {
        const loginEndpoint = `${BACKEND_URL}/api/auth/login`;
        console.log(`[loginAction] Attempting login fetch to: ${loginEndpoint}`);

        const res = await fetch(loginEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            cache: "no-store",
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`[loginAction] Backend HTTP error ${res.status}:`, errorText);
            try {
                const parsed = JSON.parse(errorText);
                return {
                    success: false,
                    message: parsed.message || `Backend returned status ${res.status}`,
                };
            } catch {
                return {
                    success: false,
                    message: `Backend returned status ${res.status}`,
                };
            }
        }

        const result = await res.json();

        if (result.success && result.data?.accessToken) {
            const cookieStore = await cookies();

            cookieStore.set("accessToken", result.data.accessToken, {
                httpOnly: true,
                path: "/",
                maxAge: 60 * 60 * 24,
                sameSite: "lax",
            });
            cookieStore.set("refreshToken", result.data.refreshToken || result.data.accessToken, {
                httpOnly: true,
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
                sameSite: "lax",
            });

            const decodedToken = jwt.decode(result.data.accessToken) as JwtPayload;
            const role = decodedToken?.role;

            if (redirectTo && typeof redirectTo === "string" && redirectTo.startsWith("/") && !redirectTo.startsWith("//")) {
                redirect(redirectTo);
            }

            if (role === "TENANT") {
                redirect("/dashboard/tenant");
            } else if (role === "LANDLORD") {
                redirect("/dashboard/landlord");
            } else if (role === "ADMIN") {
                redirect("/dashboard/admin");
            } else {
                redirect("/");
            }
        }

        return result;
    } catch (error: any) {
        if (error?.digest?.startsWith("NEXT_REDIRECT")) {
            throw error;
        }
        console.error("[loginAction] Fetch execution error:", error);
        return {
            success: false,
            message: error.message ? `Login failed: ${error.message}` : "Login request failed. Verify backend server is running on http://localhost:3000.",
        };
    }
};

export const registerAction = async (prevState: AuthState, formData: FormData): Promise<AuthState> => {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const phone = formData.get("phone");
    const role = formData.get("role") || "TENANT";

    const payload = { name, email, password, phone, role };
    try {
        const registerEndpoint = `${BACKEND_URL}/api/auth/register`;
        console.log(`[registerAction] Attempting register fetch to: ${registerEndpoint}`);

        const res = await fetch(registerEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            cache: "no-store",
        });

        const result = await res.json();

        if (result.success) {
            // Auto login after registration
            const loginRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                cache: "no-store",
            });
            const loginResult = await loginRes.json();

            if (loginResult.success && loginResult.data?.accessToken) {
                const cookieStore = await cookies();
                cookieStore.set("accessToken", loginResult.data.accessToken, {
                    httpOnly: true,
                    path: "/",
                    maxAge: 60 * 60 * 24,
                    sameSite: "lax",
                });

                if (role === "LANDLORD") {
                    redirect("/dashboard/landlord");
                } else if (role === "ADMIN") {
                    redirect("/dashboard/admin");
                } else {
                    redirect("/dashboard/tenant");
                }
            }
        }

        return result;
    } catch (error: any) {
        if (error?.digest?.startsWith("NEXT_REDIRECT")) {
            throw error;
        }
        console.error("[registerAction] Fetch execution error:", error);
        return {
            success: false,
            message: error.message ? `Registration failed: ${error.message}` : "Registration request failed.",
        };
    }
};