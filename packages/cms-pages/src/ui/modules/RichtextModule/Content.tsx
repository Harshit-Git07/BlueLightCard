import { PortableText, PortableTextMarkComponentProps } from '@portabletext/react';
import AnchoredHeading from './AnchoredHeading';
import Image from './Image';
import { cn } from '@/lib/utils';

export default function Content({
  value,
  className,
}: { value: any } & React.HTMLProps<HTMLDivElement>) {
  return (
    <div className={cn('richtext mx-auto w-full space-y-[1em] [&>:first-child]:!mt-0', className)}>
      <PortableText
        value={value}
        components={{
          block: {
            h2: (node) => <AnchoredHeading as="h2" {...node} />,
            h3: (node) => <AnchoredHeading as="h3" {...node} />,
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 pl-4">
                <div>{children}</div>
              </blockquote>
            ),
          },
          types: {
            image: Image,
            span: ({ value }) => <span>{value.text}</span>,
          },
          marks: {
            em: ({ children }: PortableTextMarkComponentProps) => <em>{children}</em>,
            strong: ({ children }: PortableTextMarkComponentProps) => <strong>{children}</strong>,
          },
        }}
      />
    </div>
  );
}
