import { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtUtils } from "./utils/jwt";

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = ["/", "/properties", "/login", "/register"];

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const cookieStore = await cookies();
    let accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    let decodedAccessToken = accessToken
        ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET || "access-secret")
        : null;

    let userRole: string | null = null;

    if (!decodedAccessToken?.success) {
        cookieStore.delete("accessToken");
        accessToken = undefined;
    } else if (decodedAccessToken.data) {
        userRole = (decodedAccessToken.data as JwtPayload).role;
    }

    const isPublicRoute = PUBLIC_ROUTES.some(
        (route) => pathname === route || pathname.startsWith("/properties/")
    );
    const isAuthRoute = AUTH_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
    );

    // If user is logged in and visits login/register, redirect to their role dashboard
    if (accessToken && isAuthRoute) {
        if (userRole === "TENANT") {
            return NextResponse.redirect(new URL("/dashboard/tenant", request.url));
        } else if (userRole === "LANDLORD") {
            return NextResponse.redirect(new URL("/dashboard/landlord", request.url));
        } else if (userRole === "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard/admin", request.url));
        } else {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // Redirect /dashboard root to specific role dashboard
    if (pathname === "/dashboard") {
        if (userRole === "TENANT") {
            return NextResponse.redirect(new URL("/dashboard/tenant", request.url));
        } else if (userRole === "LANDLORD") {
            return NextResponse.redirect(new URL("/dashboard/landlord", request.url));
        } else if (userRole === "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard/admin", request.url));
        } else {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirectTo", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Protection for non-public routes when not logged in
    if (!accessToken && !isPublicRoute && !isAuthRoute) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Role-based protection for sub-dashboards
    if (pathname.startsWith("/dashboard/tenant") && userRole !== "TENANT") {
        return NextResponse.redirect(new URL("/", request.url));
    }
    if (pathname.startsWith("/dashboard/landlord") && userRole !== "LANDLORD") {
        return NextResponse.redirect(new URL("/", request.url));
    }
    if (pathname.startsWith("/dashboard/admin") && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$).*)",
    ],
};