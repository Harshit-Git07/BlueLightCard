export enum ThemeVariant {
  Primary = 'primary',
  Secondary = 'secondary',
  Tertiary = 'tertiary',
}

export enum ColourVariant {
  Success = 'success',
  Danger = 'danger',
  Warning = 'warning',
  Info = 'info',
  Default = 'default',
}

export type ThemeColorTokens = Record<
  string,
  {
    base: Record<string, string>;
    invert?: Record<string, string>;
  }
>;
