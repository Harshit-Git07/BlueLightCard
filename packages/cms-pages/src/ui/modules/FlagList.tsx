import Content from './RichtextModule/Content';
import Img from '@/ui/Img';
import { cn } from '@/lib/utils';
import { stegaClean } from '@sanity/client/stega';

export default function FlagList({
  intro,
  items,
  iconSize = 40,
  iconPosition,
}: Partial<{
  intro: any;
  items: Array<{
    icon: Sanity.Image;
    content: any;
  }>;
  iconSize: number;
  iconPosition: 'top' | 'left';
}>) {
  return (
    <section className="section space-y-8">
      {intro && (
        <header className="richtext text-center">
          <Content value={intro} />
        </header>
      )}

      <div className="grid gap-x-12 gap-y-6 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        {items?.map((item, key) => (
          <article
            className={cn(
              'grid gap-4',
              stegaClean(iconPosition) === 'left' && 'grid-cols-[auto,1fr]',
            )}
            key={key}
          >
            <figure>
              <Img image={item.icon} imageWidth={iconSize} style={{ maxHeight: iconSize }} />
            </figure>

            <div className="richtext">
              <Content value={item.content} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
