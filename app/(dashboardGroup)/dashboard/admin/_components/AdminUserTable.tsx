"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IUser, UserStatus } from "@/lib/types";
import { Ban, CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface AdminUserTableProps {
    users: IUser[];
}

export function AdminUserTable({ users }: AdminUserTableProps) {
    const safeUsers = Array.isArray(users) ? users : [];
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const router = useRouter();

    const handleToggleStatus = async (userId: string, currentStatus: UserStatus) => {
        const newStatus: UserStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE";
        setUpdatingId(userId);

        try {
            const res = await fetch("/api/admin-proxy", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ userId, status: newStatus }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success(`User status updated to ${newStatus}`);
                router.refresh();
            } else {
                toast.error(data.message || "Failed to update user status.");
            }
        } catch (err: any) {
            toast.error(err.message || "Error toggling user status.");
        } finally {
            setUpdatingId(null);
        }
    };

    if (safeUsers.length === 0) {
        return (
            <div className="p-8 text-center text-slate-500">
                <ShieldAlert className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm">No registered users found.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-900 text-xs font-semibold uppercase text-slate-500 border-b border-slate-100 dark:border-slate-800">
                    <tr>
                        <th className="p-4">User</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Joined Date</th>
                        <th className="p-4 text-right">Moderation Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {safeUsers.map((user) => {
                        const isUpdating = updatingId === user.id;
                        return (
                            <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                <td className="p-4">
                                    <div className="font-semibold text-slate-900 dark:text-white">{user.name}</div>
                                    <div className="text-xs text-slate-400">{user.email}</div>
                                </td>
                                <td className="p-4">
                                    <Badge
                                        variant="outline"
                                        className={`text-xs font-semibold ${
                                            user.role === "ADMIN"
                                                ? "border-purple-300 text-purple-600 bg-purple-50"
                                                : user.role === "LANDLORD"
                                                ? "border-indigo-300 text-indigo-600 bg-indigo-50"
                                                : "border-blue-300 text-blue-600 bg-blue-50"
                                        }`}
                                    >
                                        {user.role}
                                    </Badge>
                                </td>
                                <td className="p-4">
                                    <Badge
                                        className={`text-xs font-semibold px-2.5 py-1 ${
                                            user.status === "ACTIVE"
                                                ? "bg-emerald-500 text-white"
                                                : "bg-red-500 text-white"
                                        }`}
                                    >
                                        {user.status}
                                    </Badge>
                                </td>
                                <td className="p-4 text-xs text-slate-400">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right">
                                    {user.role !== "ADMIN" && (
                                        <Button
                                            size="xs"
                                            variant={user.status === "ACTIVE" ? "destructive" : "outline"}
                                            disabled={isUpdating}
                                            onClick={() => handleToggleStatus(user.id, user.status)}
                                            className="font-semibold text-xs cursor-pointer gap-1"
                                        >
                                            {isUpdating ? (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : user.status === "ACTIVE" ? (
                                                <>
                                                    <Ban className="h-3.5 w-3.5" /> Ban User
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Unban User
                                                </>
                                            )}
                                        </Button>
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
