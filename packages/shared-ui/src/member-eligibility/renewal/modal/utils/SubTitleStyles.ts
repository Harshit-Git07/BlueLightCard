import { computeValue } from './ComputeValue';
import { colours, fonts } from '../../../../tailwind/theme';

export function subTitleStyles(): string {
  return computeValue(() => {
    return `${fonts.body} ${colours.textOnSurface} text-center leading-relaxed`;
  });
}
