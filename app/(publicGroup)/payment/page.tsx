import { Suspense } from "react";
import { PricingSection } from "../_components/payment/PricingSection";
import { PricingSectionLoader } from "../_components/payment/PricingSectionLoader";

const PaymentPage = () => {
    return (
        <div className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-semibold">Go Premium</h1>
                <p className="text-sm text-muted-foreground">
                    Subscribe to unlock premium news content.
                </p>
            </div>

            <Suspense fallback={<PricingSectionLoader />}>
                <PricingSection />
            </Suspense>
        </div>
    )
}



export default PaymentPage
