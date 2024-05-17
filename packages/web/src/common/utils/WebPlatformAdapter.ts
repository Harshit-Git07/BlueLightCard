import {
  AmplitudeLogParams,
  Endpoints,
  EndpointsKeys,
  IPlatformAdapter,
  PlatformVariant,
  V5RequestOptions,
  V5Response,
  urlResolver,
} from '@bluelightcard/shared-ui';
import axios from 'axios';
import { Amplitude } from './amplitude/amplitude';
import Router from 'next/router';
import {
  REDEEM_ENDPOINT,
  REDEMPTION_DETAILS_ENDPOINT,
  RETRIEVE_OFFER_ENDPOINT,
} from '@/global-vars';
import { experimentsAndFeatureFlags } from './amplitude/store';
import { amplitudeStore } from '../context/AmplitudeExperiment';

export class WebPlatformAdapter implements IPlatformAdapter {
  endpoints: Endpoints = {
    REDEMPTION_DETAILS: REDEMPTION_DETAILS_ENDPOINT,
    REDEEM_OFFER: REDEEM_ENDPOINT,
    OFFER_DETAILS: RETRIEVE_OFFER_ENDPOINT,
  };

  platform = PlatformVariant.Web;

  invokeV5Api(endpoint: EndpointsKeys, options: V5RequestOptions): Promise<V5Response> {
    const idToken = localStorage.getItem('idToken');

    return axios({
      method: options.method,
      maxBodyLength: Infinity,
      url: urlResolver(endpoint, this.endpoints, {
        pathParameter: options.pathParameter,
        queryParameters: options.queryParameters,
      }),
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      data: options.body ? JSON.parse(options.body) : null,
      params: options.queryParameters,
    });
  }

  logAnalyticsEvent(
    event: string,
    parameters: AmplitudeLogParams,
    amplitude: Amplitude | null | undefined
  ): void {
    if (amplitude) amplitude.trackEventAsync(event, parameters);
  }

  navigate(path: string): void {
    Router.push(path);
  }

  navigateExternal(path: string): void {
    // window.open - if it fails to open in new tab, we should redirect in same tab as a fallback
    window.open(path, '_blank');
  }

  writeTextToClipboard(text: string): Promise<void> {
    return Promise.resolve(navigator.clipboard.writeText(text));
  }

  getAmplitudeFeatureFlag(featureFlagName: string): string | undefined {
    const amplitudeExperiments = amplitudeStore.get(experimentsAndFeatureFlags);

    return amplitudeExperiments[featureFlagName];
  }
}
