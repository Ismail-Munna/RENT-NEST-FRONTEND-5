"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavbarProps } from "@/lib/types";
import { logout } from "@/service/logout";
import { Home, LayoutDashboard, LogOut, Search, Building } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";

const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Find Properties", href: "/properties", icon: Search },
];

export function Navbar({ user }: NavbarProps) {
    const router = useRouter();

    // Handle nested response format e.g. { data: { user: { role, name, email } } } or { data: { role, name, email } }
    const rawData = user?.data as any;
    const userInfo = rawData?.user || rawData?.profile || rawData;

    const userRole = userInfo?.role;
    const userName = userInfo?.name ?? "User";
    const userEmail = userInfo?.email ?? "";

    const dashboardPath =
        userRole === "ADMIN"
            ? "/dashboard/admin"
            : userRole === "LANDLORD"
            ? "/dashboard/landlord"
            : userRole === "TENANT"
            ? "/dashboard/tenant"
            : "/dashboard/tenant";

    const handleDashboardRedirect = () => {
        router.push(dashboardPath);
    };

    const handleLogout = async () => {
        await logout();
        toast.success("Logged out successfully");
        router.push("/login");
        router.refresh();
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-white">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md">
                            <Building className="h-5 w-5" />
                        </div>
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            RentNest
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center gap-6">
                        {Array.isArray(navItems) && navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* User Auth Section */}
                    {user?.success && userInfo ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow">
                                        {userName?.[0]?.toUpperCase() ?? "U"}
                                    </div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 p-2">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                            {userName}
                                        </p>
                                        <p className="text-xs text-slate-500 truncate">
                                            {userEmail}
                                        </p>
                                        <span className="inline-block w-max text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 mt-1">
                                            {userRole ?? "USER"}
                                        </span>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link href={dashboardPath} className="flex items-center w-full">
                                        <LayoutDashboard className="w-4 h-4 mr-2 text-blue-600" />
                                        <span>Dashboard</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 dark:text-red-400">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href="/login">
                                <Button variant="ghost" size="sm" className="font-medium cursor-pointer">
                                    Log In
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow cursor-pointer">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
