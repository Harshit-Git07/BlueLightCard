import '../src/styles/app.css';

import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { Preview } from '@storybook/react';
import { http, HttpResponse } from 'msw';

import { initialize, mswLoader } from 'msw-storybook-addon';

initialize();

/**
 * Used to intercept requests to cdn.sanity.io and redirect requests to storybook domain for mocking
 * @returns
 */
function mswSanityImageHandler() {
  return http.get('https://cdn.sanity.io/images/*', ({ params }) => {
    const _params = params[0]! as string;
    const pathSegments = _params.split('/');
    const imageName = pathSegments[pathSegments.length - 1];

    if (!imageName) {
      return HttpResponse.error();
    }

    return new HttpResponse(null, {
      status: 302,
      headers: {
        Location: `${window.location.origin}/${imageName}`,
      },
    });
  });
}

const preview: Preview = {
  parameters: {
    viewport: {
      viewports: {
        ...INITIAL_VIEWPORTS,
        galaxyFold: {
          name: 'Galaxy Fold',
          styles: {
            width: '280px',
            height: '653px',
          },
        },
      },
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    msw: {
      handlers: [mswSanityImageHandler()],
    },
  },
  loaders: [mswLoader],
};

export default preview;
