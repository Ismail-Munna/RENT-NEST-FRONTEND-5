import { ISidebarItem } from "@/lib/types";
import { Building, FileText, LayoutDashboard, Shield, Users, Layers } from "lucide-react";

const TENANT_SIDEBAR_ITEMS: ISidebarItem[] = [
    {
        label: "My Rental Requests",
        href: "/dashboard/tenant",
        icon: FileText,
    },
];

const LANDLORD_SIDEBAR_ITEMS: ISidebarItem[] = [
    {
        label: "My Properties & Requests",
        href: "/dashboard/landlord",
        icon: Building,
    },
];

const ADMIN_SIDEBAR_ITEMS: ISidebarItem[] = [
    {
        label: "Admin Moderation",
        href: "/dashboard/admin",
        icon: Shield,
    },
];

export const sidebarMenuItems = {
    TENANT: TENANT_SIDEBAR_ITEMS,
    LANDLORD: LANDLORD_SIDEBAR_ITEMS,
    ADMIN: ADMIN_SIDEBAR_ITEMS,
};