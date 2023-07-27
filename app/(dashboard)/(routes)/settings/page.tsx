import { SubscriptionButton } from "@/components/buttons/SubscriptionButton";
import { Heading } from "@/components/heading/Heading";
import { checkSubscription } from "@/lib/subscriptions";
import { Settings } from "lucide-react";

/**
 * Settings page which allows users to manage their account settings.
 * @returns (JSX.Element): Settings page allows users to manage their account settings.
 */
const SettingsPage = async () => {
  const isPro = await checkSubscription(); // check if the user is subscribed

  return (
    <div>
      <Heading
        title="Settings"
        description="Manage account settings."
        icon={Settings}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-4 lg:px-8 space-y-4">
        <div className="text-muted-foreground text-sm">
          {isPro
            ? "You are currently on a Pro plan."
            : "You are currently on a free plan."}
        </div>
        <SubscriptionButton isPro={isPro} />
      </div>
    </div>
  );
};

export default SettingsPage;
