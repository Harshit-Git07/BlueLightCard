import { atom } from 'jotai';

// store experiments & feature flags together as they are requested & returned as a single list
export const experimentsAndFeatureFlags = atom<Record<string, string>>({});
