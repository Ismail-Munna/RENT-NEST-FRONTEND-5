"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ICategory } from "@/lib/types";
import { Plus, Layers, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface AdminCategoryManagerProps {
    categories: ICategory[];
}

export function AdminCategoryManager({ categories }: AdminCategoryManagerProps) {
    const safeCategories = Array.isArray(categories) ? categories : [];
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        setLoading(true);

        try {
            const res = await fetch("/api/admin-proxy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name: name.trim() }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Category created successfully.");
                setName("");
                router.refresh();
            } else {
                toast.error(data.message || "Failed to create category.");
            }
        } catch (err: any) {
            toast.error(err.message || "Error creating category.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-5 space-y-4">
            <form onSubmit={handleCreate} className="flex gap-2">
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="New category name (e.g. Studio, Villa, Duplex)..."
                    className="h-9 text-xs flex-1"
                    required
                />
                <Button type="submit" disabled={loading} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer text-xs gap-1">
                    {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                    Add Category
                </Button>
            </form>

            <div className="flex flex-wrap gap-2 pt-2">
                {safeCategories.length === 0 ? (
                    <span className="text-xs text-slate-400">No categories defined yet.</span>
                ) : (
                    safeCategories.map((cat) => (
                        <div
                            key={cat.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        >
                            <Layers className="h-3.5 w-3.5 text-blue-600" />
                            {cat.name}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
