"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { IUser } from "@/lib/types";
import { Building, Send, Loader2, CheckCircle, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface RentalRequestModalProps {
    propertyId: string;
    propertyTitle: string;
    user?: IUser | any | null;
}

export function RentalRequestModal({ propertyId, propertyTitle, user }: RentalRequestModalProps) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const router = useRouter();

    // Extract user profile and role safely
    const rawData = user as any;
    const userInfo = rawData?.user || rawData?.profile || rawData;
    const userRole = userInfo?.role;

    // Condition 1: User is logged in as ADMIN or LANDLORD -> Disabled UX
    if (userInfo && userRole && (userRole === "ADMIN" || userRole === "LANDLORD")) {
        return (
            <div className="space-y-2">
                <Button
                    disabled
                    size="lg"
                    className="w-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold py-3 text-sm cursor-not-allowed border border-slate-200 dark:border-slate-700"
                >
                    <ShieldAlert className="mr-2 h-4 w-4 text-amber-500" /> Only Tenants Can Request
                </Button>
                <p className="text-[11px] text-center text-slate-400">
                    Logged in as <span className="font-semibold text-slate-600 dark:text-slate-300">{userRole}</span>. Switch to a Tenant account to rent.
                </p>
            </div>
        );
    }

    // Condition 2: User is NOT LOGGED IN -> Direct login redirect on click
    if (!userInfo || !userRole) {
        const handleNotLoggedInClick = () => {
            toast.info("Please log in as a Tenant to submit a rental application.");
            router.push(`/login?redirectTo=/properties/${propertyId}`);
        };

        return (
            <Button
                size="lg"
                onClick={handleNotLoggedInClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-base shadow-lg cursor-pointer transition-all"
            >
                <Building className="mr-2 h-5 w-5" /> Request to Rent
            </Button>
        );
    }

    // Condition 3: User is a TENANT -> Active Modal Dialog
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/rentals-proxy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ propertyId, message }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Rental request submitted successfully!");
                setSubmitted(true);
                setTimeout(() => {
                    setOpen(false);
                    router.push("/dashboard/tenant");
                }, 1500);
            } else {
                toast.error(data.message || "Failed to submit rental request.");
            }
        } catch (err: any) {
            toast.error(err.message || "An error occurred while submitting.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-base shadow-lg cursor-pointer transition-all">
                    <Building className="mr-2 h-5 w-5" /> Request to Rent
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                        Submit Rental Request
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 text-sm">
                        Requesting to rent <strong className="text-slate-800 dark:text-slate-200">{propertyTitle}</strong>.
                    </DialogDescription>
                </DialogHeader>

                {submitted ? (
                    <div className="py-8 text-center space-y-3">
                        <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
                        <h4 className="font-bold text-lg text-slate-900 dark:text-white">Request Sent!</h4>
                        <p className="text-xs text-slate-500">Redirecting to your Tenant Dashboard...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Message to Landlord (Optional)
                            </label>
                            <Textarea
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Hi! I am interested in renting this property starting next month. Please review my request."
                                className="text-sm"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="cursor-pointer">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-semibold">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" /> Send Request
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
