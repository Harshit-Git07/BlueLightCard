import { TokenFontData } from '../../../types';
import { mockTypographyTokens } from '../__mocks__/typographyTokens';

export const twTypographyTokensSnapshot = {
  fontFamily: {
    'heading-large': mockTypographyTokens.heading.large.value.fontFamily,
    'heading-xlarge': mockTypographyTokens.heading.xlarge.value.fontFamily,
  },
  fontSize: {
    'heading-large': mockTypographyTokens.heading.large.value.fontSize,
    'heading-xlarge': mockTypographyTokens.heading.xlarge.value.fontSize,
  },
  fontWeight: {
    'heading-large-weight': mockTypographyTokens.heading.large.value.fontWeight,
    'heading-xlarge-weight': mockTypographyTokens.heading.xlarge.value.fontWeight,
  },
  letterSpacing: {
    'heading-large': mockTypographyTokens.heading.large.value.letterSpacing,
    'heading-xlarge': mockTypographyTokens.heading.xlarge.value.letterSpacing,
  },
  lineHeight: {
    'heading-large': mockTypographyTokens.heading.large.value.lineHeight,
    'heading-xlarge': mockTypographyTokens.heading.xlarge.value.lineHeight,
  },
};

export const twFontWeightsSnapshot: TokenFontData[] = [
  {
    fontFamily: 'Font Family',
    weights: ['Bold', 'Demi-Bold'],
  },
];
