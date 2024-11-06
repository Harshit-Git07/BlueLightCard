import { FC } from 'react';
import { colours, fonts } from '../../../tailwind/theme';

export type Props = {
  labelText: string;
};

const FileUploadLabel: FC<Props> = ({ labelText }) => (
  <span className="flex flex-col gap-2">
    <p className={`w-full ${colours.textOnSurface} ${fonts.bodySmallSemiBold}`}>{labelText}</p>
    <p className={`w-full ${colours.textOnSurfaceSubtle}`}>
      Remember to place on plain, well lit surface with no obstructions, blur or glare
    </p>
  </span>
);

export default FileUploadLabel;
