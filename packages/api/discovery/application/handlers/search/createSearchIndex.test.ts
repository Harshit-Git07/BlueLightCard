jest.mock('@blc-mono/discovery/application/services/OpenSearchService');
import { OpenSearchService } from '@blc-mono/discovery/application/services/OpenSearchService';

import { handler } from '../../../application/handlers/search/createSearchIndex';

describe('createSearchIndex Handler', () => {
  const indexName = 'dummy_index';

  it('should return a success message', async () => {
    const expectedResponse = {
      message: 'Index Populated',
    };

    const results = await whenCreateIndexCalled();

    expect(results).toEqual(expectedResponse);
  });

  it('should return an index already created message', async () => {
    jest.spyOn(OpenSearchService.prototype, 'doesIndexExist').mockImplementation((_) => Promise.resolve(true));
    const expectedResponse = {
      message: 'Index already exists - skipping',
    };

    const results = await whenCreateIndexCalled();

    expect(results).toEqual(expectedResponse);
  });

  it('should create an index', async () => {
    const createIndexSpy = jest
      .spyOn(OpenSearchService.prototype, 'createIndex')
      .mockReturnValueOnce(Promise.resolve());

    await whenCreateIndexCalled();

    expect(createIndexSpy).toHaveBeenCalledWith(indexName);
  });

  it('should add a document to an index', async () => {
    const addDocumentToIndexSpy = jest
      .spyOn(OpenSearchService.prototype, 'addDocumentToIndex')
      .mockReturnValueOnce(Promise.resolve());

    await whenCreateIndexCalled();

    expect(addDocumentToIndexSpy).toHaveBeenCalled();
  });

  it('should query an index', async () => {
    const queryIndexSpy = jest.spyOn(OpenSearchService.prototype, 'queryIndex').mockReturnValueOnce(Promise.resolve());

    await whenCreateIndexCalled();

    expect(queryIndexSpy).toHaveBeenCalledWith('dummyTitle', indexName);
  });

  const whenCreateIndexCalled = () => {
    return handler();
  };
});
