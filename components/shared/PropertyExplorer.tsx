"use client";

import { useState } from "react";
import { usePropertiesQuery, QueryFilters } from "@/hooks/usePropertiesQuery";
import { PropertyCard } from "@/components/shared/PropertyCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    Search, 
    Filter, 
    SlidersHorizontal, 
    X, 
    AlertTriangle, 
    RotateCcw, 
    Home, 
    TrendingUp, 
    DollarSign,
    RefreshCw
} from "lucide-react";

export function PropertyExplorer() {
    const [filters, setFilters] = useState<QueryFilters>({
        search: "",
        categoryId: "",
        status: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "newest",
    });

    const [showAdvanced, setShowAdvanced] = useState(false);

    // Call the query hook
    const { properties, categories, isLoading, isRefetching, error, refetch } = usePropertiesQuery(filters);

    const handleFilterChange = (key: keyof QueryFilters, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const resetFilters = () => {
        setFilters({
            search: "",
            categoryId: "",
            status: "",
            minPrice: "",
            maxPrice: "",
            sortBy: "newest",
        });
    };

    const hasActiveFilters = 
        filters.search !== "" || 
        filters.categoryId !== "" || 
        filters.status !== "" || 
        filters.minPrice !== "" || 
        filters.maxPrice !== "";

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8" role="region" aria-label="Rental Property Explorer">
            {/* Search & Filter Control Panel */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm space-y-4">
                
                {/* Search Bar + Basic Actions */}
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                        <Input
                            type="text"
                            placeholder="Search by title, location, city..."
                            value={filters.search || ""}
                            onChange={(e) => handleFilterChange("search", e.target.value)}
                            className="pl-10 h-11 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl w-full"
                            aria-label="Search properties"
                        />
                        {filters.search && (
                            <button
                                onClick={() => handleFilterChange("search", "")}
                                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                                aria-label="Clear search query"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <Button
                            variant="outline"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className={`h-11 rounded-xl px-4 flex items-center gap-2 cursor-pointer font-medium text-sm flex-1 md:flex-initial transition-all duration-200 ${
                                showAdvanced 
                                    ? "bg-blue-50/80 border-blue-200 text-blue-600 dark:bg-blue-950/20 dark:border-blue-900/50 dark:text-blue-400" 
                                    : "border-slate-200 dark:border-slate-800"
                            }`}
                            aria-expanded={showAdvanced}
                            aria-controls="advanced-filter-panel"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            <span>Filters</span>
                            {hasActiveFilters && (
                                <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                            )}
                        </Button>

                        <div className="flex-1 md:flex-initial">
                            <label htmlFor="sortBy-select" className="sr-only">Sort properties</label>
                            <select
                                id="sortBy-select"
                                value={filters.sortBy || "newest"}
                                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                                className="h-11 w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 rounded-xl px-4 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                                <option value="newest">Newest Listed</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Collapsible Advanced Filters */}
                {showAdvanced && (
                    <div 
                        id="advanced-filter-panel" 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 transition-all duration-300 ease-in-out"
                    >
                        {/* Category Filter */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                                <Home className="h-3.5 w-3.5" /> Category
                            </label>
                            <select
                                value={filters.categoryId || ""}
                                onChange={(e) => handleFilterChange("categoryId", e.target.value)}
                                className="h-10 w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                                <TrendingUp className="h-3.5 w-3.5" /> Status
                            </label>
                            <select
                                value={filters.status || ""}
                                onChange={(e) => handleFilterChange("status", e.target.value)}
                                className="h-10 w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                                <option value="">All Statuses</option>
                                <option value="AVAILABLE">Available</option>
                                <option value="BOOKED">Booked</option>
                                <option value="UNAVAILABLE">Unavailable</option>
                            </select>
                        </div>

                        {/* Min Price Filter */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                                <DollarSign className="h-3.5 w-3.5" /> Min Price
                            </label>
                            <input
                                type="number"
                                placeholder="Min Price"
                                value={filters.minPrice || ""}
                                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                                className="h-10 w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Max Price Filter */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                                <DollarSign className="h-3.5 w-3.5" /> Max Price
                            </label>
                            <input
                                type="number"
                                placeholder="Max Price"
                                value={filters.maxPrice || ""}
                                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                                className="h-10 w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                )}

                {/* Active Filter Badges */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Active filters:</span>
                        {filters.search && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-full">
                                Search: {filters.search}
                                <button onClick={() => handleFilterChange("search", "")} aria-label="Remove search filter" className="cursor-pointer hover:text-slate-950 dark:hover:text-white">
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                        {filters.categoryId && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-full">
                                Category: {categories.find(c => c.id === filters.categoryId)?.name || "Selected"}
                                <button onClick={() => handleFilterChange("categoryId", "")} aria-label="Remove category filter" className="cursor-pointer hover:text-slate-950 dark:hover:text-white">
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                        {filters.status && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-full">
                                Status: {filters.status}
                                <button onClick={() => handleFilterChange("status", "")} aria-label="Remove status filter" className="cursor-pointer hover:text-slate-950 dark:hover:text-white">
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                        {(filters.minPrice || filters.maxPrice) && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-full">
                                Price: ${filters.minPrice || "0"} - ${filters.maxPrice || "∞"}
                                <button onClick={() => { handleFilterChange("minPrice", ""); handleFilterChange("maxPrice", ""); }} aria-label="Remove price filters" className="cursor-pointer hover:text-slate-950 dark:hover:text-white">
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                        <Button 
                            variant="ghost" 
                            size="xs" 
                            onClick={resetFilters}
                            className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer h-7 px-2 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 rounded-lg text-xs"
                        >
                            Reset All
                        </Button>
                    </div>
                )}
            </div>

            {/* Content Results Panel */}
            <div aria-busy={isLoading || isRefetching} aria-live="polite">
                {/* 1. Loading Skeleton Grid */}
                {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
                                <Skeleton className="h-48 w-full rounded-lg" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between gap-3">
                                    <Skeleton className="h-8 w-1/4" />
                                    <Skeleton className="h-8 w-1/4" />
                                    <Skeleton className="h-8 w-1/4" />
                                </div>
                                <Skeleton className="h-9 w-full rounded-lg" />
                            </div>
                        ))}
                    </div>
                )}

                {/* 2. Error Message Alert State */}
                {!isLoading && error && (
                    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 text-center max-w-xl mx-auto space-y-4 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                        <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-500 mx-auto" />
                        <div className="space-y-1">
                            <h3 className="font-bold text-lg text-red-900 dark:text-red-300">Could Not Fetch Properties</h3>
                            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                        </div>
                        <div className="pt-2">
                            <Button 
                                onClick={refetch}
                                className="bg-red-600 hover:bg-red-500 text-white font-medium px-6 py-2 rounded-xl shadow-lg flex items-center gap-2 mx-auto cursor-pointer transition-all duration-200"
                            >
                                <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
                                Retry Connection
                            </Button>
                        </div>
                    </div>
                )}

                {/* 3. Empty Results State */}
                {!isLoading && !error && properties.length === 0 && (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center max-w-md mx-auto space-y-4 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                            <Search className="h-8 w-8" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">No properties found</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                We couldn't find any listings matching your current filter selections.
                            </p>
                        </div>
                        {hasActiveFilters && (
                            <div className="pt-2">
                                <Button 
                                    onClick={resetFilters} 
                                    variant="outline" 
                                    className="border-slate-200 dark:border-slate-800 rounded-xl px-5 py-2 font-medium cursor-pointer text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 mx-auto"
                                >
                                    <RotateCcw className="h-4 w-4" /> Reset Filters
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* 4. Active Property Grid Listing */}
                {!isLoading && !error && properties.length > 0 && (
                    <div className="space-y-6">
                        {isRefetching && (
                            <div className="flex justify-center items-center gap-2 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/30 rounded-lg max-w-max mx-auto px-4 shadow-sm animate-pulse">
                                <RefreshCw className="h-3 w-3 animate-spin" /> Updating listings...
                            </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            {properties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
