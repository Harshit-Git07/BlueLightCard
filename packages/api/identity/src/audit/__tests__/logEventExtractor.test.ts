import { CloudWatchLogsEvent } from 'aws-lambda';
import { extractLogEvents } from '../logEventExtractor';
import zlib from 'fast-zlib';
import { aRefreshTokenLogEvent, aHostedAuthLogEvent } from '../../testUtils/logEventTestData';
const gzip = new zlib.Gzip();

describe('extractLogEvents', () => {
  test('should return unziped logEvents', () => {
    const logEventOne = aRefreshTokenLogEvent();
    const logEventTwo = aHostedAuthLogEvent();

    const logEvents = {
      logEvents: [logEventOne, logEventTwo],
    };

    const data = gzip.process(Buffer.from(JSON.stringify(logEvents))).toString('base64');

    const event: CloudWatchLogsEvent = {
      awslogs: {
        data: data,
      },
    };

    const result = extractLogEvents(event);

    expect(result).toEqual([logEventOne, logEventTwo]);
  });

  test('should return empty list if no data in the CloudWatchLogsEvent', () => {
    const event: CloudWatchLogsEvent = {
      awslogs: {
        data: '',
      },
    };

    extractLogEvents(event);

    expect(extractLogEvents(event)).toEqual([]);
  });
});
