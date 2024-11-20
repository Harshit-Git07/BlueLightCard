import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';

export function useStripeClient(): Stripe | undefined {
  const [stripeClient, setStripeClient] = useState<Stripe | null>(null);

  useEffect(() => {
    loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY ?? '').then(setStripeClient);
  }, []);

  return stripeClient ?? undefined;
}
