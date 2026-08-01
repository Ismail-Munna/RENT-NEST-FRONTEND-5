"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Loader2, Pencil, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface LandlordPropertyActionsProps {
    propertyId?: string;
    property?: any;
}

export function LandlordPropertyActions({ propertyId, property }: LandlordPropertyActionsProps) {
    const [loading, setLoading] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const router = useRouter();

    const targetId = propertyId || property?.id || property?._id;
    const [status, setStatus] = useState(property?.status || "AVAILABLE");

    const [editFormData, setEditFormData] = useState({
        title: property?.title || "",
        description: property?.description || "",
        location: property?.location || "",
        city: property?.city || "",
        price: property?.price?.toString() || "",
        bedrooms: property?.bedrooms?.toString() || "",
        bathrooms: property?.bathrooms?.toString() || "",
        areaSqft: property?.areaSqft?.toString() || "",
        imageUrl: property?.images?.[0] || "",
        amenities: property?.amenities?.join(", ") || "",
    });

    const handleStatusToggle = async (newStatus: string) => {
        if (!targetId) {
            toast.error("Invalid property ID.");
            return;
        }
        setStatusLoading(true);
        try {
            const res = await fetch(`/api/landlord-proxy?id=${encodeURIComponent(targetId)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (data.success) {
                setStatus(newStatus);
                toast.success(`Property status updated to ${newStatus}.`);
                router.refresh();
            } else {
                toast.error(data.message || "Failed to update property status.");
            }
        } catch (err: any) {
            toast.error(err.message || "Error updating property status.");
        } finally {
            setStatusLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!targetId) {
            toast.error("Invalid property ID. Unable to delete.");
            return;
        }

        if (!confirm("Are you sure you want to delete this property listing?")) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/landlord-proxy?id=${encodeURIComponent(targetId)}`, {
                method: "DELETE",
                credentials: "include",
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Property deleted successfully.");
                router.refresh();
            } else {
                toast.error(data.message || "Failed to delete property.");
            }
        } catch (err: any) {
            toast.error(err.message || "Error deleting property.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetId) {
            toast.error("Invalid property ID.");
            return;
        }
        setEditLoading(true);
        try {
            const payload = {
                title: editFormData.title,
                description: editFormData.description,
                location: editFormData.location,
                city: editFormData.city,
                price: parseFloat(editFormData.price),
                bedrooms: editFormData.bedrooms ? parseInt(editFormData.bedrooms) : undefined,
                bathrooms: editFormData.bathrooms ? parseInt(editFormData.bathrooms) : undefined,
                areaSqft: editFormData.areaSqft ? parseFloat(editFormData.areaSqft) : undefined,
                images: editFormData.imageUrl ? [editFormData.imageUrl] : [],
                amenities: editFormData.amenities
                    ? editFormData.amenities.split(",").map((s: string) => s.trim())
                    : [],
            };

            const res = await fetch(`/api/landlord-proxy?id=${encodeURIComponent(targetId)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Property updated successfully!");
                setEditOpen(false);
                router.refresh();
            } else {
                toast.error(data.message || "Failed to update property.");
            }
        } catch (err: any) {
            toast.error(err.message || "Error updating property.");
        } finally {
            setEditLoading(false);
        }
    };

    return (
        <div className="inline-flex items-center gap-2">
            {/* Availability Toggle */}
            <select
                value={status}
                onChange={(e) => handleStatusToggle(e.target.value)}
                disabled={statusLoading}
                className="h-8 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 text-xs font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="BOOKED">BOOKED</option>
                <option value="UNAVAILABLE">UNAVAILABLE</option>
            </select>

            {/* Edit Button */}
            <Button
                size="xs"
                variant="ghost"
                onClick={() => setEditOpen(true)}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 cursor-pointer"
                title="Edit Property"
            >
                <Pencil className="h-3.5 w-3.5" />
            </Button>

            {/* Delete Button */}
            <Button
                size="xs"
                variant="ghost"
                onClick={handleDelete}
                disabled={loading}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 cursor-pointer"
                title="Delete Property"
            >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            </Button>

            {/* Edit Modal */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Pencil className="h-5 w-5 text-blue-600" /> Edit Property Details
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-title" className="text-xs font-semibold">
                                Property Title *
                            </Label>
                            <Input
                                id="edit-title"
                                value={editFormData.title}
                                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                placeholder="Luxury Modern Apartment"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-city" className="text-xs font-semibold">
                                    City *
                                </Label>
                                <Input
                                    id="edit-city"
                                    value={editFormData.city}
                                    onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                                    placeholder="New York"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-location" className="text-xs font-semibold">
                                    Specific Neighborhood / Address *
                                </Label>
                                <Input
                                    id="edit-location"
                                    value={editFormData.location}
                                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                                    placeholder="5th Avenue, Midtown"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-price" className="text-xs font-semibold">
                                    Price ($/mo) *
                                </Label>
                                <Input
                                    id="edit-price"
                                    type="number"
                                    value={editFormData.price}
                                    onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                                    placeholder="1500"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-bedrooms" className="text-xs font-semibold">
                                    Bedrooms
                                </Label>
                                <Input
                                    id="edit-bedrooms"
                                    type="number"
                                    value={editFormData.bedrooms}
                                    onChange={(e) => setEditFormData({ ...editFormData, bedrooms: e.target.value })}
                                    placeholder="2"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-bathrooms" className="text-xs font-semibold">
                                    Bathrooms
                                </Label>
                                <Input
                                    id="edit-bathrooms"
                                    type="number"
                                    value={editFormData.bathrooms}
                                    onChange={(e) => setEditFormData({ ...editFormData, bathrooms: e.target.value })}
                                    placeholder="1"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit-areaSqft" className="text-xs font-semibold">
                                Area (Square Feet)
                            </Label>
                            <Input
                                id="edit-areaSqft"
                                type="number"
                                value={editFormData.areaSqft}
                                onChange={(e) => setEditFormData({ ...editFormData, areaSqft: e.target.value })}
                                placeholder="850"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit-imageUrl" className="text-xs font-semibold flex items-center gap-1">
                                <ImageIcon className="h-3.5 w-3.5 text-blue-600" /> Image URL (Upload Link)
                            </Label>
                            <Input
                                id="edit-imageUrl"
                                value={editFormData.imageUrl}
                                onChange={(e) => setEditFormData({ ...editFormData, imageUrl: e.target.value })}
                                placeholder="https://images.unsplash.com/photo-..."
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit-amenities" className="text-xs font-semibold">
                                Amenities (Comma separated)
                            </Label>
                            <Input
                                id="edit-amenities"
                                value={editFormData.amenities}
                                onChange={(e) => setEditFormData({ ...editFormData, amenities: e.target.value })}
                                placeholder="WiFi, Swimming Pool, Parking"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit-description" className="text-xs font-semibold">
                                Description
                            </Label>
                            <Textarea
                                id="edit-description"
                                rows={3}
                                value={editFormData.description}
                                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                placeholder="Describe property features..."
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={() => setEditOpen(false)} className="cursor-pointer">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer">
                                {editLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
