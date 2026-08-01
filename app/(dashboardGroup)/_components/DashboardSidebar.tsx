"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ISidebarItem, NavbarProps } from "@/lib/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarMenuItems } from "../_config/sidebarMenuItems";

export default function DashboardSidebar({ user }: NavbarProps) {
    const pathname = usePathname();

    const rawData = user?.data as any;
    const userInfo = rawData?.user || rawData?.profile || rawData;
    const role = userInfo?.role;

    let navItems: ISidebarItem[] = [];

    if (role === "TENANT") {
        navItems = sidebarMenuItems.TENANT;
    } else if (role === "LANDLORD") {
        navItems = sidebarMenuItems.LANDLORD;
    } else if (role === "ADMIN") {
        navItems = sidebarMenuItems.ADMIN;
    } else {
        navItems = sidebarMenuItems.TENANT;
    }

    const safeNavItems = Array.isArray(navItems) ? navItems : [];

    return (
        <Sidebar
            collapsible="none"
            className="w-64 min-h-screen border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        >
            <SidebarContent className="py-4">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {safeNavItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                                isActive
                                                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 font-semibold"
                                                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                            }`}
                                        >
                                            <Link href={item.href}>
                                                <Icon className="h-4 w-4" />
                                                <span>{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
