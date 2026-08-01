import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IRentalRequest } from "@/lib/types";
import { cookies } from "next/headers";
import { Building, CheckCircle2, Clock, FileText, XCircle } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";
import Link from "next/link";
import { TenantCheckoutButton } from "./_components/TenantCheckoutButton";

async function getMyRentalRequests(): Promise<IRentalRequest[]> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) return [];

        const res = await fetch(`${API_BASE_URL}/api/rentals`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Cookie: `accessToken=${accessToken}`,
            },
            cache: "no-store",
        });

        if (!res.ok) return [];
        const json = await res.json();
        let requestsData = json?.data;

        // Safely extract array if backend returns object-wrapped data
        if (requestsData && !Array.isArray(requestsData)) {
            if (Array.isArray(requestsData.rentalRequests)) {
                requestsData = requestsData.rentalRequests;
            } else if (Array.isArray(requestsData.requests)) {
                requestsData = requestsData.requests;
            } else if (Array.isArray(requestsData.rentals)) {
                requestsData = requestsData.rentals;
            } else if (Array.isArray(requestsData.result)) {
                requestsData = requestsData.result;
            }
        }

        return Array.isArray(requestsData) ? requestsData : [];
    } catch {
        return [];
    }
}

export default async function TenantDashboardPage() {
    const rawRequests = await getMyRentalRequests();
    const requests = Array.isArray(rawRequests) ? rawRequests : [];

    const totalRequests = requests.length;
    const pendingRequests = requests.filter((r) => r.status === "PENDING").length;
    const approvedRequests = requests.filter((r) => r.status === "APPROVED" || r.status === "ACTIVE").length;
    const rejectedRequests = requests.filter((r) => r.status === "REJECTED").length;

    return (
        <div className="p-6 md:p-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tenant Dashboard</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Track your rental applications, landlord responses, and payment checkout statuses.
                </p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-5 border-slate-200 dark:border-slate-800 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 font-medium">Total Requests</span>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{totalRequests}</h3>
                    </div>
                </Card>

                <Card className="p-5 border-slate-200 dark:border-slate-800 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 font-medium">Pending Review</span>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{pendingRequests}</h3>
                    </div>
                </Card>

                <Card className="p-5 border-slate-200 dark:border-slate-800 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 font-medium">Approved Requests</span>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{approvedRequests}</h3>
                    </div>
                </Card>

                <Card className="p-5 border-slate-200 dark:border-slate-800 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
                        <XCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 font-medium">Rejected</span>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{rejectedRequests}</h3>
                    </div>
                </Card>
            </div>

            {/* Rental Request History Table */}
            <Card className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="font-bold text-lg text-slate-900 dark:text-white">Rental Request History</h2>
                </div>

                {!Array.isArray(requests) || requests.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <Building className="h-10 w-10 mx-auto mb-2 text-slate-400" />
                        <p className="font-medium text-sm">You haven't submitted any rental requests yet.</p>
                        <Link href="/properties" className="text-blue-600 font-semibold text-xs hover:underline mt-2 inline-block">
                            Browse properties &rarr;
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                            <thead className="bg-slate-50 dark:bg-slate-900 text-xs font-semibold uppercase text-slate-500 border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="p-4">Property</th>
                                    <th className="p-4">Monthly Rent</th>
                                    <th className="p-4">Message</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4 text-right">Action / Payment</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {requests.map((req) => {
                                    const requestId = req?.id || (req as any)?._id;
                                    return (
                                        <tr key={requestId || Math.random()} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-semibold text-slate-900 dark:text-white">
                                                    {req.property?.title || "Property Listing"}
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    {req.property?.location}, {req.property?.city}
                                                </div>
                                            </td>
                                            <td className="p-4 font-bold text-slate-900 dark:text-white">
                                                ${req.property?.price?.toLocaleString() || "0"} / mo
                                            </td>
                                            <td className="p-4 text-xs max-w-xs truncate">
                                                {req.message || "No message provided."}
                                            </td>
                                            <td className="p-4">
                                                <Badge
                                                    className={`text-xs font-semibold px-2.5 py-1 ${
                                                        req.status === "APPROVED"
                                                            ? "bg-blue-500 text-white"
                                                            : req.status === "PENDING"
                                                            ? "bg-amber-500 text-white"
                                                            : req.status === "ACTIVE"
                                                            ? "bg-emerald-600 text-white"
                                                            : "bg-red-500 text-white"
                                                    }`}
                                                >
                                                    {req.status}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-xs text-slate-400">
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                {req.status === "APPROVED" ? (
                                                    <TenantCheckoutButton
                                                        rentalRequestId={requestId}
                                                        amount={req.property?.price || 500}
                                                    />
                                                ) : req.status === "ACTIVE" ? (
                                                    <div className="flex justify-end items-center gap-2">
                                                        <Badge className="bg-emerald-600 text-white font-semibold text-xs py-1 px-2.5">
                                                            Active
                                                        </Badge>
                                                        <Button size="xs" variant="outline" className="text-xs font-semibold">
                                                            Leave Review
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">
                                                        {req.status === "PENDING" ? "Awaiting Approval" : "Request Closed"}
                                                    </span>
                                                )}
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
