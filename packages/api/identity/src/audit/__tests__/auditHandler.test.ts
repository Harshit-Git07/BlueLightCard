import { handler } from '../auditHandler';
import { type CloudWatchLogsEvent } from 'aws-lambda';
import * as logEventExtractor from '../logEventExtractor';
import * as firehoseService from '../firehoseService';
import * as loginStateCalculator from '../loginStateCalculator';
import {
  anAuthenticationLogEvent,
  aHostedAuthLogEvent,
  aRefreshTokenLogEvent,
} from '../../testUtils/logEventTestData';

jest.mock('../logEventExtractor');
const mockedLogEventExtractor = logEventExtractor as jest.Mocked<typeof logEventExtractor>;

jest.mock('../firehoseService');
const mockedFirehoseService = firehoseService as jest.Mocked<typeof firehoseService>;

jest.mock('../loginStateCalculator');
const mockedLoginStateCalculator = loginStateCalculator as jest.Mocked<typeof loginStateCalculator>;

const event: CloudWatchLogsEvent = {
  awslogs: {
    data: 'eyJtZXRob2QiOiJ2YWx1ZSJ9',
  },
} as CloudWatchLogsEvent;

beforeEach(() => {
  jest.resetAllMocks();
});

describe('auditHandler', () => {
  test('should call extractLogEvents', async () => {
    const authenticationLogEvent = anAuthenticationLogEvent();
    mockedLogEventExtractor.extractLogEvents.mockReturnValue([authenticationLogEvent]);

    await handler(event);

    expect(mockedLogEventExtractor.extractLogEvents).toHaveBeenCalledWith(event);
  });

  test('should call calculateLoginState for all logEvents', async () => {
    const authenticationLogEvent = anAuthenticationLogEvent(
      '83139',
      '2024-08-19T09:47:57.618Z',
      '5crqumaaogmdth5s6uh9r0orsv',
      'TokenGeneration_Authentication',
    );
    const hostedLogEvent = aHostedAuthLogEvent(
      '29829',
      '2024-08-19T09:12:18.109Z',
      '69csn3p8t19rlacbu734slsqpk',
      'identity-preTokenGeneration',
    );
    const refreshTokenLogEvent = aRefreshTokenLogEvent(
      '20151',
      '2024-08-19T09:12:31.513Z',
      '69csn3p8t19rlacbu734slsqpk',
      'TokenGeneration_RefreshTokens',
    );
    mockedLogEventExtractor.extractLogEvents.mockReturnValue([
      authenticationLogEvent,
      hostedLogEvent,
      refreshTokenLogEvent,
    ]);

    mockedLoginStateCalculator.calculateLoginState.mockReturnValue(1);

    await handler(event);

    expect(mockedLoginStateCalculator.calculateLoginState.mock.calls).toEqual([
      ['5crqumaaogmdth5s6uh9r0orsv', 'TokenGeneration_Authentication'],
      ['69csn3p8t19rlacbu734slsqpk', 'identity-preTokenGeneration'],
      ['69csn3p8t19rlacbu734slsqpk', 'TokenGeneration_RefreshTokens'],
    ]);
  });

  test('should call sendDataToFireHose for all logEvents', async () => {
    const authenticationLogEvent = anAuthenticationLogEvent('83139', '2024-08-19T09:47:57.618Z');
    const hostedLogEvent = aHostedAuthLogEvent('29829', '2024-08-19T09:12:18.109Z');
    const refreshTokenLogEvent = aRefreshTokenLogEvent('20151', '2024-08-19T09:12:31.513Z');
    mockedLogEventExtractor.extractLogEvents.mockReturnValue([
      authenticationLogEvent,
      hostedLogEvent,
      refreshTokenLogEvent,
    ]);

    mockedLoginStateCalculator.calculateLoginState.mockReturnValue(1);

    await handler(event);

    const expectedDataForAuthenticationLogEvent = {
      mid: '83139',
      state: 1,
      time: '2024-08-19T09:47:57.618Z',
    };

    const expectedDataForHostedLogEvent = {
      mid: '29829',
      state: 1,
      time: '2024-08-19T09:12:18.109Z',
    };

    const expectedDataForRefreshTokenLogEvent = {
      mid: '20151',
      state: 1,
      time: '2024-08-19T09:12:31.513Z',
    };

    expect(mockedFirehoseService.sendDataToFireHose.mock.calls).toEqual([
      [expectedDataForAuthenticationLogEvent],
      [expectedDataForHostedLogEvent],
      [expectedDataForRefreshTokenLogEvent],
    ]);
  });

  test('should do nothing when extractLogEvents returns no events', async () => {
    mockedLogEventExtractor.extractLogEvents.mockReturnValue([]);

    await handler(event);

    expect(mockedFirehoseService.sendDataToFireHose).not.toHaveBeenCalled();
    expect(mockedLoginStateCalculator.calculateLoginState).not.toHaveBeenCalled();
  });
});
