import { BRAND } from '@/global-vars';
import { useTranslation } from 'next-i18next';

/**
 * Extends useTranslation hook but locates the brand namespace(s)
 * @param ns
 * @param options
 * @returns {UseTranslationResponse}
 */
const useBrandTranslation: typeof useTranslation = (ns?, options?) => {
  return useTranslation(
    Array.isArray(ns) ? ns.map((n) => `${BRAND}.${n}`) : `${BRAND}.${ns}`,
    options
  );
};

export default useBrandTranslation;
