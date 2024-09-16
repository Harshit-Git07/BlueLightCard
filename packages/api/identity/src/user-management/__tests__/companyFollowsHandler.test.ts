import { EventBridgeEvent } from 'aws-lambda';
import { handler } from '../companyFollowsHandler';
import { IdMappingService } from 'src/services/IdMappingService';
import { CompanyFollowsService } from 'src/services/CompanyFollowsService';

import * as dlqSender from 'src/helpers/DLQ';

const MockIdMappingService = IdMappingService as jest.Mock<IdMappingService>;

const MockCompanyFollowsService = CompanyFollowsService as jest.Mock<CompanyFollowsService>;

jest.mock('src/helpers/DLQ');
const mockedDlqSender = dlqSender as jest.Mocked<typeof dlqSender>;

beforeEach(() => {
  jest.resetAllMocks();
});

const user: Record<string, string> = {
  uuid: 'someUuid',
  legacy_id: 'someLegacyId',
};

describe('handler', () => {
  test('should not call sendToDLQ if deleteCompanyFollows is called succesfully', async () => {
    jest.spyOn(MockIdMappingService.prototype, 'findByLegacyId').mockImplementation(() => {
      return {
        Items: [user],
      };
    });

    jest
      .spyOn(MockCompanyFollowsService.prototype, 'deleteCompanyFollows')
      .mockImplementation(() => {
        return {};
      });

    const event = {
      detail: {
        brand: 'BLC_UK',
        gender: 'O',
        legacy_id: 'someLegacyId',
        action: 'delete',
        company_id: 'someCompanyId',
        likeType: 'someLikeType',
      },
    } as EventBridgeEvent<any, any>;

    await handler(event);

    expect(MockCompanyFollowsService.prototype.deleteCompanyFollows).toHaveBeenCalledTimes(1);

    expect(mockedDlqSender.sendToDLQ).not.toHaveBeenCalled();
  });

  test('should call sendToDLQ if deleteCompanyFollows throws error', async () => {
    jest.spyOn(MockIdMappingService.prototype, 'findByLegacyId').mockImplementation(() => {
      return {
        Items: [user],
      };
    });

    jest
      .spyOn(MockCompanyFollowsService.prototype, 'deleteCompanyFollows')
      .mockImplementation(() => {
        throw new Error('some error');
      });

    const event = {
      detail: {
        brand: 'BLC_UK',
        gender: 'O',
        legacy_id: 'someLegacyId',
        action: 'delete',
        company_id: 'someCompanyId',
        likeType: 'someLikeType',
      },
    } as EventBridgeEvent<any, any>;

    await handler(event);

    expect(mockedDlqSender.sendToDLQ).toHaveBeenCalledTimes(1);
    expect(mockedDlqSender.sendToDLQ).toHaveBeenCalledWith(event);
  });

  test('should call deleteCompanyFollows when action is delete', async () => {
    jest.spyOn(MockIdMappingService.prototype, 'findByLegacyId').mockImplementation(() => {
      return {
        Items: [user],
      };
    });

    jest
      .spyOn(MockCompanyFollowsService.prototype, 'deleteCompanyFollows')
      .mockImplementation(() => {
        return {};
      });

    const event = {
      detail: {
        brand: 'BLC_UK',
        gender: 'O',
        legacy_id: 'someLegacyId',
        action: 'delete',
        company_id: 'someCompanyId',
        likeType: 'someLikeType',
      },
    } as EventBridgeEvent<any, any>;

    await handler(event);

    expect(MockCompanyFollowsService.prototype.deleteCompanyFollows).toHaveBeenCalledTimes(1);

    expect(MockCompanyFollowsService.prototype.deleteCompanyFollows).toHaveBeenCalledWith(
      user.uuid,
      event.detail.company_id,
    );
  });

  test('should not call sendToDLQ if updateCompanyFollows is called succesfully', async () => {
    jest.spyOn(MockIdMappingService.prototype, 'findByLegacyId').mockImplementation(() => {
      return {
        Items: [user],
      };
    });

    jest
      .spyOn(MockCompanyFollowsService.prototype, 'updateCompanyFollows')
      .mockImplementation(() => {
        return {};
      });

    const event = {
      detail: {
        brand: 'BLC_UK',
        gender: 'O',
        legacy_id: 'someLegacyId',
        action: 'update',
        company_id: 'someCompanyId',
        likeType: 'someLikeType',
      },
    } as EventBridgeEvent<any, any>;

    await handler(event);

    expect(MockCompanyFollowsService.prototype.updateCompanyFollows).toHaveBeenCalledTimes(1);

    expect(mockedDlqSender.sendToDLQ).not.toHaveBeenCalled();
  });

  test('should call sendToDLQ if updateCompanyFollows throws error', async () => {
    jest.spyOn(MockIdMappingService.prototype, 'findByLegacyId').mockImplementation(() => {
      return {
        Items: [user],
      };
    });

    jest
      .spyOn(MockCompanyFollowsService.prototype, 'updateCompanyFollows')
      .mockImplementation(() => {
        throw new Error('some error');
      });

    const event = {
      detail: {
        brand: 'BLC_UK',
        gender: 'O',
        legacy_id: 'someLegacyId',
        action: 'update',
        company_id: 'someCompanyId',
        likeType: 'someLikeType',
      },
    } as EventBridgeEvent<any, any>;

    await handler(event);

    expect(mockedDlqSender.sendToDLQ).toHaveBeenCalledTimes(1);
    expect(mockedDlqSender.sendToDLQ).toHaveBeenCalledWith(event);
  });

  test('should call updateCompanyFollows when action is update', async () => {
    jest.spyOn(MockIdMappingService.prototype, 'findByLegacyId').mockImplementation(() => {
      return {
        Items: [user],
      };
    });

    jest
      .spyOn(MockCompanyFollowsService.prototype, 'updateCompanyFollows')
      .mockImplementation(() => {
        return {};
      });

    const event = {
      detail: {
        brand: 'BLC_UK',
        gender: 'O',
        legacy_id: 'someLegacyId',
        action: 'update',
        company_id: 'someCompanyId',
        likeType: 'someLikeType',
      },
    } as EventBridgeEvent<any, any>;

    await handler(event);

    expect(MockCompanyFollowsService.prototype.updateCompanyFollows).toHaveBeenCalledTimes(1);

    expect(MockCompanyFollowsService.prototype.updateCompanyFollows).toHaveBeenCalledWith(
      user.uuid,
      event.detail.company_id,
      event.detail.likeType,
    );
  });

  test('should call findByLegacyId', async () => {
    jest.spyOn(MockIdMappingService.prototype, 'findByLegacyId').mockImplementation(() => {
      return { items: [] };
    });

    const event = {
      detail: { brand: 'BLC_UK', gender: 'O', legacy_id: 'someLegacyId' },
    } as EventBridgeEvent<any, any>;

    await handler(event);

    expect(MockIdMappingService.prototype.findByLegacyId).toHaveBeenCalledTimes(1);
    expect(MockIdMappingService.prototype.findByLegacyId).toHaveBeenCalledWith(
      'BLC_UK',
      'someLegacyId',
    );
  });
});
