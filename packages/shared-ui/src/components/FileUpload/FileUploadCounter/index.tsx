import { FC } from 'react';
import { colours } from '../../../tailwind/theme';

export type Props = {
  currentNumberOfUploads: number;
  expectedNumberOfUploads: number;
};

const FileUploadCounter: FC<Props> = ({ currentNumberOfUploads, expectedNumberOfUploads }) => (
  <p className={`w-full ${colours.textOnSurface}`}>
    {currentNumberOfUploads} of {expectedNumberOfUploads} uploaded
  </p>
);

export default FileUploadCounter;
