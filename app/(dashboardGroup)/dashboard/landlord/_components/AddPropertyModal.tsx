"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building, Plus, Loader2, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function AddPropertyModal() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: "",
        categoryId: "",
        description: "",
        location: "",
        city: "",
        price: "",
        bedrooms: "",
        bathrooms: "",
        areaSqft: "",
        imageUrl: "",
        amenities: "",
    });

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch("/api/categories");
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.data && Array.isArray(data.data.categories) && data.data.categories.length > 0) {
                        setCategories(data.data.categories);
                        return;
                    }
                }
            } catch (error) {
                console.error("Failed to fetch categories dynamically", error);
            }
            // Predefined options fallback
            setCategories([
                { id: "Apartment", name: "Apartment" },
                { id: "Villa", name: "Villa" },
                { id: "House", name: "House" },
                { id: "Studio", name: "Studio" },
                { id: "Condo", name: "Condo" },
            ]);
        }
        fetchCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                title: formData.title,
                categoryId: formData.categoryId || undefined,
                description: formData.description,
                location: formData.location,
                city: formData.city,
                price: parseFloat(formData.price),
                bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
                bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
                areaSqft: formData.areaSqft ? parseFloat(formData.areaSqft) : undefined,
                images: formData.imageUrl ? [formData.imageUrl] : [],
                amenities: formData.amenities
                    ? formData.amenities.split(",").map((s) => s.trim())
                    : [],
            };

            const res = await fetch("/api/landlord-proxy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Property created successfully!");
                setOpen(false);
                setFormData({
                    title: "",
                    categoryId: "",
                    description: "",
                    location: "",
                    city: "",
                    price: "",
                    bedrooms: "",
                    bathrooms: "",
                    areaSqft: "",
                    imageUrl: "",
                    amenities: "",
                });
                router.refresh();
            } else {
                toast.error(data.message || "Failed to create property.");
            }
        } catch (err: any) {
            toast.error(err.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow cursor-pointer text-xs gap-1.5">
                    <Plus className="h-4 w-4" /> Add New Property
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Building className="h-5 w-5 text-blue-600" /> List a New Property
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="title" className="text-xs font-semibold">
                            Property Title *
                        </Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Luxury Modern Apartment in Downtown"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="categoryId" className="text-xs font-semibold">
                            Category *
                        </Label>
                        <select
                            id="categoryId"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            className="h-9 w-full min-w-0 rounded-4xl border border-input bg-input/30 px-3 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm dark:bg-slate-900/30 cursor-pointer"
                            required
                        >
                            <option value="" disabled className="text-slate-500">Select a Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id} className="text-slate-900 dark:text-white dark:bg-slate-900">
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="city" className="text-xs font-semibold">
                                City *
                            </Label>
                            <Input
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="New York"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="location" className="text-xs font-semibold">
                                Specific Neighborhood / Address *
                            </Label>
                            <Input
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="5th Avenue, Midtown"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="price" className="text-xs font-semibold">
                                Price ($/mo) *
                            </Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="1500"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="bedrooms" className="text-xs font-semibold">
                                Bedrooms
                            </Label>
                            <Input
                                id="bedrooms"
                                name="bedrooms"
                                type="number"
                                value={formData.bedrooms}
                                onChange={handleChange}
                                placeholder="2"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="bathrooms" className="text-xs font-semibold">
                                Bathrooms
                            </Label>
                            <Input
                                id="bathrooms"
                                name="bathrooms"
                                type="number"
                                value={formData.bathrooms}
                                onChange={handleChange}
                                placeholder="1"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="areaSqft" className="text-xs font-semibold">
                            Area (Square Feet)
                        </Label>
                        <Input
                            id="areaSqft"
                            name="areaSqft"
                            type="number"
                            value={formData.areaSqft}
                            onChange={handleChange}
                            placeholder="850"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="imageUrl" className="text-xs font-semibold flex items-center gap-1">
                            <ImageIcon className="h-3.5 w-3.5 text-blue-600" /> Image URL (Upload Link)
                        </Label>
                        <Input
                            id="imageUrl"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="https://images.unsplash.com/photo-..."
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="amenities" className="text-xs font-semibold">
                            Amenities (Comma separated)
                        </Label>
                        <Input
                            id="amenities"
                            name="amenities"
                            value={formData.amenities}
                            onChange={handleChange}
                            placeholder="WiFi, Swimming Pool, Parking, Gym, Balcony"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="description" className="text-xs font-semibold">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe property features, nearby transit, lease terms..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} className="cursor-pointer">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                                </>
                            ) : (
                                "List Property"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
