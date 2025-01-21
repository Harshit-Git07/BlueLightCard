import { PortableText, PortableTextMarkComponentProps } from '@portabletext/react';
import Image from './Image';
import { cn } from '@/lib/utils';
import Typography from './Typography';

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
            normal: (node) => <Typography headingLevel="normal">{node.children}</Typography>,
            h1: (node) => <Typography headingLevel="h1">{node.children}</Typography>,
            h2: (node) => <Typography headingLevel="h2">{node.children}</Typography>,
            h3: (node) => <Typography headingLevel="h3">{node.children}</Typography>,
            h4: (node) => <Typography headingLevel="h4">{node.children}</Typography>,
            h5: (node) => <Typography headingLevel="h5">{node.children}</Typography>,
            h6: (node) => <Typography headingLevel="h6">{node.children}</Typography>,
            blockquote: (node) => (
              <Typography headingLevel="blockquote">{node.children}</Typography>
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
