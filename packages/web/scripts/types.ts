import { TransformedToken } from 'style-dictionary';
import { PluginAPI } from 'tailwindcss/types/config';

export type ChromaModifyAttrs = TransformedToken & {
  modify: {
    type: string;
    amount: any;
  }[];
};

export interface FontFacesPlugin {
  font: Record<string, any>;
  baseSrcUrl: string;
  addBase: PluginAPI['addBase'];
}
