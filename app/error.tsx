"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400 mb-4 shadow-sm">
                <AlertTriangle className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Something went wrong!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6 text-sm">
                {error?.message || "An unexpected error occurred while loading this page. Please try again."}
            </p>
            <div className="flex items-center gap-4">
                <Button
                    onClick={() => reset()}
                    className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow cursor-pointer"
                >
                    <RefreshCw className="h-4 w-4" /> Try Again
                </Button>
                <Link href="/">
                    <Button variant="outline" className="gap-2 cursor-pointer">
                        <Home className="h-4 w-4" /> Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}
