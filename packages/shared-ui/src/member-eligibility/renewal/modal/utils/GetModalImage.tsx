import { BRAND } from '../../../../types';
import { env } from '../../../../env';

export function getModalImage(): string {
  return env.APP_BRAND === BRAND.DDS_UK
    ? 'assets/dds-modal-banner.svg'
    : 'assets/uk-modal-banner.svg';
}
