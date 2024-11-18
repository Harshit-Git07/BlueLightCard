import { useCallback, useEffect, useState } from 'react';
import { usePlatformAdapter } from '@bluelightcard/shared-ui/adapters';

//We need unique idempotency key so that we do not create duplicate payment intents.
// It makes sense for this to be application id if such a thing exists as that is unique to each application per user
// anything we pass down in the metadata will go into Stripe so think what makes sense to be in stripe for back office users
const applicationId = 'application-id';
const idempotencyKey = applicationId;

type Result = Success | Failure;

interface Success {
  clientSecret: string | undefined;
}

interface Failure {
  error: string;
}

export function useClientSecret(): Result | undefined {
  const [result, setResult] = useState<Result | undefined>(undefined);

  const platformAdapter = usePlatformAdapter();

  const requestClientSecret = useCallback(async (): Promise<void> => {
    try {
      const result = await platformAdapter.invokeV5Api('/orders/checkout', {
        method: 'POST',
        body: JSON.stringify({
          items: [
            {
              productId: 'membership',
              quantity: 1,
              metadata: { applicationId },
            },
          ],
          idempotencyKey,
          source: 'web',
        }),
      });

      const payload = JSON.parse(result.data);
      setResult(payload.data);
    } catch (error) {
      console.error(error);
      setResult({ error: 'Payment provider failed to initialise' });
    }
  }, [platformAdapter]);

  useEffect(() => {
    requestClientSecret();
  }, [platformAdapter, requestClientSecret]);

  return result;
}

export function isSuccessResult(result: Result | undefined): result is Success {
  if (!result) return false;

  return (result as Failure).error === undefined;
}
