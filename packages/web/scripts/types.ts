import { TransformedToken, TransformedTokens } from 'style-dictionary';
import { PluginAPI, KeyValuePair, ResolvableTo } from 'tailwindcss/types/config';

export type ChromaModifyAttrs = TransformedToken & {
  modify: {
    type: string;
    amount: any;
  }[];
};

export type TransformedTokensResponse =
  | TransformedTokens
  | TransformedToken
  | {
      [key: string]: ResolvableTo<KeyValuePair<string, string>>;
    };

export interface FontFacesPlugin {
  font: Record<string, any>;
  baseSrcUrl: string;
  addBase: PluginAPI['addBase'];
}

export interface FontToken {
  path: string;
  style: 'normal' | 'italic';
}

export type FontTokenMap = Record<string, FontToken[]>;
