import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
import { getSubscriptionStatus } from "../../_actions/getSubscriptionStatus";
import { SubscribeButton } from "./SubscribeButton";

export async function PricingSection() {
  const statusResult = await getSubscriptionStatus()

  const isActive = Boolean(
    statusResult?.success && statusResult.data?.isSubscribed,
  );

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Premium Plan
          {isActive && <Badge>Active</Badge>}
        </CardTitle>
        <CardDescription>
          {isActive && statusResult.data?.currentPeriodEnd
            ? `Renews on ${new Date(statusResult.data.currentPeriodEnd).toLocaleDateString()}`
            : "Unlock every premium story, cancel anytime."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <CheckIcon className="size-4 text-primary" />
            Unlimited premium articles
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon className="size-4 text-primary" />
            Early access to new stories
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon className="size-4 text-primary" />
            Support independent journalism
          </li>
        </ul>
        {!isActive && <SubscribeButton />}
        {/* {<SubscribeButton />} */}
      </CardContent>
    </Card>
  );
}
