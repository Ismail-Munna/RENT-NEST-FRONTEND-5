import { Card } from "@/components/ui/card";
import { ICategory, IProperty, IRentalRequest, IUser } from "@/lib/types";
import { cookies } from "next/headers";
import { Building, FileText, Layers, Users } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";
import { AdminCategoryManager } from "./_components/AdminCategoryManager";
import { AdminDashboardTabs } from "./_components/AdminDashboardTabs";

async function getAdminData(): Promise<{
    users: IUser[];
    properties: IProperty[];
    rentals: IRentalRequest[];
    categories: ICategory[];
}> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return { users: [], properties: [], rentals: [], categories: [] };
        }

        const usersRes = await fetch(`${API_BASE_URL}/api/admin/users`, {
            headers: { Authorization: `Bearer ${accessToken}`, Cookie: `accessToken=${accessToken}` },
            cache: "no-store",
        });

        const propertiesRes = await fetch(`${API_BASE_URL}/api/admin/properties`, {
            headers: { Authorization: `Bearer ${accessToken}`, Cookie: `accessToken=${accessToken}` },
            cache: "no-store",
        });

        const rentalsRes = await fetch(`${API_BASE_URL}/api/admin/rentals`, {
            headers: { Authorization: `Bearer ${accessToken}`, Cookie: `accessToken=${accessToken}` },
            cache: "no-store",
        });

        const categoriesRes = await fetch(`${API_BASE_URL}/api/categories`, {
            cache: "no-store",
        });

        const usersJson = usersRes.ok ? await usersRes.json() : {};
        const propertiesJson = propertiesRes.ok ? await propertiesRes.json() : {};
        const rentalsJson = rentalsRes.ok ? await rentalsRes.json() : {};
        const categoriesJson = categoriesRes.ok ? await categoriesRes.json() : {};

        let uData = usersJson?.data;
        if (uData && !Array.isArray(uData)) {
            if (Array.isArray(uData.users)) uData = uData.users;
            else if (Array.isArray(uData.result)) uData = uData.result;
        }

        let pData = propertiesJson?.data;
        if (pData && !Array.isArray(pData)) {
            if (Array.isArray(pData.properties)) pData = pData.properties;
            else if (Array.isArray(pData.result)) pData = pData.result;
        }

        let rData = rentalsJson?.data;
        if (rData && !Array.isArray(rData)) {
            if (Array.isArray(rData.rentalRequests)) rData = rData.rentalRequests;
            else if (Array.isArray(rData.rentals)) rData = rData.rentals;
            else if (Array.isArray(rData.requests)) rData = rData.requests;
            else if (Array.isArray(rData.result)) rData = rData.result;
        }

        let cData = categoriesJson?.data;
        if (cData && !Array.isArray(cData)) {
            if (Array.isArray(cData.categories)) cData = cData.categories;
            else if (Array.isArray(cData.result)) cData = cData.result;
        }

        return {
            users: Array.isArray(uData) ? uData : [],
            properties: Array.isArray(pData) ? pData : [],
            rentals: Array.isArray(rData) ? rData : [],
            categories: Array.isArray(cData) ? cData : [],
        };
    } catch {
        return { users: [], properties: [], rentals: [], categories: [] };
    }
}

export default async function AdminDashboardPage() {
    const rawData = await getAdminData();
    const users = Array.isArray(rawData?.users) ? rawData.users : [];
    const properties = Array.isArray(rawData?.properties) ? rawData.properties : [];
    const rentals = Array.isArray(rawData?.rentals) ? rawData.rentals : [];
    const categories = Array.isArray(rawData?.categories) ? rawData.categories : [];

    const totalUsers = users.length;
    const totalProperties = properties.length;
    const totalRentals = rentals.length;

    return (
        <div className="p-6 md:p-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Moderation Dashboard</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Monitor global system stats, perform user ban/unban moderation, and manage categories.
                </p>
            </div>

            {/* Global Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-5 border-slate-200 dark:border-slate-800 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 font-medium">Registered Users</span>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{totalUsers}</h3>
                    </div>
                </Card>

                <Card className="p-5 border-slate-200 dark:border-slate-800 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                        <Building className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 font-medium">Global Listings</span>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{totalProperties}</h3>
                    </div>
                </Card>

                <Card className="p-5 border-slate-200 dark:border-slate-800 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 font-medium">Rental Applications</span>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{totalRentals}</h3>
                    </div>
                </Card>

                <Card className="p-5 border-slate-200 dark:border-slate-800 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                        <Layers className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 font-medium">Categories</span>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{categories.length}</h3>
                    </div>
                </Card>
            </div>

            {/* Moderation Section Tabs */}
            <AdminDashboardTabs users={users} properties={properties} rentals={rentals} />

            {/* Category Management */}
            <Card className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                        Property Categories Management
                    </h2>
                </div>
                <AdminCategoryManager categories={categories} />
            </Card>
        </div>
    );
}
