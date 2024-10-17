import type { StorybookConfig } from '@storybook/types';

export type EnvironmentVariable = {
  key: string;
  value: string;
};

export type Variant = {
  name: string;
  label?: string;
  port: number;
  env: EnvironmentVariable[];
};

export type Package = {
  name: string;
  label?: string;
  variants: Variant[];
};

export type Instance = {
  root: string;
  pkgName: string;
  variantName: string;
  port: number;
  env: EnvironmentVariable[];
};

export type Config = {
  projectRoot: string;
  packages: Package[];
  toInstances(): Instance[];
  toRefs(): StorybookConfig.refs;
};
