"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IProperty, IRentalRequest, IUser } from "@/lib/types";
import { AdminUserTable } from "./AdminUserTable";
import { Shield, Building, FileText, Inbox, Eye, ExternalLink } from "lucide-react";
import Link from "next/link";

interface AdminDashboardTabsProps {
    users: IUser[];
    properties: IProperty[];
    rentals: IRentalRequest[];
}

type TabType = "users" | "properties" | "requests";

export function AdminDashboardTabs({ users, properties, rentals }: AdminDashboardTabsProps) {
    const [activeTab, setActiveTab] = useState<TabType>("users");

    const safeUsers = Array.isArray(users) ? users : [];
    const safeProperties = Array.isArray(properties) ? properties : [];
    const safeRentals = Array.isArray(rentals) ? rentals : [];

    return (
        <div className="space-y-6">
            {/* Tabs Selector Navigation */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto w-full">
                <button
                    onClick={() => setActiveTab("users")}
                    className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                        activeTab === "users"
                            ? "border-blue-600 text-blue-600 dark:text-blue-400"
                            : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                >
                    <Shield className="h-4 w-4" />
                    User Management ({safeUsers.length})
                </button>
                <button
                    onClick={() => setActiveTab("properties")}
                    className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                        activeTab === "properties"
                            ? "border-blue-600 text-blue-600 dark:text-blue-400"
                            : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                >
                    <Building className="h-4 w-4" />
                    All Properties ({safeProperties.length})
                </button>
                <button
                    onClick={() => setActiveTab("requests")}
                    className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                        activeTab === "requests"
                            ? "border-blue-600 text-blue-600 dark:text-blue-400"
                            : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                >
                    <FileText className="h-4 w-4" />
                    All Requests ({safeRentals.length})
                </button>
            </div>

            {/* Tab Contents */}
            {activeTab === "users" && (
                <Card className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div>
                            <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                <Shield className="h-5 w-5 text-purple-600" /> User Accounts & Moderation
                            </h2>
                            <p className="text-xs text-slate-500">
                                View registered tenants and landlords and manage active or banned account statuses.
                            </p>
                        </div>
                    </div>
                    <div className="overflow-x-auto w-full">
                        <AdminUserTable users={safeUsers} />
                    </div>
                </Card>
            )}

            {activeTab === "properties" && (
                <Card className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                            <Building className="h-5 w-5 text-blue-600" /> Platform Properties Listings
                        </h2>
                        <p className="text-xs text-slate-500">
                            Monitor all active property listings across RentNest.
                        </p>
                    </div>

                    {safeProperties.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <Inbox className="h-10 w-10 mx-auto mb-2 text-slate-400" />
                            <p className="font-medium text-sm">No properties listed yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 min-w-[700px]">
                                <thead className="bg-slate-50 dark:bg-slate-900 text-xs font-semibold uppercase text-slate-500 border-b border-slate-100 dark:border-slate-800">
                                    <tr>
                                        <th className="p-4">Title</th>
                                        <th className="p-4">Location</th>
                                        <th className="p-4">Price</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Landlord</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {safeProperties.map((property) => (
                                        <tr key={property?.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                            <td className="p-4 font-semibold text-slate-900 dark:text-white">
                                                <Link href={`/properties/${property?.id}`} className="hover:underline text-blue-600 dark:text-blue-400">
                                                    {property?.title ?? "Property"}
                                                </Link>
                                            </td>
                                            <td className="p-4 text-xs">
                                                {property?.location ?? "N/A"}, {property?.city ?? ""}
                                            </td>
                                            <td className="p-4 font-bold text-slate-900 dark:text-white">
                                                ${property?.price?.toLocaleString() ?? "0"} / mo
                                            </td>
                                            <td className="p-4">
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
                                            <td className="p-4">
                                                <div className="font-semibold text-slate-900 dark:text-white">
                                                    {property?.landlord?.name ?? "Landlord"}
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    {property?.landlord?.email ?? ""}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                {property?.id ? (
                                                    <Link href={`/properties/${property.id}`} target="_blank">
                                                        <Button size="xs" variant="outline" className="text-xs font-semibold gap-1 cursor-pointer">
                                                            <Eye className="h-3 w-3" /> View
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">No ID</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            )}

            {activeTab === "requests" && (
                <Card className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                            <FileText className="h-5 w-5 text-indigo-600" /> Platform Rental Requests
                        </h2>
                        <p className="text-xs text-slate-500">
                            Monitor incoming applications and status decisions.
                        </p>
                    </div>

                    {safeRentals.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <Inbox className="h-10 w-10 mx-auto mb-2 text-slate-400" />
                            <p className="font-medium text-sm">No requests submitted yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 min-w-[700px]">
                                <thead className="bg-slate-50 dark:bg-slate-900 text-xs font-semibold uppercase text-slate-500 border-b border-slate-100 dark:border-slate-800">
                                    <tr>
                                        <th className="p-4">Property Title</th>
                                        <th className="p-4">Tenant</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {safeRentals.map((rental) => (
                                        <tr key={rental?.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                            <td className="p-4 font-semibold text-slate-900 dark:text-white">
                                                {rental?.property?.title ?? "Property Not Found"}
                                            </td>
                                            <td className="p-4">
                                                <div className="font-semibold text-slate-900 dark:text-white">
                                                    {rental?.tenant?.name ?? "Tenant"}
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    {rental?.tenant?.email ?? ""}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge
                                                    className={`text-xs font-semibold px-2.5 py-1 ${
                                                        rental?.status === "APPROVED"
                                                            ? "bg-blue-500 text-white"
                                                            : rental?.status === "PENDING"
                                                            ? "bg-amber-500 text-white"
                                                            : rental?.status === "ACTIVE"
                                                            ? "bg-emerald-600 text-white"
                                                            : "bg-red-500 text-white"
                                                    }`}
                                                >
                                                    {rental?.status ?? "PENDING"}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-xs text-slate-400">
                                                {rental?.createdAt ? new Date(rental.createdAt).toLocaleDateString() : "N/A"}
                                            </td>
                                            <td className="p-4 text-right">
                                                {rental?.property?.id ? (
                                                    <Link href={`/properties/${rental.property.id}`} target="_blank">
                                                        <Button size="xs" variant="outline" className="text-xs font-semibold gap-1 cursor-pointer">
                                                            <ExternalLink className="h-3 w-3" /> View Property
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">No Property ID</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
}
