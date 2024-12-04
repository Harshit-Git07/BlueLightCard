import * as getEnv from '@blc-mono/core/utils/getEnv';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

import { handler } from '../../../application/handlers/search/deleteOldSearchIndices';
import { OpenSearchService } from '../../services/opensearch/OpenSearchService';

jest.mock('../../services/opensearch/OpenSearchService');
jest.mock('@blc-mono/core/utils/getEnv');

describe('deleteOldSearchIndices Handler', () => {
  let deleteIndexMock: jest.SpyInstance;
  let getPublishedIndicesForDeletionMock: jest.SpyInstance;
  let getDraftIndicesForDeletionMock: jest.SpyInstance;
  let getPrEnvironmentIndicesForDeletionMock: jest.SpyInstance;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    givenEnvironmentIs('production');

    deleteIndexMock = jest.spyOn(OpenSearchService.prototype, 'deleteIndex');
    getPublishedIndicesForDeletionMock = jest
      .spyOn(OpenSearchService.prototype, 'getPublishedIndicesForDeletion')
      .mockResolvedValue(['index1', 'index2']);
    getDraftIndicesForDeletionMock = jest
      .spyOn(OpenSearchService.prototype, 'getDraftIndicesForDeletion')
      .mockResolvedValue(['draft-index1', 'draft-index2']);
    getPrEnvironmentIndicesForDeletionMock = jest
      .spyOn(OpenSearchService.prototype, 'getPrEnvironmentIndicesForDeletion')
      .mockResolvedValue(['pr-index3', 'pr-index4']);
  });

  it('should not call "getPrEnvironmentIndicesForDeletion" when not "staging" or "pr" environment', async () => {
    await handler();

    expect(getPrEnvironmentIndicesForDeletionMock).not.toHaveBeenCalled();
  });

  it('should delete published indices when published indices available for deletion', async () => {
    await handler();

    expect(getPublishedIndicesForDeletionMock).toHaveBeenCalled();
    expect(deleteIndexMock).toHaveBeenCalledWith('index1');
    expect(deleteIndexMock).toHaveBeenCalledWith('index2');
  });

  it('should delete draft indices when draft indices available for deletion', async () => {
    await handler();

    expect(getDraftIndicesForDeletionMock).toHaveBeenCalled();
    expect(deleteIndexMock).toHaveBeenCalledWith('draft-index1');
    expect(deleteIndexMock).toHaveBeenCalledWith('draft-index2');
  });

  it('should not call "deleteIndex" when no published or draft indices available for deletion', async () => {
    getPublishedIndicesForDeletionMock = jest
      .spyOn(OpenSearchService.prototype, 'getPublishedIndicesForDeletion')
      .mockResolvedValue([]);
    getDraftIndicesForDeletionMock = jest
      .spyOn(OpenSearchService.prototype, 'getDraftIndicesForDeletion')
      .mockResolvedValue([]);

    await handler();

    expect(getPublishedIndicesForDeletionMock).toHaveBeenCalled();
    expect(getDraftIndicesForDeletionMock).toHaveBeenCalled();
    expect(deleteIndexMock).not.toHaveBeenCalled();
  });

  describe('and is "pr" environment', () => {
    beforeEach(() => {
      givenEnvironmentIs('pr');
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
