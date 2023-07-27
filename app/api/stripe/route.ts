import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

/**
 * Settings URL for the app where the user can manage their subscription.
 */
const settingsUrl = absoluteUrl("/settings");

/**
 * GET /api/stripe
 * API route for Stripe billing portal.
 * This is used to manage subscriptions.
 * The API route is protected by Clerk and requires a valid session.
 *
 * If the user is subscribed, a Stripe billing portal session is created.
 * This is where the user can manage their subscription.
 *
 * If the user is not subscribed, a Stripe checkout session is created.
 * This is where the user can subscribe.
 *
 * @returns (NextResponse): The response object (JSON)
 */
export async function GET() {
  try {
    const { userId } = auth(); // get the user ID from the session (Clerk)
    const user = await currentUser(); // get the current user

    // if the user ID is not valid or the user is not valid, return an unauthorized response
    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // get subscription details for the current user
    const userSubscription = await prismadb.userSubscription.findUnique({
      where: {
        userId,
      },
    });

    // if the user is subscribed, create a Stripe billing portal session to manage the subscription
    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId, // customer ID
        return_url: settingsUrl, // return URL
      });

      return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    }

    // if user is not subscribed, create a Stripe checkout session to subscribe the user
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl, // redirect URL after successful payment
      cancel_url: settingsUrl, // redirect URL after cancelled payment
      payment_method_types: ["card"], // payment method types
      mode: "subscription", // subscription mode
      billing_address_collection: "auto", // billing address collection
      customer_email: user.emailAddresses[0].emailAddress, // customer email
      line_items: [
        {
          price_data: {
            currency: "GBP",
            product_data: {
              name: "Magician Plus",
              description: "Unlimited AI Generations",
            },
            unit_amount: 999, // £9.99
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId, // used to check and keep track of users who are subscribed
      },
    });

    return new NextResponse(JSON.stringify({ url: stripeSession.url })); // return the Stripe checkout session URL
  } catch (error) {
    console.log("[STRIPE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
