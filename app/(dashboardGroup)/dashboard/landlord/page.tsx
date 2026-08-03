import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { IProperty, IRentalRequest } from "@/lib/types";
import { cookies } from "next/headers";
import { Building, DollarSign, FileText, Home, Inbox } from "lucide-react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";
import { AddPropertyModal } from "./_components/AddPropertyModal";
import { LandlordPropertyActions } from "./_components/LandlordPropertyActions";
import { LandlordRequestTable } from "./_components/LandlordRequestTable";

async function getLandlordData(): Promise<{ properties: IProperty[]; requests: IRentalRequest[] }> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) return { properties: [], requests: [] };

        // Fetch landlord requests
        const requestsRes = await fetch(`${API_BASE_URL}/api/landlord/requests`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Cookie: `accessToken=${accessToken}`,
            },
            cache: "no-store",
        });

        // Fetch landlord's own properties (authenticated endpoint)
        const propertiesRes = await fetch(`${API_BASE_URL}/api/landlord/properties`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Cookie: `accessToken=${accessToken}`,
            },
            cache: "no-store",
        });

        const requestsJson = requestsRes.ok ? await requestsRes.json() : {};
        const propertiesJson = propertiesRes.ok ? await propertiesRes.json() : {};

        let reqData = requestsJson?.data;
        if (reqData && !Array.isArray(reqData)) {
            if (Array.isArray(reqData.requests)) reqData = reqData.requests;
            else if (Array.isArray(reqData.result)) reqData = reqData.result;
        }

        let propData = propertiesJson?.data;
        if (propData && !Array.isArray(propData)) {
            if (Array.isArray(propData.properties)) propData = propData.properties;
            else if (Array.isArray(propData.result)) propData = propData.result;
        }

        return {
            properties: Array.isArray(propData) ? propData : [],
            requests: Array.isArray(reqData) ? reqData : [],
        };
    } catch {
        return { properties: [], requests: [] };
    }
}

export default async function LandlordDashboardPage() {
    const rawData = await getLandlordData();
    const properties = Array.isArray(rawData?.properties) ? rawData.properties : [];
    const requests = Array.isArray(rawData?.requests) ? rawData.requests : [];

    const totalProperties = properties.length;
    const totalRequests = requests.length;
    const pendingRequests = requests.filter((r) => r.status === "PENDING").length;
    const estimatedMonthlyIncome = properties.reduce((acc, curr) => acc + (curr?.price || 0), 0);

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-8 bg-slate-50 dark:bg-slate-950 w-full max-w-full min-h-0 overflow-x-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="w-full">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold break-words px-4 sm:px-6 text-slate-900 dark:text-white">Landlord Dashboard</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 px-4 sm:px-6 break-words">
                        Manage your property listings, review incoming rental applications, and track earnings.
                    </p>
                </div>
                <AddPropertyModal />
            </div>

            {/* Overview Earnings & Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="flex flex-col items-center justify-center text-center p-4 border-slate-200 dark:border-slate-800 gap-4">
                    <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                        <Building className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 font-medium break-words">My Properties</span>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{totalProperties}</h3>
                    </div>
                </Card>

                <Card className="flex flex-col items-center justify-center text-center p-4 border-slate-200 dark:border-slate-800 gap-4">
                    <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 font-medium break-words">Total Applications</span>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{totalRequests}</h3>
                    </div>
                </Card>

                <Card className="flex flex-col items-center justify-center text-center p-4 border-slate-200 dark:border-slate-800 gap-4">
                    <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                        <Inbox className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 font-medium break-words">Pending Review</span>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{pendingRequests}</h3>
                    </div>
                </Card>

                <Card className="flex flex-col items-center justify-center text-center p-4 border-slate-200 dark:border-slate-800 gap-4">
                    <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                        <DollarSign className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 font-medium break-words">Est. Monthly Value</span>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                            ${estimatedMonthlyIncome.toLocaleString()}
                        </h3>
                    </div>
                </Card>
            </div>

            {/* Request Management Table */}
            <Card className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                            Rental Request Applications
                        </h2>
                        <p className="text-xs text-slate-500">
                            Approve or reject incoming tenant rental requests with instant live updates.
                        </p>
                    </div>
                </div>
                <LandlordRequestTable initialRequests={requests} />
            </Card>

            {/* Listed Properties Overview */}
            <Card className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                        My Listed Properties
                    </h2>
                </div>

                {!Array.isArray(properties) || properties.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <Home className="h-10 w-10 mx-auto mb-2 text-slate-400" />
                        <p className="font-medium text-sm">No properties listed yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 block md:table">
                            <thead className="bg-slate-50 dark:bg-slate-900 text-xs font-semibold uppercase text-slate-500 border-b border-slate-100 dark:border-slate-800 hidden md:table-header-group">
                                <tr>
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Location</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">Specs</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 w-full flex flex-col space-y-4 md:table-row-group md:space-y-0 p-4 md:p-0">
                                {properties.map((property) => {
                                    const propId = property?.id || (property as any)?._id;
                                    return (
                                        <tr key={propId || Math.random()} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors flex flex-col bg-white dark:bg-slate-900 border rounded-xl shadow-sm md:table-row md:border-0 md:shadow-none md:bg-transparent p-4 md:p-0">
                                            <td className="p-2 md:p-4 font-semibold text-slate-900 dark:text-white block md:table-cell">
                                                <Link href={`/properties/${propId}`} className="hover:underline text-blue-600 dark:text-blue-400">
                                                    {property?.title ?? "Property Listing"}
                                                </Link>
                                            </td>
                                            <td className="p-2 md:p-4 text-xs block md:table-cell">
                                                {property?.location ?? "Location"}, {property?.city ?? "City"}
                                            </td>
                                            <td className="p-2 md:p-4 font-bold text-slate-900 dark:text-white block md:table-cell">
                                                ${property?.price?.toLocaleString() || "0"} / mo
                                            </td>
                                            <td className="p-2 md:p-4 text-xs block md:table-cell">
                                                {property?.bedrooms ?? 0} bed • {property?.bathrooms ?? 0} bath • {property?.areaSqft ?? 0} sqft
                                            </td>
                                            <td className="p-2 md:p-4 block md:table-cell">
                                                <Badge
                                                    className={`text-xs font-semibold px-2.5 py-1 ${
                                                        property?.status === "AVAILABLE"
                                                            ? "bg-emerald-500 text-white"
                                                            : "bg-amber-500 text-white"
                                                    }`}
                                                >
                                                    {property?.status ?? "AVAILABLE"}
                                                </Badge>
                                            </td>
                                            <td className="p-2 md:p-4 text-right block md:table-cell">
                                                <LandlordPropertyActions propertyId={propId} property={property} />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
}
