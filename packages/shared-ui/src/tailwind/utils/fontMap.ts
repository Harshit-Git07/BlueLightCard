// font weight name mapping https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-weight#common_weight_name_mapping
export const fontWeightMap = {
  Thin: 100,
  Hairline: 100,
  'Extra Light': 200,
  'Ultra Light': 200,
  Light: 300,
  Normal: 400,
  Medium: 500,
  Regular: 500,
  'Semi Bold': 600,
  'Demi Bold': 600,
  Bold: 700,
  'Extra Bold': 800,
  'Ultra Bold': 800,
  Black: 900,
  Heavy: 900,
} as const;

export type FontWeightKey = keyof typeof fontWeightMap;

export function getFontWeight(fontWeight: string) {
  return fontWeightMap[fontWeight as FontWeightKey] ?? fontWeight;
}
