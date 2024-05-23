import { z } from 'zod';
import { envMerge } from './utils';

jest.mock('./schema.ts', () => ({
  envSchema: z.object({
    ENV_VAR_1: z.string(),
    ENV_VAR_2: z.string(),
  }),
  sharedEnvVars: {
    ENV_VAR_1: 'env-var-1',
    ENV_VAR_2: 'env-var-2',
  },
}));

describe('envMerge', () => {
  it('should extend shared schema with the new schema', async () => {
    const env = envMerge({
      ENV_VAR_3: {
        value: 'env-var-3',
        schema: z.string(),
      },
    });
    expect(env).toEqual({
      ENV_VAR_1: 'env-var-1',
      ENV_VAR_2: 'env-var-2',
      ENV_VAR_3: 'env-var-3',
    });
  });

  it('should override shared schema with conflicting new schema', async () => {
    const env = envMerge({
      ENV_VAR_1: {
        value: 'env-var-new-1',
        schema: z.string(),
      },
    });
    expect(env).toEqual({
      ENV_VAR_1: 'env-var-new-1',
      ENV_VAR_2: 'env-var-2',
    });
  });
});
