import { PropertyCard } from "@/components/shared/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IProperty } from "@/lib/types";
import { Building, MapPin, Search, Shield, Sparkles, CheckCircle2, Key } from "lucide-react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";

async function getFeaturedProperties(): Promise<IProperty[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/api/properties`, {
            cache: "no-store",
        });

        if (!res.ok) return [];

        const json = await res.json();
        let propertiesData = json?.data;

        if (propertiesData && !Array.isArray(propertiesData) && Array.isArray(propertiesData.properties)) {
            propertiesData = propertiesData.properties;
        }

        return Array.isArray(propertiesData) ? propertiesData : [];
    } catch {
        return [];
    }
}

export default async function HomePage() {
    const rawProperties = await getFeaturedProperties();
    const properties = Array.isArray(rawProperties) ? rawProperties : [];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 text-white py-24 px-4 sm:px-6 lg:px-8">
                <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-15"></div>

                <div className="relative max-w-5xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
                        <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                        Modern Rental Property Marketplace
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
                        Find Your Perfect Next <br className="hidden sm:inline" />
                        <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
                            Home with Confidence
                        </span>
                    </h1>

                    <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                        Explore verified rental listings, connect directly with landlords, and manage transparent rental requests seamlessly.
                    </p>

                    {/* Quick Search Bar Form */}
                    <form action="/properties" method="GET" className="max-w-3xl mx-auto mt-8 p-3 rounded-2xl bg-white/10 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col sm:flex-row items-center gap-3">
                        <div className="relative flex-1 w-full">
                            <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                            <Input
                                name="city"
                                placeholder="Enter city (e.g. New York, Miami)..."
                                className="pl-10 h-11 bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-white border-0 focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
                            />
                        </div>
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full sm:w-auto h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 rounded-xl shadow-lg cursor-pointer transition-all"
                        >
                            <Search className="h-4 w-4 mr-2" /> Search Now
                        </Button>
                    </form>

                    <div className="flex flex-wrap justify-center items-center gap-6 pt-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Verified Landlords</span>
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Secure Online Payment</span>
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Instant Rental Requests</span>
                    </div>
                </div>
            </section>

            {/* Featured Properties Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            Discover Rentals
                        </span>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                            Featured Available Properties
                        </h2>
                    </div>
                    <Link href="/properties">
                        <Button variant="outline" className="font-semibold cursor-pointer border-slate-300 dark:border-slate-700">
                            View All Properties &rarr;
                        </Button>
                    </Link>
                </div>

                {!Array.isArray(properties) || properties.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                        <Building className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">No properties available yet</h3>
                        <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                            Be the first landlord to list a home or check back soon for fresh rental listings!
                        </p>
                        <Link href="/properties">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                                Explore All Listings
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {properties.slice(0, 6).map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                )}
            </section>

            {/* Features Highlight */}
            <section className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Why Renters & Landlords Choose RentNest
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                            Designed to streamline every step of the rental experience with modern security and real-time management.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                                <Search className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Smart Search & Filters</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                Filter by city, location, price ranges, and property categories to find your ideal home fast.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                                <Key className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Direct Rental Requests</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                Submit rental applications directly to property owners and track status updates live.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                                <Shield className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Integrated Payments</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                Complete booking payments securely using Stripe or SSLCommerz with instant confirmation.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
