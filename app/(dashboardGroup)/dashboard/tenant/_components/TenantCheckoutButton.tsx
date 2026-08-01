"use client";

import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface TenantCheckoutButtonProps {
    rentalRequestId: string;
    amount: number;
}

export function TenantCheckoutButton({ rentalRequestId, amount }: TenantCheckoutButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCheckout = async () => {
        setLoading(true);
        try {
            // Step 1: Create Payment Session / Record
            const createRes = await fetch("/api/payments-proxy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    action: "create",
                    rentalRequestId,
                    amount,
                    method: "CARD",
                    provider: "STRIPE",
                }),
            });

            const createData = await createRes.json();

            if (!createData.success) {
                toast.error(createData.message || "Failed to initialize Stripe checkout.");
                setLoading(false);
                return;
            }

            // Check if backend returned a redirection URL for Stripe Checkout
            const redirectUrl =
                createData.url ||
                createData.sessionUrl ||
                createData.data?.url ||
                createData.data?.sessionUrl ||
                createData.data?.payment?.url;

            if (redirectUrl) {
                window.location.href = redirectUrl;
                return;
            }

            // Fallback for mock backend: Automatically confirm payment record
            const paymentId = createData.data?.payment?.id || createData.data?.id;

            if (!paymentId) {
                toast.error("Failed to retrieve payment reference.");
                setLoading(false);
                return;
            }

            // Generate a dynamic mock transaction reference
            const randomTxnId = `txn_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

            const confirmRes = await fetch("/api/payments-proxy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    action: "confirm",
                    paymentId,
                    transactionId: randomTxnId,
                    status: "COMPLETED",
                }),
            });

            const confirmData = await confirmRes.json();

            if (confirmData.success) {
                toast.success("Payment completed successfully! Booking confirmed.");
                router.refresh();
            } else {
                toast.error(confirmData.message || "Payment confirmation failed.");
            }
        } catch (err: any) {
            toast.error(err.message || "An error occurred during payment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            size="sm"
            onClick={handleCheckout}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow cursor-pointer text-xs gap-1.5"
        >
            {loading ? (
                <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Processing...
                </>
            ) : (
                <>
                    <CreditCard className="h-3.5 w-3.5" /> Pay ${amount.toLocaleString()} (Stripe)
                </>
            )}
        </Button>
    );
}
