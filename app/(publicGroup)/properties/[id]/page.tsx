import { RentalRequestModal } from "@/components/shared/RentalRequestModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IProperty } from "@/lib/types";
import { getMe } from "@/service/getMe";
import { Bath, Bed, Building, CheckCircle2, MapPin, Maximize2 } from "lucide-react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";

interface PropertyDetailsProps {
    params: Promise<{
        id: string;
    }>;
}

async function getPropertyDetail(id: string): Promise<IProperty | null> {
    try {
        const res = await fetch(`${API_BASE_URL}/api/properties/${id}`, {
            cache: "no-store",
        });

        if (!res.ok) return null;
        const json = await res.json();
        let prop = json?.data;

        if (prop && typeof prop === "object" && !prop.id && prop.property) {
            prop = prop.property;
        }

        return prop || null;
    } catch {
        return null;
    }
}

export default async function PropertyDetailPage(props: PropertyDetailsProps) {
    const { id } = await props.params;
    const property = await getPropertyDetail(id);
    const userRes = await getMe();
    const currentUser = userRes?.data;

    if (!property) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950">
                <Building className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Property Not Found</h1>
                <p className="text-slate-500 text-sm max-w-sm mb-6">
                    The requested rental property could not be loaded or is no longer available.
                </p>
                <Link href="/properties">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                        &larr; Back to Properties
                    </Button>
                </Link>
            </div>
        );
    }

    const defaultImages =
        Array.isArray(property?.images) && property.images.length > 0
            ? property.images
            : ["https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop"];

    const priceDisplay = property?.price != null ? property.price.toLocaleString() : "N/A";
    const statusText = property?.status ?? "AVAILABLE";
    const amenitiesList = Array.isArray(property?.amenities) ? property.amenities : [];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Back Link */}
                <div>
                    <Link href="/properties" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        &larr; Back to all properties
                    </Link>
                </div>

                {/* Hero Title & Status */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge
                                className={`text-xs font-semibold px-2.5 py-1 ${
                                    statusText === "AVAILABLE"
                                        ? "bg-emerald-500 text-white"
                                        : "bg-amber-500 text-white"
                                }`}
                            >
                                {statusText}
                            </Badge>
                            {property?.category && (
                                <Badge variant="secondary">{property.category.name ?? "Category"}</Badge>
                            )}
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                            {property?.title ?? "Rental Listing"}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1 text-sm">
                            <MapPin className="h-4 w-4 text-blue-600" />
                            {property?.location ?? "Location"}, {property?.city ?? "City"}
                        </p>
                    </div>

                    <div className="text-left md:text-right">
                        <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
                            ${priceDisplay}
                        </span>
                        <span className="text-sm text-slate-500"> / month</span>
                    </div>
                </div>

                {/* Main Photo Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 h-96 rounded-2xl overflow-hidden bg-slate-200 shadow-md">
                        <img
                            src={defaultImages[0]}
                            alt={property?.title ?? "Property photo"}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="grid grid-rows-2 gap-4">
                        <div className="h-44 rounded-2xl overflow-hidden bg-slate-200 shadow-sm">
                            <img
                                src={defaultImages[1] || defaultImages[0]}
                                alt={property?.title ?? "Property photo"}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="h-44 rounded-2xl overflow-hidden bg-slate-200 shadow-sm">
                            <img
                                src={defaultImages[2] || defaultImages[0]}
                                alt={property?.title ?? "Property photo"}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Specs overview */}
                        <Card className="p-6 grid grid-cols-3 gap-4 text-center border-slate-200 dark:border-slate-800">
                            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                                <Bed className="h-6 w-6 text-blue-600 mb-1" />
                                <span className="text-lg font-bold">{property?.bedrooms ?? 0}</span>
                                <span className="text-xs text-slate-500">Bedrooms</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                                <Bath className="h-6 w-6 text-blue-600 mb-1" />
                                <span className="text-lg font-bold">{property?.bathrooms ?? 0}</span>
                                <span className="text-xs text-slate-500">Bathrooms</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                                <Maximize2 className="h-6 w-6 text-blue-600 mb-1" />
                                <span className="text-lg font-bold">{property?.areaSqft ?? "N/A"}</span>
                                <span className="text-xs text-slate-500">Square Feet</span>
                            </div>
                        </Card>

                        {/* Description */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-3">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">About Property</h3>
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                                {property?.description || "No description provided."}
                            </p>
                        </div>

                        {/* Amenities */}
                        {amenitiesList.length > 0 && (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Amenities & Features</h3>
                                <div className="flex flex-wrap gap-2.5">
                                    {amenitiesList.map((amenity, idx) => (
                                        <Badge
                                            key={idx}
                                            variant="secondary"
                                            className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 gap-1.5"
                                        >
                                            <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                                            {amenity}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar CTA & Landlord Card */}
                    <div className="space-y-6">
                        {/* Request CTA */}
                        <Card className="p-6 border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                            <div className="space-y-1">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Rent</span>
                                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                    ${priceDisplay} <span className="text-sm font-normal text-slate-500">/ mo</span>
                                </div>
                            </div>

                            {statusText === "AVAILABLE" ? (
                                <RentalRequestModal
                                    propertyId={property.id}
                                    propertyTitle={property.title ?? "Property"}
                                    user={currentUser}
                                />
                            ) : (
                                <div className="p-3 text-center bg-amber-50 text-amber-700 rounded-xl text-sm font-semibold border border-amber-200">
                                    This property is currently {statusText.toLowerCase()}.
                                </div>
                            )}

                            <p className="text-xs text-center text-slate-400">
                                No security deposit collected until your rental application is approved.
                            </p>
                        </Card>

                        {/* Landlord Info */}
                        {property?.landlord && (
                            <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-3">
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Listed By Landlord</h4>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                        {property.landlord.name?.[0]?.toUpperCase() || "L"}
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-sm text-slate-900 dark:text-white">
                                            {property.landlord.name ?? "Landlord"}
                                        </h5>
                                        <p className="text-xs text-slate-500">{property.landlord.email ?? ""}</p>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
