import { TransformedToken } from 'style-dictionary';

export enum BrandToken {
  BLC = 'blc',
  DDS = 'dds',
}

export type TokenStudioTheme = {
  id: string;
  name: string;
  $figmaStyleReferences: Record<string, unknown>;
  selectedTokenSets: Record<string, string>;
  group?: string;
};

export type TokenStudioMetadata = {
  tokenSetOrder: string[];
};

export type SyntheticDesignToken = TransformedToken & {
  type: string;
  _synthetic?: {
    parentType: string;
  };
};

export type SyntheticDesignTokenSet = {
  [tokenName: string]: SyntheticDesignToken | SyntheticDesignTokenSet;
};

export type TokenTypes =
  | 'color'
  | 'fontFamily'
  | 'fontSize'
  | 'fontWeight'
  | 'lineHeight'
  | 'letterSpacing';

export type ThemeTokens = Record<TokenTypes, any>;

export type PresetOptions = {
  darkModeManual: boolean;
};

export type TokenFontData = {
  fontFamily: string;
  weights: string[];
};
