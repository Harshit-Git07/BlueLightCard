/**
 * COLOURS
 * Each key returns the light mode, dark mode.
 */
export const colours = {
  textOnSurface: 'text-colour-onSurface dark:text-colour-onSurface-dark',
  textOnSurfaceSubtle: 'text-colour-onSurface-subtle dark:text-colour-onSurface-subtle-dark',
  textOnSurfaceDisabled: 'text-colour-onSurface-disabled dark:text-colour-onSurface-disabled-dark',
  textPrimary: 'text-colour-primary dark:text-colour-primary-dark',
  textPrimaryHover: 'text-colour-primary-hover dark:text-colour-primary-hover-dark',
  textSuccess: 'text-colour-success dark:text-colour-success-dark',
  textError: 'text-colour-error dark:text-colour-error-dark',

  backgroundSurface: 'bg-colour-surface-light dark:bg-colour-surface-dark',
  backgroundSurfaceContainer:
    'bg-colour-surface-container-light dark:bg-colour-surface-container-dark',
  backgroundPrimaryContainer:
    'bg-colour-primary-container-light dark:bg-colour-primary-container-dark',

  borderPrimary: 'border-colour-primary dark:border-colour-primary-dark',
  borderPrimaryOnFocus: 'focus:border-colour-primary dark:focus:border-colour-primary-dark',
  borderPrimaryHover: 'border-colour-primary-hover dark:border-colour-primary-hover-dark',
  borderOnSurfaceOutline:
    'border-colour-onSurface-outline dark:border-colour-onSurface-outline-dark',
  borderOnSurfaceOutlineSubtle:
    'border-colour-onSurface-outline-subtle dark:border-colour-onSurface-outline-subtle-dark',
  borderSuccess: 'border-colour-success dark:border-colour-success-dark',
  borderError: 'border-colour-error dark:border-colour-error-dark',
};

/**
 * FONTS
 * Each key returns the 4 css classes required to set a font style.
 */
export const fonts = {
  displayLargeText:
    'font-typography-display-large font-typography-display-large-weight text-typography-display-large leading-typography-display-large tracking-typography-display-large',
  displayMediumText:
    'font-typography-display-medium font-typography-display-medium-weight text-typography-display-medium leading-typography-display-medium tracking-typography-display-medium',
  displaySmallText:
    'font-typography-display-small font-typography-display-small-weight text-typography-display-small leading-typography-display-small tracking-typography-display-small',
  headline:
    'font-typography-headline font-typography-headline-weight text-typography-headline leading-typography-headline tracking-typography-headline',
  headlineBold:
    'font-typography-headline-bold font-typography-headline-bold-weight text-typography-headline-bold leading-typography-headline-bold tracking-typography-headline-bold',
  headlineSmallBold:
    'font-typography-headline-small-bold font-typography-headline-small-bold-weight text-typography-headline-small-bold leading-typography-headline-small-bold tracking-typography-headline-small-bold',
  titleLarge:
    'font-typography-title-large font-typography-title-large-weight text-typography-title-large leading-typography-title-large tracking-typography-title-large',
  titleMedium:
    'font-typography-title-medium font-typography-title-medium-weight text-typography-title-medium leading-typography-title-medium tracking-typography-title-medium',
  titleMediumSemiBold:
    'font-typography-title-medium-semibold font-typography-title-medium-semibold-weight text-typography-title-medium-semibold leading-typography-title-medium-semibold tracking-typography-title-medium-semibold',
  titleSmall:
    'font-typography-title-small font-typography-title-small-weight text-typography-title-small leading-typography-title-small tracking-typography-title-small',
  body: 'font-typography-body font-typography-body-weight text-typography-body leading-typography-body tracking-typography-body',
  bodyLight:
    'font-typography-body-light font-typography-body-light-weight text-typography-body-light leading-typography-body-light tracking-typography-body-light',
  bodySemiBold:
    'font-typography-body-semibold font-typography-body-semibold-weight text-typography-body-semibold leading-typography-body-semibold tracking-typography-body-semibold',
  bodySmall:
    'font-typography-body-small font-typography-body-small-weight text-typography-body-small leading-typography-body-small tracking-typography-body-small',
  bodySmallSemiBold:
    'font-typography-body-small-semibold font-typography-body-small-semibold-weight text-typography-body-small-semibold leading-typography-body-small-semibold tracking-typography-body-small-semibold',
  label:
    'font-typography-label font-typography-label-weight text-typography-label leading-typography-label tracking-typography-label',
  labelSemiBold:
    'font-typography-label-semibold font-typography-label-semibold-weight text-typography-label-semibold leading-typography-label-semibold tracking-typography-label-semibold',
  button:
    'font-typography-button font-typography-button-weight text-typography-button leading-typography-button tracking-typography-button',
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

/**
 * Helper for consistent border styles for input fields depending on focus/disabled/error state combinations
 * @param isDisabled
 * @param isFocused
 * @param isValid
 * @returns
 */
export const getInputBorderClasses = (
  isDisabled: boolean,
  isFocused: boolean,
  isValid: boolean | undefined,
) => {
  if (isDisabled) {
    return borders.disabled;
  }

  const isInvalid = isValid === false;

  if (!isFocused && !isInvalid) {
    return borders.default;
  }

  return isInvalid ? borders.error : borders.active;
};
