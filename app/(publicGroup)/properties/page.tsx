"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { PropertyCard } from "@/components/shared/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ICategory, IProperty } from "@/lib/types";
import { Building, Filter, MapPin, RefreshCw, Search } from "lucide-react";

function PropertiesExplorer() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Local filter state initialized from searchParams
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [city, setCity] = useState(searchParams.get("city") || "");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [category, setCategory] = useState(searchParams.get("category") || searchParams.get("categoryId") || "");

    const [categories, setCategories] = useState<ICategory[]>([]);
    const [properties, setProperties] = useState<IProperty[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch categories once on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories");
                if (res.ok) {
                    const json = await res.json();
                    let categoryData = json?.data;
                    if (categoryData && !Array.isArray(categoryData) && Array.isArray(categoryData.categories)) {
                        categoryData = categoryData.categories;
                    }
                    if (Array.isArray(categoryData) && categoryData.length > 0) {
                        setCategories(categoryData);
                        return;
                    }
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
            // Predefined options fallback
            setCategories([
                { id: "Apartment", name: "Apartment" },
                { id: "Villa", name: "Villa" },
                { id: "House", name: "House" },
                { id: "Studio", name: "Studio" },
                { id: "Condo", name: "Condo" },
            ] as ICategory[]);
        };
        fetchCategories();
    }, []);

    // Sync state if URL search parameters change (e.g. on reset or back navigation)
    useEffect(() => {
        setSearch(searchParams.get("search") || "");
        setCity(searchParams.get("city") || "");
        setMinPrice(searchParams.get("minPrice") || "");
        setMaxPrice(searchParams.get("maxPrice") || "");
        setCategory(searchParams.get("category") || searchParams.get("categoryId") || "");
    }, [searchParams]);

    // Fetch properties whenever the searchParams change
    useEffect(() => {
        const fetchProperties = async () => {
            setIsLoading(true);
            try {
                const query = new URLSearchParams(searchParams.toString());
                const res = await fetch(`/api/properties?${query.toString()}`);
                if (res.ok) {
                    const json = await res.json();
                    let propertiesData = json?.data;

                    if (propertiesData && !Array.isArray(propertiesData) && Array.isArray(propertiesData.properties)) {
                        propertiesData = propertiesData.properties;
                    }
                    setProperties(Array.isArray(propertiesData) ? propertiesData : []);
                }
            } catch (err) {
                console.error("Failed to fetch properties:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProperties();
    }, [searchParams]);

    const handleApplyFilters = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (city) params.set("city", city);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        if (category) params.set("category", category);

        router.push(`${pathname}?${params.toString()}`);
    };

    const handleReset = () => {
        setSearch("");
        setCity("");
        setMinPrice("");
        setMaxPrice("");
        setCategory("");
        router.push(pathname);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Page Title Header */}
                <div className="mb-8 space-y-2">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Explore Available Properties
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Find rental properties tailored to your location, price, and amenity preferences.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Advanced Search & Filters Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                                <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-blue-600" /> Filters
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="xs"
                                    onClick={handleReset}
                                    className="text-xs text-slate-500 hover:text-blue-600 gap-1 cursor-pointer"
                                >
                                    <RefreshCw className="h-3 w-3" /> Reset
                                </Button>
                            </div>

                            <form onSubmit={handleApplyFilters} className="space-y-4">
                                {/* Search keyword */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">Search Keywords</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Title, location, address..."
                                            className="pl-9 h-9 text-xs"
                                        />
                                    </div>
                                </div>

                                {/* City */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">City</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            placeholder="e.g. New York"
                                            className="pl-9 h-9 text-xs"
                                        />
                                    </div>
                                </div>

                                {/* Category */}
                                {categories.length > 0 && (
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold">Property Category</Label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full h-9 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                        >
                                            <option value="">All Categories</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.name}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Price Range */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">Monthly Price ($)</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input
                                            type="number"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            placeholder="Min $"
                                            className="h-9 text-xs"
                                        />
                                        <Input
                                            type="number"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            placeholder="Max $"
                                            className="h-9 text-xs"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-9 text-xs shadow cursor-pointer transition-colors"
                                >
                                    Apply Filters
                                </Button>
                            </form>
                        </div>
                    </aside>

                    {/* Properties Grid Display */}
                    <main className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Showing <strong className="text-slate-900 dark:text-white">{isLoading ? "..." : properties.length}</strong> rental listings
                            </span>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="flex flex-col space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 shadow-sm">
                                        <Skeleton className="h-48 w-full rounded-lg" />
                                        <Skeleton className="h-4 w-2/3" />
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-8 w-full rounded-md mt-2" />
                                    </div>
                                ))}
                            </div>
                        ) : properties.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm">
                                <Building className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                                    No properties match your filter criteria
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mt-1 mb-6">
                                    Try expanding your search distance, adjusting the price sliders, or clearing selected categories.
                                </p>
                                <Button variant="outline" className="text-xs cursor-pointer" onClick={handleReset}>
                                    Clear All Filters
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {properties.map((property) => (
                                    <PropertyCard key={property.id} property={property} />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default function PropertiesPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
                <p className="text-slate-500">Loading Properties Explorer...</p>
            </div>
        }>
            <PropertiesExplorer />
        </Suspense>
    );
}
