import { handler } from '../cardCreateHandler';
import { Logger } from '@aws-lambda-powertools/logger';
import { CardRepository } from '../../repositories/cardRepository';
import { Response } from '../../../../core/src/utils/restResponse/response';
import { EventBridgeEvent } from 'aws-lambda';
import * as dlqSender from 'src/helpers/DLQ';
jest.mock('@aws-lambda-powertools/logger');

jest.mock('src/helpers/DLQ');
const mockedDlqSender = dlqSender as jest.Mocked<typeof dlqSender>;
jest.mock('../../repositories/cardRepository');


const mockCardRepository = CardRepository as jest.Mock;

describe('handler', () => {
  let event: EventBridgeEvent<any, any>;

  beforeEach(() => {

(Logger as jest.MockedClass<typeof Logger>).mockClear();
    jest.clearAllMocks();
    event = {
      id: 'test-id',
      'detail-type': 'test-detail-type',
      source: 'test-source',
      account: 'test-account',
      time: 'test-time',
      region: 'test-region',
      version: 'test-version',
      resources: [],
      detail: {
        cardNumber: '123456',
        uuid: 'test-uuid'
      },
    };
  });

  it('should log and return bad request if event detail is missing', async () => {
    event.detail = null;
    const response = await handler(event);
    
    expect(response).toEqual(Response.BadRequest({ message: 'Please provide event details' }));
  });

  it('should log and return bad request if required parameters are missing', async () => {
    event.detail.uuid = '';
    const response = await handler(event);
    expect(response).toEqual(Response.BadRequest({ message: 'Required parameters are missing' }));
  });

  it('should create card and return success response', async () => {
    const mockCreateCard = jest.fn().mockResolvedValue('success');
    mockCardRepository.mockImplementation(() => ({
      createCard: mockCreateCard,
    }));

    const response = await handler(event);
    expect(response).toEqual(Response.OK({ message: 'success' }));
  });

  it('should log error and send to DLQ if create card fails', async () => {
    const mockCreateCard = jest.fn().mockRejectedValue(new Error('create error'));
    mockCardRepository.mockImplementation(() => ({
      createCard: mockCreateCard,
    }));

    await handler(event);

    expect(mockedDlqSender.sendToDLQ).toHaveBeenCalledTimes(1);
  });
});
