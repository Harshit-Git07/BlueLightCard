import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { EventBridgeEvent } from 'aws-lambda';
import { logger } from '@blc-mono/members/application/utils/logging/Logger';

jest.mock('@blc-mono/core/utils/getEnv');
jest.mock('@blc-mono/members/application/utils/logging/Logger');

const getEnvMock = jest.mocked(getEnv);
const loggerMock = jest.mocked(logger);

beforeEach(() => {
  jest.resetAllMocks();
});

describe('given payment events are disabled', () => {
  beforeEach(() => {
    getEnvMock.mockReturnValue('false');
  });

  it('should not process the event', async () => {
    const event = {} as unknown as EventBridgeEvent<string, unknown>;

    await handler(event);

    expect(loggerMock.info).toHaveBeenCalledWith({
      message: 'Payment events disabled, skipping...',
    });
    expect(loggerMock.info).toHaveBeenCalledTimes(1);
  });
});

describe('given payment events are enabled', () => {
  beforeEach(() => {
    getEnvMock.mockReturnValue('true');
  });

  it('should process the event', async () => {
    const event = {} as unknown as EventBridgeEvent<string, unknown>;

    await handler(event);

    expect(loggerMock.info).toHaveBeenCalledWith({ message: 'Got event', event });
    expect(loggerMock.info).toHaveBeenCalledTimes(1);
  });
});

async function handler(event: EventBridgeEvent<string, unknown>): Promise<void> {
  return await (await import('../memberPaymentEvents')).handler(event, emptyContextStub);
}
