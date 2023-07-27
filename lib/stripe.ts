import Stripe from "stripe";

/**
 * Stripe instance used to make API calls to Stripe.
 * This allows us to use the Stripe API in our code.
 */
export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2022-11-15",
  typescript: true,
});
