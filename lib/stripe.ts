import Stripe from "stripe";

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-12-18.acacia" as any,
    });
  }
  return stripe;
}

export function getStripePremiumPriceId(): string {
  return process.env.STRIPE_PREMIUM_PRICE_ID!;
}

export function getStripeOneHourPriceId(): string {
  return process.env.STRIPE_ONE_HOUR_PREMIUM_PRICE_ID!;
}
