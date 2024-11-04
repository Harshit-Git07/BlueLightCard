import {
  AmplitudeLogParams,
  IPlatformAdapter,
  IPlatformWindowHandle,
  NavigationOptions,
  PlatformVariant,
  V5RequestOptions,
  V5Response,
} from '@bluelightcard/shared-ui';
import { amplitudeServiceAtom, experimentsAndFeatureFlags } from './amplitude/store';
import Router from 'next/router';
import { amplitudeStore } from '../context/AmplitudeExperiment';
import { API_PROXY_URL, BRAND_URL } from '@/root/global-vars';
import assert from 'assert';
import { refreshIdTokenIfRequired } from '@/utils/refreshIdTokenIfRequired';

export class WebPlatformAdapter implements IPlatformAdapter {
  platform = PlatformVariant.Web;

  async invokeV5Api(path: string, options: V5RequestOptions): Promise<V5Response> {
    const idToken = await refreshIdTokenIfRequired();
    const endpoint = `${API_PROXY_URL}${path}`;
    const queryParameters = options.queryParameters
      ? '?' + new URLSearchParams(options.queryParameters).toString()
      : '';
    const response = await fetch(endpoint + queryParameters, {
      method: options.method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: options.body,
    });

    return {
      status: response.status,
      data: await response.text(),
    };
  }

  logAnalyticsEvent(event: string, parameters: AmplitudeLogParams): void {
    const amplitudeService = amplitudeStore.get(amplitudeServiceAtom);
    amplitudeService.trackEventAsync(event, parameters);
  }

  navigate(path: string): void {
    Router.push(path);
  }

  navigateExternal(path: string, options: NavigationOptions): IPlatformWindowHandle {
    switch (options.target) {
      case 'blank':
        const windowHandle = window.open(path, '_blank');
        return {
          isOpen: () => windowHandle?.closed === false,
        };
      case 'self':
        window.location.href = path;
        return {
          isOpen: () => true,
        };
    }
  }

  writeTextToClipboard(text: string): Promise<void> {
    return navigator.clipboard.writeText(text);
  }

  getAmplitudeFeatureFlag(featureFlagName: string): string | undefined {
    const amplitudeExperiments = amplitudeStore.get(experimentsAndFeatureFlags);

    return amplitudeExperiments[featureFlagName];
  }

  getBrandURL(): string {
    assert(BRAND_URL !== undefined, 'NEXT_PUBLIC_BRAND_URL is not defined');
    return BRAND_URL;
  }
}
