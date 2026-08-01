"use client";

import { PropertyExplorer } from "@/components/shared/PropertyExplorer";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PropertiesExplorerPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-10">
                
                {/* Hero Header Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-8 md:p-12 shadow-xl border border-white/10">
                    <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
                    
                    <div className="relative space-y-4 max-w-3xl">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur">
                            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                            Dynamic Live Search Grid
                        </div>
                        
                        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                            Interactive <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">Property Explorer</span>
                        </h1>
                        
                        <p className="text-base text-slate-300">
                            Search, sort, and filter real-time rental listings with live caching, debounced queries, loading skeletons, and interactive state triggers.
                        </p>
                    </div>
                </div>

                {/* Main Dynamic Component */}
                <main className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Listings</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Use the filters to find properties matching your requirements.
                            </p>
                        </div>
                        <Link 
                            href="/properties" 
                            className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                        >
                            View Server-Rendered Version <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>

                    <PropertyExplorer />
                </main>
            </div>
        </div>
    );
}
