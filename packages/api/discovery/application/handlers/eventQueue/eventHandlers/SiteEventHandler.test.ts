import * as AWS_CLIENT_SSM from '@aws-sdk/client-ssm';

import { siteFactory } from '@blc-mono/discovery/application/factories/SiteFactory';
import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import { updateSingletonMenuId } from '@blc-mono/discovery/application/repositories/Menu/service/MenuService';

import {
  deleteSiteConfig,
  getSiteConfig,
  handleSiteDeleted,
  handleSiteUpdated,
  insertSiteConfig,
} from './SiteEventHandler';

jest.mock('@aws-sdk/client-ssm', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@aws-sdk/client-ssm'),
  };
});

jest.mock('@blc-mono/core/utils/getEnv', () => {
  return {
    getEnv: (key: string) => {
      if (key === 'STAGE') {
        return 'mock-stage';
      }
      return 'invalid-env-key';
    },
    getEnvRaw: (key: string) => {
      if (key === 'AWS_DEFAULT_REGION') {
        return 'eu-west-2';
      }
      return 'invalid-env-key';
    },
  };
});

jest.mock('@blc-mono/discovery/application/repositories/Menu/service/MenuService');

const updateSingletonMenuIdMock = jest.mocked(updateSingletonMenuId);

const site = siteFactory.build();

const mockSend = jest.fn();
const mockGetCommand: AWS_CLIENT_SSM.GetParameterCommand = {
  middlewareStack: {
    add: jest.fn(),
    addRelativeTo: jest.fn(),
    clone: jest.fn(),
    concat: jest.fn(),
    remove: jest.fn(),
    resolve: jest.fn(),
    use: jest.fn(),
    removeByTag: jest.fn(),
    identify: jest.fn(),
    identifyOnResolve: jest.fn(),
    applyToStack: jest.fn(),
  },
  input: { Name: 'mock-stage/discovery/siteConfig' },
  resolveMiddleware: jest.fn(),
  resolveMiddlewareWithContext: jest.fn(),
};

const mockPutCommand: AWS_CLIENT_SSM.PutParameterCommand = {
  input: {
    Name: 'mock-stage/discovery/siteConfig',
    Value: JSON.stringify(site),
    Overwrite: true,
    Type: 'String',
  },
  resolveMiddleware: jest.fn(),
  middlewareStack: {
    add: jest.fn(),
    addRelativeTo: jest.fn(),
    clone: jest.fn(),
    concat: jest.fn(),
    remove: jest.fn(),
    resolve: jest.fn(),
    use: jest.fn(),
    removeByTag: jest.fn(),
    identify: jest.fn(),
    identifyOnResolve: jest.fn(),
    applyToStack: jest.fn(),
  },
  resolveMiddlewareWithContext: jest.fn(),
};

const mockDeleteCommand: AWS_CLIENT_SSM.DeleteParameterCommand = {
  input: {
    Name: 'mock-stage/discovery/siteConfig',
  },
  resolveMiddleware: jest.fn(),
  middlewareStack: {
    add: jest.fn(),
    addRelativeTo: jest.fn(),
    clone: jest.fn(),
    concat: jest.fn(),
    remove: jest.fn(),
    resolve: jest.fn(),
    use: jest.fn(),
    removeByTag: jest.fn(),
    identify: jest.fn(),
    identifyOnResolve: jest.fn(),
    applyToStack: jest.fn(),
  },
  resolveMiddlewareWithContext: jest.fn(),
};

describe('SiteEventHandler', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    sendSpy.mockImplementation(mockSend);
    getCommandSpy.mockReturnValue(mockGetCommand);
    putCommandSpy.mockReturnValue(mockPutCommand);
    deleteCommandSpy.mockReturnValue(mockDeleteCommand);
  });

  const sendSpy = jest.spyOn(AWS_CLIENT_SSM.SSMClient.prototype, 'send');
  const getCommandSpy = jest.spyOn(AWS_CLIENT_SSM, 'GetParameterCommand');
  const putCommandSpy = jest.spyOn(AWS_CLIENT_SSM, 'PutParameterCommand');
  const deleteCommandSpy = jest.spyOn(AWS_CLIENT_SSM, 'DeleteParameterCommand');

  describe('getSiteConfig', () => {
    describe('buildParameterName', () => {
      it('should return getCommandSpy', async () => {
        await getSiteConfig();

        expect(getCommandSpy).toHaveBeenCalledWith({ Name: '/mock-stage/discovery/siteConfig' });
      });
    });

    it('should return undefined if the parameter is not found', async () => {
      const result = await getSiteConfig();

      expect(getCommandSpy).toHaveBeenCalledWith({ Name: '/mock-stage/discovery/siteConfig' });
      expect(sendSpy).toHaveBeenCalledWith(mockGetCommand);
      expect(result).toBeUndefined();
    });

    it('should return the site config if the parameter is found', async () => {
      mockSend.mockReturnValue({
        Parameter: {
          Value: JSON.stringify(site),
        },
      });
      const result = await getSiteConfig();
      expect(result).toEqual(site);
    });

    it('should log an error if an error occurs', async () => {
      sendSpy.mockImplementation(async () => Promise.reject(new Error('mock-error')));
      await expect(getSiteConfig()).rejects.toThrow(
        'Error fetching site config for parameter name: /mock-stage/discovery/siteConfig',
      );
    });

    it('should not throw an error if the error is of ParameterNotFound', async () => {
      const mockError = new AWS_CLIENT_SSM.ParameterNotFound({ $metadata: {}, message: 'mock message' });
      sendSpy.mockImplementation(async () => Promise.reject(mockError));

      await expect(getSiteConfig()).resolves.not.toThrow();
      const result = await getSiteConfig();
      expect(result).toBeUndefined();
    });
  });

  describe('insertSiteConfig', () => {
    it('should call the PutParameterCommand and send command with the correct parameters', async () => {
      await insertSiteConfig(site);

      expect(putCommandSpy).toHaveBeenCalledWith({
        Name: '/mock-stage/discovery/siteConfig',
        Value: JSON.stringify(site),
        Overwrite: true,
        Type: 'String',
      });
      expect(sendSpy).toHaveBeenCalledWith(mockPutCommand);
    });

    it('should throw an error if the SSM Client throws an error', async () => {
      sendSpy.mockImplementation(async () => Promise.reject(new Error('mock-error')));

      await expect(insertSiteConfig(site)).rejects.toThrow(
        'Error updating site config for parameter name: /mock-stage/discovery/siteConfig',
      );
    });
  });

  describe('deleteSiteConfig', () => {
    it('should call the DeleteParameterCommand and send command with the correct parameters', async () => {
      await deleteSiteConfig();

      expect(deleteCommandSpy).toHaveBeenCalledWith({
        Name: '/mock-stage/discovery/siteConfig',
      });
      expect(sendSpy).toHaveBeenCalledWith(mockDeleteCommand);
    });

    it('should throw an error if the SSM Client throws an error', async () => {
      sendSpy.mockImplementation(async () => Promise.reject(new Error('mock-error')));

      await expect(deleteSiteConfig()).rejects.toThrow(
        'Error deleting site config for parameter name: /mock-stage/discovery/siteConfig',
      );
    });
  });

  describe('handleSiteUpdated', () => {
    it('should insert the site config if the current site record is undefined and updateSingletonMenuId to be called', async () => {
      await handleSiteUpdated(site);

      expect(getCommandSpy).toHaveBeenCalled();
      expect(putCommandSpy).toHaveBeenCalled();
      expect(sendSpy).toHaveBeenNthCalledWith(1, mockGetCommand);
      expect(sendSpy).toHaveBeenNthCalledWith(2, mockPutCommand);
      expect(updateSingletonMenuIdMock).toHaveBeenNthCalledWith(
        1,
        'deals-of-the-week-id-1',
        MenuType.DEALS_OF_THE_WEEK,
      );
      expect(updateSingletonMenuIdMock).toHaveBeenNthCalledWith(2, 'featured-offers-id-1', MenuType.FEATURED);
    });

    it('should insert the site config if the new site record is newer than the current site record', async () => {
      const newSite = { ...site, updatedAt: '2023-09-01T00:00:00' };
      mockSend
        .mockReturnValueOnce({
          Parameter: {
            Value: JSON.stringify(site),
          },
        })
        .mockReturnValue({});

      await handleSiteUpdated(newSite);

      expect(getCommandSpy).toHaveBeenCalled();
      expect(putCommandSpy).toHaveBeenCalled();
      expect(sendSpy).toHaveBeenCalledTimes(2);
      expect(updateSingletonMenuIdMock).not.toHaveBeenCalled();
    });

    it('should not insert the site config if the new site record is older than the current site record', async () => {
      const oldSite = { ...site, updatedAt: '2021-09-01T00:00:00' };
      mockSend.mockReturnValueOnce({
        Parameter: {
          Value: JSON.stringify(site),
        },
      });

      await handleSiteUpdated(oldSite);

      expect(getCommandSpy).toHaveBeenCalled();
      expect(putCommandSpy).not.toHaveBeenCalled();
      expect(sendSpy).toHaveBeenCalledTimes(1);
      expect(updateSingletonMenuIdMock).not.toHaveBeenCalled();
    });

    const singletonMenuTestCases = [
      {
        siteParams: { dealsOfTheWeekMenu: { id: 'new-menu-id' } },
        menuType: MenuType.DEALS_OF_THE_WEEK,
      },
      {
        siteParams: { featuredOffersMenu: { id: 'new-menu-id' } },
        menuType: MenuType.FEATURED,
      },
    ];

    it.each(singletonMenuTestCases)(
      'should call the updateSingletonMenuId function if the %s id has changed',
      async ({ siteParams, menuType }) => {
        const newSite = {
          ...site,
          updatedAt: '2023-09-01T00:00:00',
          ...siteParams,
        };
        mockSend.mockReturnValueOnce({
          Parameter: {
            Value: JSON.stringify(site),
          },
        });

        await handleSiteUpdated(newSite);

        expect(getCommandSpy).toHaveBeenCalled();
        expect(putCommandSpy).toHaveBeenCalled();
        expect(sendSpy).toHaveBeenCalledTimes(2);
        expect(updateSingletonMenuIdMock).toHaveBeenCalledTimes(1);
        expect(updateSingletonMenuIdMock).toHaveBeenCalledWith('new-menu-id', menuType);
      },
    );
  });

  describe('handleSiteDeleted', () => {
    it('should delete the site config if the new site record is newer than the current site record', async () => {
      const newSite = { ...site, updatedAt: '2023-09-01T00:00:00' };
      mockSend
        .mockReturnValueOnce({
          Parameter: {
            Value: JSON.stringify(site),
          },
        })
        .mockReturnValue({});

      await handleSiteDeleted(newSite);

      expect(getCommandSpy).toHaveBeenCalled();
      expect(deleteCommandSpy).toHaveBeenCalled();
      expect(sendSpy).toHaveBeenNthCalledWith(1, mockGetCommand);
      expect(sendSpy).toHaveBeenNthCalledWith(2, mockDeleteCommand);
    });

    it('should not delete the site config if the current site record is undefined', async () => {
      await handleSiteDeleted(site);

      expect(getCommandSpy).toHaveBeenCalled();
      expect(deleteCommandSpy).not.toHaveBeenCalled();
      expect(sendSpy).toHaveBeenCalledTimes(1);
      expect(sendSpy).toHaveBeenCalledWith(mockGetCommand);
      expect(sendSpy).not.toHaveBeenCalledWith(mockDeleteCommand);
    });

    it('should not delete the site config if the new site record is older than the current site record', async () => {
      const oldSite = { ...site, updatedAt: '2021-09-01T00:00:00' };
      mockSend
        .mockReturnValueOnce({
          Parameter: {
            Value: JSON.stringify(site),
          },
        })
        .mockReset();

      await handleSiteDeleted(oldSite);

      expect(getCommandSpy).toHaveBeenCalled();
      expect(deleteCommandSpy).not.toHaveBeenCalled();
      expect(sendSpy).toHaveBeenCalledTimes(1);
      expect(sendSpy).toHaveBeenCalledWith(mockGetCommand);
      expect(sendSpy).not.toHaveBeenCalledWith(mockDeleteCommand);
    });
  });
});
