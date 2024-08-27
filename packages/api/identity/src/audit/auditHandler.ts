import { type CloudWatchLogsEvent } from 'aws-lambda';

import { extractLogEvents } from './logEventExtractor';
import { sendDataToFireHose } from './firehoseService';
import { calculateLoginState } from './loginStateCalculator';

export const handler = async (event: CloudWatchLogsEvent): Promise<void> => {
  const logEvents = extractLogEvents(event);

  for (const logEvent of logEvents) {
    const parsed = JSON.parse(logEvent.message);
    const state = calculateLoginState(parsed.clientId, parsed.action);

    if (state !== 0) {
      const data = {
        mid: parsed.memberId,
        state: state,
        time: parsed.timestamp,
      };

      await sendDataToFireHose(data);
    }
  }
};
