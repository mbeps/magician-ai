"use client";

import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

import { MAX_FREE_COUNTS } from "@/constants/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProModal } from "@/hooks/useProModal";

/**
 * Component that displays the free generation counter and a button to upgrade
 * If the user is subscribed, then the component is not rendered
 * @param {isPro} (boolean): whether the user is subscribed
 * @param {apiLimitCount} (number): number of free generations used
 * @returns (JSX.Element): free counter component (null if user is subscribed)
 */
export const FreeCounter = ({
  isPro = false,
  apiLimitCount = 0,
}: {
  isPro: boolean;
  apiLimitCount: number;
}) => {
  const [mounted, setMounted] = useState(false);
  const proModal = useProModal();

  useEffect(() => {
    setMounted(true);
  }, []);

  // prevent hydration errors `isMounted`
  if (!mounted || isPro) {
    return null;
  }

  return (
    <div className="px-3">
      <Card className="bg-white/10 border-0">
        <CardContent className="py-6">
          <div className="text-center text-sm text-white mb-4 space-y-2">
            <p>
              {apiLimitCount} / {MAX_FREE_COUNTS} Free Generations
            </p>
            <Progress
              className="h-3"
              value={(apiLimitCount / MAX_FREE_COUNTS) * 100}
            />
          </div>
          <Button
            onClick={proModal.onOpen}
            variant="premium"
            className="w-full"
          >
            Upgrade
            <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
