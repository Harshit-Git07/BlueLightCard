import { TYPE_KEYS } from '@blc-mono/offers/src/utils/global-constants';

export interface ObjectDynamicKeys {
    [key: string]: any
}

export interface OfferHomepageKeys {
    id: string;
    type: TYPE_KEYS;
}
