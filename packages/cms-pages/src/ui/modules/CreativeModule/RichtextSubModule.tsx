import { PortableText } from '@portabletext/react';

export type RichtextSubModuleType = Sanity.Module<'richtext'> &
  Partial<{
    content: any;
  }>;

export default function RichtextSubModule({ module }: { module: RichtextSubModuleType }) {
  return (
    <div className="richtext font-typography-body font-typography-body-weight text-typography-body leading-typography-body text-colour-onSurface-light dark:text-colour-onSurface-dark">
      <PortableText value={module.content} />
    </div>
  );
}
