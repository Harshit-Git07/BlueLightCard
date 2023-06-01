import { FontFacesPlugin } from './types';

/**
 * Adds the base styles to tailwindcss for adding font-faces
 * @param {Object} font
 * @param {Function} addBase
 */
export const addFontStyles = ({ font, baseSrcUrl, addBase }: FontFacesPlugin) => {
  Object.keys(font).forEach((fontKey) => {
    const fontConfig = font[fontKey];
    const fontFamily = fontConfig.name;
    fontConfig.styles &&
      Object.keys(fontConfig.styles).forEach((styleKey) => {
        const fontStyle = fontConfig.styles[styleKey];
        fontStyle &&
          addBase({
            '@font-face': {
              fontFamily,
              fontWeight: styleKey,
              src: `url(${baseSrcUrl}/${fontStyle.base})`,
            },
          });
      });
  });
};
