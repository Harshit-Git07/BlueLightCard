import { ThemeColorTokens, ThemeVariant } from '@/types/theme';

export const color: ThemeColorTokens = {
  [ThemeVariant.Primary]: {
    base: {
      bg: 'bg-background-button-primary-enabled-base dark:bg-background-button-primary-enabled-dark',
      hover:
        'hover:bg-background-button-primary-hover-base dark:hover:bg-background-button-primary-hover-dark',
      focus: 'focus:outline-outline-button-base dark:focus:outline-outline-button-dark',
      text: 'text-font-button-primary-base dark:text-font-button-primary-dark',
      border: 'border-transparent',
    },
    invert: {
      bg: 'bg-background-button-primary-enabled-invert',
      hover: 'hover:bg-background-button-primary-hover-invert',
      focus: 'focus:outline-0',
      text: 'text-font-button-primary-invert',
      border: 'border-transparent',
    },
  },
  [ThemeVariant.Secondary]: {
    base: {
      bg: 'bg-background-button-secondary-enabled-base',
      hover:
        'hover:bg-background-button-secondary-hover-base dark:hover:bg-background-button-secondary-hover-dark',
      focus: 'focus:outline-outline-button-base dark:focus:outline-outline-button-dark',
      text: 'text-font-button-secondary-base dark:text-font-button-secondary-dark',
      border: 'border-border-button-secondary-base dark:border-border-button-secondary-dark',
    },
    invert: {
      bg: 'bg-background-button-secondary-enabled-base',
      hover: 'hover:opacity-75',
      focus: 'focus:outline-0',
      text: 'text-font-button-secondary-invert',
      border: 'border-border-button-secondary-invert',
    },
  },
  [ThemeVariant.Tertiary]: {
    base: {
      hover:
        'hover:bg-background-button-tertiary-hover-base dark:hover:bg-background-button-tertiary-hover-dark',
      focus: 'focus:outline-outline-button-base dark:focus:outline-outline-button-dark',
      text: 'text-font-button-tertiary-base dark:text-font-button-tertiary-dark',
      border: 'border-transparent',
    },
  },
};
