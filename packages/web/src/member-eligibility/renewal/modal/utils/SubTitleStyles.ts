import { computeValue } from '@/root/src/member-eligibility/shared/utils/ComputeValue';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';

export function subTitleStyles(): string {
  return computeValue(() => {
    return `${fonts.body} ${colours.textOnSurface} text-center leading-relaxed`;
  });
}
