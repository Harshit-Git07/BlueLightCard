import { BRAND } from '@bluelightcard/shared-ui/global-vars';
import { BRANDS } from '@/types/brands.enum';

export function getModalImage(): string {
  return BRAND === BRANDS.DDS_UK ? 'assets/dds-modal-banner.svg' : 'assets/uk-modal-banner.svg';
}
