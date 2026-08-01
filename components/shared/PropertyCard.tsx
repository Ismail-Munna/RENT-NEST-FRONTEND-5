"use client";

import { useState, useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IProperty } from "@/lib/types";
import { Bath, Bed, MapPin, Maximize2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PropertyCardProps {
    property: IProperty;
}

export function PropertyCard({ property }: PropertyCardProps) {
    const fallbackImage = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000&auto=format&fit=crop";

    const imagesList = Array.isArray(property?.images) ? property.images : [];
    const defaultImage =
        imagesList.length > 0 && typeof imagesList[0] === "string" && imagesList[0].trim() !== ""
            ? imagesList[0]
            : fallbackImage;

    const [imgSrc, setImgSrc] = useState(defaultImage);

    useEffect(() => {
        setImgSrc(defaultImage);
    }, [defaultImage]);

    const priceDisplay = property?.price != null ? property.price.toLocaleString() : "N/A";
    const statusText = property?.status ?? "AVAILABLE";

    return (
        <Card className="group overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            {/* Image & Status Badge */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                    src={imgSrc}
                    alt={property?.title ?? "Property photo"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={() => {
                        if (imgSrc !== fallbackImage) {
                            setImgSrc(fallbackImage);
                        }
                    }}
                />
                <div className="absolute top-3 left-3 flex gap-2">
                    <Badge
                        className={`text-xs font-semibold px-2.5 py-1 ${
                            statusText === "AVAILABLE"
                                ? "bg-emerald-500 text-white"
                                : statusText === "BOOKED"
                                ? "bg-amber-500 text-white"
                                : "bg-slate-500 text-white"
                        }`}
                    >
                        {statusText}
                    </Badge>
                    {property?.category?.name && (
                        <Badge variant="secondary" className="bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 backdrop-blur">
                            {property.category.name}
                        </Badge>
                    )}
                </div>
                <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur text-white px-3 py-1 rounded-lg text-sm font-bold shadow">
                    ${priceDisplay} <span className="text-xs font-normal text-slate-300">/ mo</span>
                </div>
            </div>

            {/* Property Body */}
            <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                    <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium mb-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{property?.location ?? "Location"}, {property?.city ?? "City"}</span>
                    </div>

                    <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors mb-2">
                        {property?.title ?? "Property Listing"}
                    </h3>

                    {property?.description && (
                        <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mb-4">
                            {property.description}
                        </p>
                    )}
                </div>

                {/* Meta Specs */}
                <div>
                    <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium mb-4">
                        <div className="flex items-center gap-1.5">
                            <Bed className="h-4 w-4 text-slate-400" />
                            <span>{property?.bedrooms ?? 0} Beds</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Bath className="h-4 w-4 text-slate-400" />
                            <span>{property?.bathrooms ?? 0} Baths</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Maximize2 className="h-4 w-4 text-slate-400" />
                            <span>{property?.areaSqft ? `${property.areaSqft} sqft` : "N/A"}</span>
                        </div>
                    </div>

                    <Link href={`/properties/${property?.id ?? ""}`} className="w-full">
                        <Button className="w-full bg-slate-900 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 text-white font-medium text-xs shadow transition-colors cursor-pointer">
                            View Details
                        </Button>
                    </Link>
                </div>
            </div>
        </Card>
    );
}
