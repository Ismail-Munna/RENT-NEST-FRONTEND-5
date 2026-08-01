import { ISidebarItem } from "@/lib/types";
import { FileText, LayoutDashboard } from "lucide-react";

export const ADMIN_SIDEBAR_ITEMS: ISidebarItem[] = [
    {
        label : "Admin Dashboard",
        href : "/Admin-dashboard",
        icon : LayoutDashboard
    },
    {
        label : "My Posts",
        href : "/admin-dashboard/my-posts",
        icon : FileText
    },
]
