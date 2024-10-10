import * as getEnv from '@blc-mono/core/utils/getEnv';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

import { handler } from '../../../application/handlers/search/deleteOldSearchIndices';
import { OpenSearchService } from '../../services/OpenSearchService';

jest.mock('../../services/OpenSearchService');
jest.mock('@blc-mono/core/utils/getEnv');

describe('deleteOldSearchIndices Handler', () => {
  let deleteIndexMock: jest.SpyInstance;
  let getStageIndicesForDeletionMock: jest.SpyInstance;
  let getPrEnvironmentIndicesForDeletionMock: jest.SpyInstance;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    givenEnvironmentIs('production');

    deleteIndexMock = jest.spyOn(OpenSearchService.prototype, 'deleteIndex');
    getStageIndicesForDeletionMock = jest
      .spyOn(OpenSearchService.prototype, 'getStageIndicesForDeletion')
      .mockResolvedValue(['index1', 'index2']);
    getPrEnvironmentIndicesForDeletionMock = jest
      .spyOn(OpenSearchService.prototype, 'getPrEnvironmentIndicesForDeletion')
      .mockResolvedValue(['pr-index3', 'pr-index4']);
  });

  it('should not call "getPrEnvironmentIndicesForDeletion" when not staging environment', async () => {
    await handler();

    expect(getPrEnvironmentIndicesForDeletionMock).not.toHaveBeenCalled();
  });

  it('should delete stage indices when stage indices available for deletion', async () => {
    await handler();

    expect(getStageIndicesForDeletionMock).toHaveBeenCalled();
    expect(deleteIndexMock).toHaveBeenCalledWith('index1');
    expect(deleteIndexMock).toHaveBeenCalledWith('index2');
  });

  it('should not call "deleteIndex" when no stage indices available for deletion', async () => {
    getStageIndicesForDeletionMock = jest
      .spyOn(OpenSearchService.prototype, 'getStageIndicesForDeletion')
      .mockResolvedValue([]);

    await handler();

    expect(getStageIndicesForDeletionMock).toHaveBeenCalled();
    expect(deleteIndexMock).not.toHaveBeenCalled();
  });

  describe('and is "staging" environment', () => {
    beforeEach(() => {
      givenEnvironmentIs('staging');
    });

    it('should delete pr indices when pr indices available for deletion', async () => {
      await handler();

      expect(getPrEnvironmentIndicesForDeletionMock).toHaveBeenCalled();
      expect(deleteIndexMock).toHaveBeenCalledWith('index1');
      expect(deleteIndexMock).toHaveBeenCalledWith('index2');
      expect(deleteIndexMock).toHaveBeenCalledWith('pr-index3');
      expect(deleteIndexMock).toHaveBeenCalledWith('pr-index4');
    });
  });

  const givenEnvironmentIs = (environment: string): void => {
    jest.spyOn(getEnv, 'getEnv').mockImplementation(() => {
      if (DiscoveryStackEnvironmentKeys.SERVICE) return environment;

      return 'example-variable';
    });
  };
});
