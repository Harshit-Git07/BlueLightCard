import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useQuery } from '@tanstack/react-query';

export function useStripeClient(overrideKey?: string): Stripe | undefined {
  const key = overrideKey ?? process.env.NEXT_PUBLIC_STRIPE_KEY;
  const { data } = useQuery<Stripe | null>({
    queryKey: ['stripeClient'],
    queryFn: () => loadStripe(key ?? ''),
    staleTime: 1000 * 60 * 60,
  });
  return data ?? undefined;
}
