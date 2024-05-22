import {
  AmplitudeLogParams,
  IPlatformAdapter,
  IPlatformWindowHandle,
  NavigationOptions,
  PlatformVariant,
  V5RequestOptions,
  V5Response,
} from '@bluelightcard/shared-ui';
import { Amplitude } from './amplitude/amplitude';
import Router from 'next/router';
import { experimentsAndFeatureFlags } from './amplitude/store';
import { amplitudeStore } from '../context/AmplitudeExperiment';
import { API_PROXY_URL } from '@/root/global-vars';

export class WebPlatformAdapter implements IPlatformAdapter {
  platform = PlatformVariant.Web;

  async invokeV5Api(path: string, options: V5RequestOptions): Promise<V5Response> {
    const idToken = localStorage.getItem('idToken');
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

  logAnalyticsEvent(
    event: string,
    parameters: AmplitudeLogParams,
    amplitude: Amplitude | null | undefined
  ): void {
    // TODO: Refactor this - should not need to pass native amplitude context
    //                       otherwise platform adapter serves no purpose
    if (amplitude) amplitude.trackEventAsync(event, parameters);
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
    return Promise.resolve(navigator.clipboard.writeText(text));
  }

  getAmplitudeFeatureFlag(featureFlagName: string): string | undefined {
    const amplitudeExperiments = amplitudeStore.get(experimentsAndFeatureFlags);

    return amplitudeExperiments[featureFlagName];
  }
}
