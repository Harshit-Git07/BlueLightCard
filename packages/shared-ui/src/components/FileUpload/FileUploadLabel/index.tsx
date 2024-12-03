import { FC } from 'react';
import { colours, fonts } from '../../../tailwind/theme';

export type Props = {
  labelText: string;
};

const FileUploadLabel: FC<Props> = ({ labelText }) => (
  <span className="flex flex-col gap-[8px]">
    <p className={`${colours.textOnSurface} ${fonts.bodySmallSemiBold} w-full`}>{labelText}</p>

    <p className={`${colours.textOnSurfaceSubtle} w-full`}>
      Remember to place on plain, well lit surface with no obstructions, blur or glare
    </p>
  </span>
);

export default FileUploadLabel;
