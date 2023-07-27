import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";

/**
 * Webhook listener for Stripe.
 * This is used to listen for events from Stripe.
 * The webhook is protected by a secret key.
 * This webhook is used to update the subscription details for the user.
 * It is a public API route.
 * @param req (Request): The incoming request object (JSON)
 * @returns (NextResponse): The response object (JSON)
 */
export async function POST(req: Request) {
  const body = await req.text(); // get the request body
  const signature = headers().get("Stripe-Signature") as string; // get the Stripe signature

  let event: Stripe.Event; // create an event object

  // verify the signature
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session; // get the session object

  // new user subscribes
  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string // get the subscription object for the session
    );

    // if the user ID is not valid, return a bad request response
    if (!session?.metadata?.userId) {
      return new NextResponse("User id is required", { status: 400 });
    }

    // user subscribes directly created new account
    await prismadb.userSubscription.create({
      data: {
        userId: session?.metadata?.userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  // existing user subscribes
  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string // get the subscription object for the session
    );

    // update the subscription details for the user
    await prismadb.userSubscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
