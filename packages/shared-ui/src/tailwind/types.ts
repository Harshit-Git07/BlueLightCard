export enum BrandToken {
  BLC = 'blc',
  DDS = 'dds',
}

export type TokenStudioTheme = {
  id: string;
  name: string;
  $figmaStyleReferences: Record<string, unknown>;
  selectedTokenSets: Record<string, string>;
  group: string;
};

export type TokenStudioMetadata = {
  tokenSetOrder: string[];
};

export type TokenGroupTypes = 'color' | 'fontSizes';

export type PresetOptions = {
  darkModeManual: boolean;
};
