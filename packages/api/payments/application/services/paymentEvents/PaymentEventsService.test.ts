import { PaymentEventsService } from './PaymentEventsService';

describe('PaymentEventsService', () => {
  it('queries and returns events by member Id', async () => {
    // Arrange

    const paymentEventStoreRepository = {
      writePaymentEvent: jest.fn(),
      queryPaymentEventsByMemberIdAndEventType: jest.fn(),
      queryEventsByTypeAndObjectId: jest.fn(),
      queryPaymentEventsByMemberId: jest.fn().mockResolvedValue([
        {
          type: 'paymentSucceeded',
          paymentIntentId: 'pt_1',
        },
      ]),
    };

    const paymentEventsService = new PaymentEventsService(paymentEventStoreRepository);

    // Act
    const response = await paymentEventsService.getPaymentEvents('1232');

    // Assert
    expect(paymentEventStoreRepository.queryPaymentEventsByMemberId).toHaveBeenCalledWith('1232');
    expect(response).toHaveLength(1);
    expect(response[0].type === 'paymentSucceeded' && response[0].paymentIntentId).toEqual('pt_1');
  });
});
