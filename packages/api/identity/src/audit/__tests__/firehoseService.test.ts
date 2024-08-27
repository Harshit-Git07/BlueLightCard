import { FirehoseClient, PutRecordCommand } from '@aws-sdk/client-firehose';
import { sendDataToFireHose } from '../firehoseService';

const MockFirehoseClient = FirehoseClient as jest.Mock<FirehoseClient>;

const originalEnv = process.env;

beforeEach(() => {
  jest.resetAllMocks();
});

afterEach(() => {
  process.env = originalEnv;
});

describe('sendDataToFireHose', () => {
  test('should call FirehoseClient to send data', async () => {
    process.env.DATA_STREAM = 'testDataStream';

    jest.spyOn(MockFirehoseClient.prototype, 'send').mockImplementation(() => {});

    const data = { text: 'test' };

    sendDataToFireHose(data);

    const expectedData = Buffer.from(JSON.stringify(data));

    expect(MockFirehoseClient.prototype.send).toHaveBeenCalled();

    const actualArguments = MockFirehoseClient.prototype.send.mock.calls[0][0];

    expect(actualArguments).toBeInstanceOf(PutRecordCommand);
    expect(actualArguments.input.DeliveryStreamName).toEqual('testDataStream');
    expect(actualArguments.input.Record.Data).toEqual(expectedData);
  });
});
