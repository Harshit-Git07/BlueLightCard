import { cn } from '@/lib/utils';
import CTA, { CTAWithCustomProps } from './CTA';

export default function CTAList({
  ctas,
  className,
}: React.HTMLAttributes<HTMLParagraphElement> & {
  ctas?: CTAWithCustomProps[];
}) {
  return (
    <nav className={cn('flex flex-wrap items-center gap-[.5em]', className ?? '')}>
      {ctas?.map((cta, key) => {
        return <CTA className="max-md:w-full" {...cta} key={key} />;
      })}
    </nav>
  );
}
