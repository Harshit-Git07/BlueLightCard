export default process.env.NODE_ENV === 'development' || process.env.ENABLE_PREVIEW === 'true';

export const APP_BRAND = process.env.NEXT_PUBLIC_APP_BRAND ?? 'blc-uk';
