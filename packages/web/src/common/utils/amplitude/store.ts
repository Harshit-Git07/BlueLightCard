import { atom } from 'jotai';
import { Amplitude } from './amplitude';

export type AmplitudeStore = Record<string, string>;

// store experiments & feature flags together as they are requested & returned as a single list
export const experimentsAndFeatureFlags = atom<AmplitudeStore>({});

export const amplitudeServiceAtom = atom<Amplitude>(new Amplitude());
