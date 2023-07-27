import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

const DAY_IN_MS = 86_400_000; // 1 day

/**
 * Checks whether the user is subscribed or not.
 * Allows the user to access the API if they are subscribed without any limits.
 * 1 day is added to the current period end to account for timezones.
 * @returns (boolean): Whether the user is subscribed or not
 */
export const checkSubscription = async () => {
  const { userId } = auth(); // get the user ID

  // if the user ID is not valid, return false
  if (!userId) {
    return false;
  }

  // get the subscription details for the user
  const userSubscription = await prismadb.userSubscription.findUnique({
    where: {
      userId: userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  // if the user does not have a subscription, return false
  if (!userSubscription) {
    return false;
  }

  // if the user has a subscription and the current period end is greater than the current time, return true
  const isValid =
    userSubscription.stripePriceId &&
    userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
      Date.now();

  return !!isValid; // convert to boolean
};
