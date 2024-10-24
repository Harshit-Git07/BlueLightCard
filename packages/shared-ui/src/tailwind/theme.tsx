/**
 * COLOURS
 * Each key returns the light mode, dark mode.
 */
export const colours = {
  textOnSurface: 'text-colour-onSurface dark:text-colour-onSurface-dark',
  textOnSurfaceSubtle: 'text-colour-onSurface-subtle dark:text-colour-onSurface-subtle-dark',
  textOnSurfaceDisabled: 'text-colour-onSurface-disabled dark:text-colour-onSurface-disabled-dark',
  textSuccess: 'text-colour-success dark:text-colour-success-dark',
  textError: 'text-colour-error dark:text-colour-error-dark',

  backgroundSurfaceContainer:
    'bg-colour-surface-container-light dark:bg-colour-surface-container-dark',

  borderError: 'border-colour-error dark:border-colour-error-dark',
  borderPrimaryOnFocus: 'focus:border-colour-primary dark:focus:border-colour-primary-dark',
  borderOnSurfaceOutline:
    'border-colour-onSurface-outline dark:border-colour-onSurface-outline-dark',
  borderOnSurfaceOutlineSubtle:
    'border-colour-onSurface-outline-subtle dark:border-colour-onSurface-outline-subtle-dark',
};

/**
 * FONTS
 * Each key returns the 4 css classes required to set a font style.
 */
export const fonts = {
  body: 'font-typography-body text-typography-body tracking-typography-body leading-typography-body font-typography-body-weight',
  bodyLight:
    'font-typography-body-light text-typography-body-light tracking-typography-body-light leading-typography-body-light font-typography-body-light-weight',
  bodySmall:
    'font-typography-body-small text-typography-body-small tracking-typography-body-small leading-typography-body-small font-typography-body-small-weight',
  bodySemiBold:
    'font-typography-body-semibold text-typography-body-semibold tracking-typography-body-semibold leading-typography-body-semibold font-typography-body-semibold-weight',
  label:
    'font-typography-label text-typography-label tracking-typography-label leading-typography-label font-typography-label-weight',
};

/**
 * BORDERS
 * Each key returns border style with themed dark/light colours.
 */
export const borders = {
  default: `rounded-md border outline-none ${colours.borderOnSurfaceOutline}`,
  active: `rounded-md border outline-none ${colours.borderPrimaryOnFocus}`,
  error: `rounded-md border outline-none ${colours.borderError}`,
  disabled: `rounded-md border outline-none ${colours.borderOnSurfaceOutlineSubtle}`,
};
