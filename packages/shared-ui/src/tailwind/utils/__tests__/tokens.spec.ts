import { readFileSync } from 'fs';
import { mockTokensStudioMetadata, mockTokensStudioThemes } from './__mocks__/tokensStudio';
import { getTokenSourcePaths, tsTypographyTransformer } from '../tokens';
import { BrandToken } from '../../types';

jest.mock('fs', () => ({
  readFileSync: jest.fn().mockImplementation((path: string) => {
    if (path.includes('$themes.json')) {
      return JSON.stringify(mockTokensStudioThemes);
    } else if (path.includes('$metadata.json')) {
      return JSON.stringify(mockTokensStudioMetadata);
    }
  }),
}));

describe('Tokens', () => {
  let readFileSyncMock: jest.Mock;

  beforeEach(() => {
    readFileSyncMock = jest.mocked(readFileSync);
  });

  describe('get source paths', () => {
    it('should return list of token set source paths matching the provided brand', () => {
      const sourcePaths = getTokenSourcePaths(BrandToken.BLC);

      expect(sourcePaths[0]).toContain('path/BLC.json');
      expect(sourcePaths[0]).not.toContain('path/DDS.json');
    });

    it('should NOT return duplicate token set paths if found more than once', () => {
      mockTokensStudioThemes[0].selectedTokenSets['Global'] = 'enabled';
      mockTokensStudioThemes[1].selectedTokenSets['Global'] = 'enabled';
      mockTokensStudioMetadata.tokenSetOrder.push('Global');

      const sourcePaths = getTokenSourcePaths(BrandToken.BLC);

      expect(sourcePaths.filter((path) => path.includes('Global.json'))).toHaveLength(1);
    });

    it('should NOT include source paths that are not "enabled"', () => {
      mockTokensStudioThemes[0].selectedTokenSets['path/token/set'] = 'disabled';
      mockTokensStudioMetadata.tokenSetOrder.push('path/token/set');

      const sourcePaths = getTokenSourcePaths(BrandToken.BLC);

      expect(sourcePaths.find((path) => path.includes('path/token/set.json'))).toBeUndefined();
    });
  });

  describe('typography token transformer', () => {
    it('should transform typography subset token "fontSize" to use rems', () => {
      const transformed = tsTypographyTransformer({
        type: 'typography',
        name: 'font-token',
        path: ['font-token'],
        original: {
          value: {},
        },
        filePath: '',
        isSource: true,
        value: {
          fontSize: '35',
        },
      });

      expect(transformed).toEqual({ fontSize: '2.19rem' });
    });

    it('should transform typography subset token "letterSpacing" to use ems', () => {
      const transformed = tsTypographyTransformer({
        type: 'typography',
        name: 'font-token',
        path: ['font-token'],
        original: {
          value: {},
        },
        filePath: '',
        isSource: true,
        value: {
          letterSpacing: '-1%',
        },
      });

      expect(transformed).toEqual({ letterSpacing: '-0.01em' });
    });
  });
});
