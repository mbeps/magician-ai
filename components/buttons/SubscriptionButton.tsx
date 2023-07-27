"use client";

import axios from "axios";
import { useState } from "react";
import { Zap } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";

/**
 * Button specifically used to manage subscriptions.
 * If the user is subscribed, it will allow them to manage their subscription.
 * If the user is not subscribed, it will allow them to upgrade.
 * The API call automatically redirects the user to the Stripe checkout page or subscription management page.
 * @param {isPro} (boolean): whether the user is subscribed
 * @returns (JSX.Element): subscription button component
 */
export const SubscriptionButton = ({ isPro = false }: { isPro: boolean }) => {
  const [loading, setLoading] = useState(false);

  /**
   * Function that is called when the user clicks the button.
   * This calls the Stripe API to redirect the user to the checkout page or subscription management page.
   */
  const onClick = async () => {
    try {
      setLoading(true);

      const response = await axios.get("/api/stripe"); // calls the Stripe API

      window.location.href = response.data.url; // redirects the user to the Stripe checkout page or subscription management page
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={isPro ? "default" : "premium"}
      disabled={loading}
      onClick={onClick}
    >
      {isPro ? "Manage Subscription" : "Upgrade"}
      {!isPro && <Zap className="w-4 h-4 ml-2 fill-white" />}
    </Button>
  );
};
