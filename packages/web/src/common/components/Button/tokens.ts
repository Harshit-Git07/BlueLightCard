import { ThemeColorTokens, ThemeVariant } from '@/types/theme';

export const color: ThemeColorTokens = {
  [ThemeVariant.Primary]: {
    base: {
      bg: 'bg-background-cta-standard-primary-enabled-base dark:bg-background-cta-standard-primary-enabled-dark',
      hover:
        'hover:bg-background-cta-standard-primary-hover-base dark:hover:bg-background-cta-standard-primary-hover-dark',
      focus: 'focus:outline-outline-cta-standard-base dark:focus:outline-outline-cta-standard-dark',
      text: 'text-font-cta-standard-primary-base dark:text-font-cta-standard-primary-dark',
      border: 'border-transparent',
    },
    invert: {
      bg: 'bg-background-cta-standard-primary-enabled-invert',
      hover: 'hover:bg-background-cta-standard-primary-hover-invert',
      focus: 'focus:outline-0',
      text: 'text-font-cta-standard-primary-invert',
      border: 'border-transparent',
    },
  },
  [ThemeVariant.Secondary]: {
    base: {
      bg: 'bg-background-cta-standard-secondary-enabled-base',
      hover:
        'hover:bg-background-cta-standard-secondary-hover-base dark:hover:bg-background-cta-standard-secondary-hover-dark',
      focus: 'focus:outline-outline-cta-standard-base dark:focus:outline-outline-cta-standard-dark',
      text: 'text-font-cta-standard-secondary-base dark:text-font-cta-standard-secondary-dark',
      border:
        'border-border-cta-standard-secondary-base dark:border-border-cta-standard-secondary-dark',
    },
    invert: {
      bg: 'bg-background-cta-standard-secondary-enabled-base',
      hover: 'hover:opacity-75',
      focus: 'focus:outline-0',
      text: 'text-font-cta-standard-secondary-invert',
      border: 'border-border-cta-standard-secondary-invert',
    },
  },
  [ThemeVariant.Tertiary]: {
    base: {
      hover:
        'hover:bg-background-cta-standard-tertiary-hover-base dark:hover:bg-background-cta-standard-tertiary-hover-dark',
      focus: 'focus:outline-outline-cta-standard-base dark:focus:outline-outline-cta-standard-dark',
      text: 'text-font-cta-standard-tertiary-base dark:text-font-cta-standard-tertiary-dark',
      border: 'border-transparent',
    },
  },
};
