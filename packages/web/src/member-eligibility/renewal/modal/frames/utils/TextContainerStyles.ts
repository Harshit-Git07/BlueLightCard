import { computeValue } from '@/root/src/member-eligibility/shared/utils/ComputeValue';

export function textContainerStyles(isMobile: boolean): string {
  return computeValue(() => {
    return isMobile
      ? 'grow flex items-center gap-[16px] bg-neutral-50 px-[16px] py-[20px] rounded-lg'
      : 'flex flex-col items-start gap-[16px] bg-neutral-50 px-[16px] pt-[20px] rounded-lg';
  });
}
