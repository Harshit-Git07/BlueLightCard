import { TokenStudioMetadata, TokenStudioTheme } from '../../../types';

export const mockTokensStudioThemes: TokenStudioTheme[] = [
  {
    id: '1',
    name: 'BLC',
    $figmaStyleReferences: {},
    selectedTokenSets: {
      'path/BLC': 'enabled',
    },
  },
  {
    id: '2',
    name: 'DDS',
    $figmaStyleReferences: {},
    selectedTokenSets: {
      'path/DDS': 'enabled',
    },
  },
];

export const mockTokensStudioMetadata: TokenStudioMetadata = {
  tokenSetOrder: ['path/BLC', 'path/DDS'],
};
