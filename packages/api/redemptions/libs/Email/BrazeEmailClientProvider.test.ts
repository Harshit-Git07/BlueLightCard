import { Braze } from 'braze-api';

import { BrazeCredentials, BrazeEmailClientProvider } from '@blc-mono/redemptions/libs/Email/BrazeEmailClientProvider';
import { ISecretsManager } from '@blc-mono/redemptions/libs/SecretsManager/SecretsManager';

const setup = () => {
  process.env.SECRETS_MANAGER_NAME = 'test-redemption-vault-secrets';
  process.env.BRAZE_API_URL = 'https://rest.fra-02.braze.com.eu';
  process.env.BRAZE_VAULT_REDEMPTION_VAULT_CAMPAIGN_ID = 'test';
};

const teardown = () => {
  delete process.env.SECRETS_MANAGER_NAME;
  delete process.env.BRAZE_API_URL;
  delete process.env.BRAZE_VAULT_REDEMPTION_VAULT_CAMPAIGN_ID;
};

describe('BrazeEmail', () => {
  beforeEach(() => {
    setup();
  });

  afterAll(() => {
    teardown();
  });

  it('should initialise correctly', async () => {
    const secretsManger = {
      getSecretValueJson: jest.fn().mockResolvedValue(
        Promise.resolve({
          brazeApiKey: 'test',
        } satisfies BrazeCredentials),
      ),
    } satisfies ISecretsManager;
    const brazeEmail = await new BrazeEmailClientProvider(secretsManger).getClient();
    expect(brazeEmail).toBeDefined();
    expect(brazeEmail).toBeInstanceOf(Braze);
  });

  it('should throw error if secrets are invalid', async () => {
    const secretsManger: ISecretsManager = {
      getSecretValueJson: jest.fn().mockResolvedValue(
        Promise.resolve({
          brazeApiKey: '',
        } satisfies BrazeCredentials),
      ),
    };

    await expect(new BrazeEmailClientProvider(secretsManger).getClient()).rejects.toThrowErrorMatchingInlineSnapshot(`
      "[
        {
          "code": "too_small",
          "minimum": 1,
          "type": "string",
          "inclusive": true,
          "exact": false,
          "message": "String must contain at least 1 character(s)",
          "path": [
            "brazeApiKey"
          ]
        }
      ]"
    `);
  });
});
