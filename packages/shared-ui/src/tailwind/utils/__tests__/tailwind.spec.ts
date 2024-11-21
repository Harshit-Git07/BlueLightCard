import { fontCSSPlugin, tailwindCSSTransform } from '../tailwind';
import { mockColourTokens } from './__mocks__/colourTokens';
import { mockTypographyTokens } from './__mocks__/typographyTokens';
import { twColourTokensSnapshot } from './__snapshots__/twColourTokens';
import {
  twFontWeightsSnapshot,
  twTypographyTokensSnapshot,
} from './__snapshots__/twTypographyTokens';
import { FontWeightKey, fontWeightMap } from '../fontMap';

describe('Tailwind transform', () => {
  describe('colour tokens', () => {
    it('should return colour tokens with light token set as the tailwind colour default', () => {
      const transformedTokens = tailwindCSSTransform(mockColourTokens);
      expect(transformedTokens.themeTokens.color).toEqual(twColourTokensSnapshot);
    });
  });

  describe('typography tokens', () => {
    it('should return typography subset tokens as tailwind classes', () => {
      const transformedTokens = tailwindCSSTransform(mockTypographyTokens);

      expect(transformedTokens.themeTokens.fontFamily).toEqual(
        twTypographyTokensSnapshot.fontFamily,
      );

      expect(transformedTokens.themeTokens.fontSize).toEqual(twTypographyTokensSnapshot.fontSize);
      // assert font weight name mapping
      expect(transformedTokens.themeTokens.fontWeight['heading-large-weight']).toEqual(
        fontWeightMap[
          twTypographyTokensSnapshot.fontWeight['heading-large-weight'] as FontWeightKey
        ],
      );

      expect(transformedTokens.themeTokens.letterSpacing).toEqual(
        twTypographyTokensSnapshot.letterSpacing,
      );

      expect(transformedTokens.themeTokens.lineHeight).toEqual(
        twTypographyTokensSnapshot.lineHeight,
      );
    });
  });

  describe('font weights', () => {
    it("should return font family with it's font weights", () => {
      const transformedTokens = tailwindCSSTransform(mockTypographyTokens);
      expect(transformedTokens.fonts).toEqual(twFontWeightsSnapshot);
    });
  });

  describe('font CSS plugin', () => {
    it('should invoke tw addBase plugin api with font weight names', () => {
      const addBaseFn = jest.fn();

      fontCSSPlugin([{ fontFamily: 'Font Family', weights: ['Bold', 'Demi-Bold'] }], {
        addBase: addBaseFn,
      } as any);

      expect(addBaseFn.mock.calls[0][0]).toEqual({
        '@font-face': {
          fontFamily: 'Font Family',
          fontWeight: String(fontWeightMap['Bold']),
          src: 'local("Font Family-Bold"), url("/_next/static/fonts/Font Family/bold.otf")',
        },
      });
      expect(addBaseFn.mock.calls[1][0]).toEqual({
        '@font-face': {
          fontFamily: 'Font Family',
          fontWeight: String(fontWeightMap['Demi Bold']),
          src: 'local("Font Family-Demi-Bold"), url("/_next/static/fonts/Font Family/demi-bold.otf")',
        },
      });
    });

    it('should invoke tw addBase plugin api with font weight numbers', () => {
      const addBaseFn = jest.fn();
      const fontWeightBold = String(fontWeightMap['Bold']);
      const fontWeightDemiBold = String(fontWeightMap['Demi Bold']);

      fontCSSPlugin(
        [
          {
            fontFamily: 'Font Family',
            weights: [fontWeightBold, fontWeightDemiBold],
          },
        ],
        {
          addBase: addBaseFn,
        } as any,
      );

      expect(addBaseFn.mock.calls[0][0]).toEqual({
        '@font-face': {
          fontFamily: 'Font Family',
          fontWeight: fontWeightBold,
          src: `local("Font Family-${fontWeightBold}"), url("/_next/static/fonts/Font Family/${fontWeightBold}.otf")`,
        },
      });
      expect(addBaseFn.mock.calls[1][0]).toEqual({
        '@font-face': {
          fontFamily: 'Font Family',
          fontWeight: fontWeightDemiBold,
          src: `local("Font Family-${fontWeightDemiBold}"), url("/_next/static/fonts/Font Family/${fontWeightDemiBold}.otf")`,
        },
      });
    });
  });
});
