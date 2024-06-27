import { DesignTokens } from 'style-dictionary';

export const mockTypographyTokens: DesignTokens = {
  heading: {
    large: {
      type: 'typography',
      name: 'large',
      path: ['heading', 'large'],
      value: {
        fontFamily: 'Font Family',
        fontSize: '30',
        fontWeight: 'Bold',
        letterSpacing: '0.1em',
        lineHeight: '30',
      },
    },
    xlarge: {
      type: 'typography',
      name: 'xlarge',
      path: ['heading', 'xlarge'],
      value: {
        fontFamily: 'Font Family',
        fontSize: '50',
        fontWeight: 'Demi-Bold',
        letterSpacing: '0.1em',
        lineHeight: '50',
      },
    },
  },
};
