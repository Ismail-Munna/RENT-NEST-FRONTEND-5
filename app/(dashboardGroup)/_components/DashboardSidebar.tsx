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
            className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0"
        >
            <SidebarContent className="py-2 lg:py-4 px-3 lg:px-2 overflow-x-auto lg:overflow-visible">
                <SidebarGroup className="p-0">
                    <SidebarGroupContent>
                        <SidebarMenu className="flex flex-row lg:flex-col gap-1.5 lg:gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 w-full min-w-0">
                            {safeNavItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <SidebarMenuItem key={item.href} className="shrink-0 lg:shrink">
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                                                isActive
                                                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 font-semibold"
                                                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                            }`}
                                        >
                                            <Link href={item.href}>
                                                <Icon className="h-4 w-4 shrink-0" />
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
