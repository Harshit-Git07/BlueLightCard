export enum ThemeVariant {
  Primary = 'primary',
  Secondary = 'secondary',
  Tertiary = 'tertiary',
}

export type ThemeColorTokens = Record<
  string,
  {
    base: Record<string, string>;
    invert?: Record<string, string>;
  }
>;
