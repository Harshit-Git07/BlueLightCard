import { BrazeEmailClientProvider, BrazeEmailSecrets } from '@blc-mono/redemptions/libs/Email/BrazeEmailClientProvider';
import { SecretsManager } from '@blc-mono/redemptions/libs/SecretsManager/SecretsManager';

const setup = () => {
  process.env.BRAZE_API_URL = 'https://rest.fra-02.braze.com.eu';
  process.env.BRAZE_VAULT_REDEMPTION_VAULT_CAMPAIGN_ID = 'test';
};

const teardown = () => {
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
      getSecretValue: jest.fn().mockResolvedValue(
        Promise.resolve({
          brazeApiKey: 'test',
        } as BrazeEmailSecrets),
      ),
    };
    const brazeEmail = await new BrazeEmailClientProvider(
      secretsManger as unknown as SecretsManager<BrazeEmailSecrets>,
    ).init();
    expect(brazeEmail).toBeDefined();
    expect(brazeEmail).toHaveProperty('campaigns');
  });

  it('should throw error if secrets are invalid', async () => {
    const secretsManger = {
      getSecretValue: jest.fn().mockResolvedValue(
        Promise.resolve({
          brazeApiKey: '',
        } as BrazeEmailSecrets),
      ),
    };

    await expect(
      new BrazeEmailClientProvider(secretsManger as unknown as SecretsManager<BrazeEmailSecrets>).init(),
    ).rejects.toThrow('Invalid secrets');
  });
});
