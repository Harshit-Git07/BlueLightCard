import { cn } from '@/lib/utils';
import Content from '../RichtextModule/Content';

export default function AccordionList({
  intro,
  items,
  layout = 'vertical',
}: Partial<{
  intro?: any;
  items?: Array<{
    summary?: string;
    content?: any;
    open?: boolean;
  }>;
  layout: 'vertical' | 'horizontal';
}>) {
  return (
    <section
      className={cn('section', layout === 'horizontal' ? 'grid gap-8 md:grid-cols-2' : 'space-y-8')}
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      <header
        className={cn(
          'richtext font-typography-body-light font-typography-body-light-weight text-typography-body-light leading-typography-body-light text-colour-onSurface-light dark:text-colour-onSurface-dark',
          layout === 'horizontal'
            ? 'md:sticky-below-header self-start [--offset:1rem]'
            : 'text-center',
        )}
      >
        <Content value={intro} />
      </header>

      <div className="mx-auto w-full max-w-screen-md grid gap-4">
        {items?.map(({ summary, content, open }, key) => (
          <details
            className="accordion"
            open={open}
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
            key={key}
          >
            <summary
              className="py-[10px] font-typography-body font-typography-body-weight text-typography-body leading-typography-body text-colour-onSurface-light dark:text-colour-onSurface-dark border-b border-colour-onSurface-outline-light dark:border-colour-onSurface-outline-dark"
              itemProp="name"
            >
              {summary}
            </summary>

            <div
              className="anim-fade-to-b mt-2"
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <div
                className="richtext font-typography-body-light font-typography-body-light-weight text-typography-body-light leading-typography-body-light text-colour-onSurface-light dark:text-colour-onSurface-dark"
                itemProp="text"
              >
                <Content value={content} />
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
