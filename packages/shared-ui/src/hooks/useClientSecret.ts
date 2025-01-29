import { useCallback, useEffect, useState } from 'react';
import { usePlatformAdapter } from '../adapters';
import { v4 as createUuid } from 'uuid';

//We need unique idempotency key so that we do not create duplicate payment intents.
// It makes sense for this to be application id if such a thing exists as that is unique to each application per user
// anything we pass down in the metadata will go into Stripe so think what makes sense to be in stripe for back office users
const applicationId = 'bluelight-new-card-flow';
const idempotencyKey = createUuid();

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
      const result = await platformAdapter.invokeV5Api('/eu/orders/checkout', {
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
      const payloadResult = payload.data;

      if (isSuccessResult(payloadResult)) {
        setResult(payloadResult);
        return;
      }

      setResult({ error: 'Payment provider failed to initialise' });
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

  return (result as Success).clientSecret !== undefined;
}
