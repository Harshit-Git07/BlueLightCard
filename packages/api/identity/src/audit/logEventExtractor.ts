import { CloudWatchLogsEvent } from 'aws-lambda';
import zlib from 'fast-zlib';

const unzip = new zlib.Unzip();

export function extractLogEvents(event: CloudWatchLogsEvent): any[] {
  const data = event?.awslogs?.data;

  if (data === null || data === '') {
    return [];
  }

  const bufferedData = Buffer.from(data, 'base64');
  const unzippedData = unzip.process(bufferedData).toString();
  const parsedData = JSON.parse(unzippedData);
  return parsedData.logEvents;
}
