"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IRentalRequest, RequestStatus } from "@/lib/types";
import { Check, X, Loader2, UserCheck, Inbox } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";

interface LandlordRequestTableProps {
    initialRequests: IRentalRequest[];
}

export function LandlordRequestTable({ initialRequests }: LandlordRequestTableProps) {
    const safeInitial = Array.isArray(initialRequests) ? initialRequests : [];
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // Optimistic UI state handler
    const [optimisticRequests, updateOptimisticRequests] = useOptimistic(
        safeInitial,
        (currentRequests, updated: { id: string; status: RequestStatus }) => {
            const list = Array.isArray(currentRequests) ? currentRequests : [];
            return list.map((req) =>
                req.id === updated.id ? { ...req, status: updated.status } : req
            );
        }
    );

    const requestsList = Array.isArray(optimisticRequests) ? optimisticRequests : [];

    const handleStatusUpdate = async (requestId: string, newStatus: RequestStatus) => {
        setUpdatingId(requestId);

        startTransition(() => {
            updateOptimisticRequests({ id: requestId, status: newStatus });
        });

        try {
            const res = await fetch("/api/landlord-proxy", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ requestId, status: newStatus }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success(`Request ${newStatus.toLowerCase()} successfully!`);
                router.refresh();
            } else {
                toast.error(data.message || "Failed to update request status.");
                router.refresh();
            }
        } catch (err: any) {
            toast.error(err.message || "Error updating request status.");
            router.refresh();
        } finally {
            setUpdatingId(null);
        }
    };

    if (requestsList.length === 0) {
        return (
            <div className="p-12 text-center text-slate-500">
                <Inbox className="h-10 w-10 mx-auto mb-2 text-slate-400" />
                <p className="font-medium text-sm">No rental applications received yet.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-900 text-xs font-semibold uppercase text-slate-500 border-b border-slate-100 dark:border-slate-800">
                    <tr>
                        <th className="p-4">Property</th>
                        <th className="p-4">Tenant</th>
                        <th className="p-4">Message</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Submitted Date</th>
                        <th className="p-4 text-right">Optimistic Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {requestsList.map((req) => {
                        const isThisUpdating = updatingId === req.id;
                        return (
                            <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                <td className="p-4 font-semibold text-slate-900 dark:text-white">
                                    {req.property?.title || "Property"}
                                    <div className="text-xs font-normal text-slate-400">
                                        ${req.property?.price?.toLocaleString()}/mo • {req.property?.city}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                                        <UserCheck className="h-3.5 w-3.5 text-blue-600" />
                                        {req.tenant?.name || "Tenant"}
                                    </div>
                                    <div className="text-xs text-slate-400">{req.tenant?.email}</div>
                                </td>
                                <td className="p-4 text-xs max-w-xs truncate">
                                    {req.message || "No custom message provided."}
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
                                <td className="p-4 text-right space-x-2">
                                    {req.status === "PENDING" ? (
                                        <div className="inline-flex gap-2">
                                            <Button
                                                size="xs"
                                                disabled={isThisUpdating}
                                                onClick={() => handleStatusUpdate(req.id, "APPROVED")}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow cursor-pointer gap-1"
                                            >
                                                {isThisUpdating ? (
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Check className="h-3.5 w-3.5" /> Approve
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                size="xs"
                                                variant="outline"
                                                disabled={isThisUpdating}
                                                onClick={() => handleStatusUpdate(req.id, "REJECTED")}
                                                className="border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 font-semibold text-xs cursor-pointer gap-1"
                                            >
                                                {isThisUpdating ? (
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                ) : (
                                                    <>
                                                        <X className="h-3.5 w-3.5" /> Reject
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">Decision Recorded</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
