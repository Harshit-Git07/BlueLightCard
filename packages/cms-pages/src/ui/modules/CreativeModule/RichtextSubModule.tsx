import Content from '../RichtextModule/Content';

export type RichtextSubModuleType = Sanity.Module<'richtext'> &
  Partial<{
    content: any;
  }>;

export default function RichtextSubModule({ module }: { module: RichtextSubModuleType }) {
  return (
    <div className="richtext">
      <Content value={module.content} />
    </div>
  );
}
