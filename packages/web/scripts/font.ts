import { FontTokenMap } from './types';

export const getFonts = (font: Record<string, any>): FontTokenMap => {
  return Object.keys(font).reduce<FontTokenMap>((acc, fontName) => {
    const fontConfig = font[fontName];
    const fontStyles = fontConfig.styles;

    Object.keys(fontStyles).forEach((weight) => {
      const fontStyle = fontStyles[weight];
      const baseFontType = fontStyle.base.slice(
        fontStyle.base.lastIndexOf('.') + 1,
        fontStyle.base.length
      );

      if (!acc[baseFontType]) {
        acc[baseFontType] = [];
      }

      acc[baseFontType].push({
        path: fontStyle.base,
        style: 'normal',
      });
    });
    return acc;
  }, {});
};
