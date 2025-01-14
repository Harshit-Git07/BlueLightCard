import ButtonV2 from '@bluelightcard/shared-ui/components/Button-V2';
import processUrl from '@/lib/processUrl';
import Link from 'next/link';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';
import { cn } from '@/lib/utils';
import { stegaClean } from '@sanity/client/stega';

type ButtonStyle = 'action' | 'ghost' | 'link';

export type CTAWithCustomProps = Sanity.CTA & {
  invertColor?: boolean;
};

const ButtonVariants = {
  action: ThemeVariant.Primary,
  ghost: ThemeVariant.Secondary,
  link: ThemeVariant.Tertiary,
};

export default function CTA({
  link,
  style,
  invertColor,
  className,
  children,
}: CTAWithCustomProps & React.HTMLAttributes<HTMLAnchorElement>) {
  if (link == null || !link?.type) return null;

  const buttonStyle = stegaClean(style ?? 'action') as ButtonStyle;
  const buttonVariant = ButtonVariants[buttonStyle] || ButtonVariants.action;

  const props = {
    className: cn(className),
    children: children || link.label || link.internal?.title,
  };

  switch (link.type) {
    case 'internal':
      if (link.internal == null) return null;

      return (
        <ButtonV2 size="Large" variant={buttonVariant} invertColor={invertColor}>
          <Link href={processUrl(link.internal, { base: false, params: link.params })} {...props} />
        </ButtonV2>
      );

    case 'external':
      return (
        <ButtonV2 size="Large" variant={buttonVariant} invertColor={invertColor}>
          <a href={link.external} {...props} />
        </ButtonV2>
      );

    default:
      return null;
  }
}
