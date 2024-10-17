import { resolve } from 'path';
import type { Config } from './types';

const variantKey = 'NEXT_PUBLIC_APP_BRAND';

const blcUkVariant = {
  name: 'blc-uk',
  label: 'BLC UK',
  env: [
    {
      key: variantKey,
      value: 'blc-uk',
    },
  ],
};
const blcAuVariant = {
  name: 'blc-au',
  label: 'BLC AU',
  env: [
    {
      key: variantKey,
      value: 'blc-au',
    },
  ],
};
const ddsUkVariant = {
  name: 'dds-uk',
  label: 'DDS UK',
  env: [
    {
      key: variantKey,
      value: 'dds-uk',
    },
  ],
};

const config: Config = {
  projectRoot: resolve(`${__dirname}/../../`),
  packages: [
    {
      name: 'web',
      label: 'Web',
      variants: [
        {
          ...blcUkVariant,
          port: 6007,
        },
        {
          ...blcAuVariant,
          port: 6008,
        },
        {
          ...ddsUkVariant,
          port: 6009,
        },
      ],
    },
    {
      name: 'mobile-hybrid',
      label: 'Mobile Hybrid',
      variants: [
        {
          ...blcUkVariant,
          port: 6010,
        },
        {
          ...blcAuVariant,
          port: 6011,
        },
        {
          ...ddsUkVariant,
          port: 6012,
        },
      ],
    },
    {
      name: 'shared-ui',
      label: 'Shared UI',
      variants: [
        {
          ...blcUkVariant,
          port: 6013,
        },
        {
          ...blcAuVariant,
          port: 6014,
        },
        {
          ...ddsUkVariant,
          port: 6015,
        },
      ],
    },
  ],
  toInstances: function () {
    return this.packages.flatMap((pkg) =>
      pkg.variants.map((variant) => ({
        root: config.projectRoot,
        pkgName: pkg.name,
        variantName: variant.name,
        port: variant.port,
        env: variant.env,
      })),
    );
  },
  toRefs: function () {
    const references: ReturnType<Config['toRefs']> = {};

    this.packages.forEach((pkg) =>
      pkg.variants.forEach((variant) => {
        const refName = `${pkg.name}/${variant.name}`;

        const pkgLabel = pkg.label ?? pkg.name;
        const variantLabel = variant.label ?? variant.name;
        const refLabel = `${pkgLabel} - ${variantLabel}`;

        references[refName] = {
          title: refLabel,
          url: `http://localhost:${variant.port}`,
          expanded: false,
        };
      }),
    );

    return references;
  },
};

export default config;
