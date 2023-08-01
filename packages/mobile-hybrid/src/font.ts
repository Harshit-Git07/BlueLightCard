import localFont from 'next/font/local';

export const museoFont = localFont({
  variable: '--font-museo',
  src: [
    {
      path: '../fonts/museo/museosansrounded-300.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../fonts/museo/museosansrounded-italic-300.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../fonts/museo/museosansrounded-700.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/museo/museosansrounded-italic-700.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../fonts/museo/museosansrounded-900.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../fonts/museo/museosansrounded-italic-900.woff2',
      weight: '900',
      style: 'italic',
    },
  ],
});

export const sourceSansPro = localFont({
  variable: '--sourcesans',
  src: [
    {
      path: '../fonts/sourceSansPro/sourceSansPro-ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../fonts/sourceSansPro/sourceSansPro-ExtraLightItalic.ttf',
      weight: '200',
      style: 'italic',
    },
    {
      path: '../fonts/sourceSansPro/sourceSansPro-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../fonts/sourceSansPro/sourceSansPro-Light.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../fonts/sourceSansPro/sourceSansPro-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/sourceSansPro/sourceSansPro-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../fonts/sourceSansPro/sourceSansPro-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../fonts/sourceSansPro/sourceSansPro-SemiBoldItalic.ttf',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../fonts/sourceSansPro/sourceSansPro-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/sourceSansPro/sourceSansPro-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../fonts/sourceSansPro/sourceSansPro-Black.ttf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../fonts/sourceSansPro/sourceSansPro-BlackItalic.ttf',
      weight: '900',
      style: 'italic',
    },
  ],
});
