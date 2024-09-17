import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';

import * as target from './ErrorMessageBuilder';

describe('ErrorMessageBuilder', () => {
  const logger = new LambdaLogger({ serviceName: 'example-service' });

  it('should build error message', () => {
    const error = new Error('DynamoDB error');
    const message = 'Error message';
    const loggerSpy = jest.spyOn(LambdaLogger.prototype, 'error');

    const result = target.buildErrorMessage(logger, error, message);

    expect(result).toEqual('Error message: [Error: DynamoDB error]');
    expect(loggerSpy).toHaveBeenCalledWith({ message: 'Error message', body: error });
  });
});
