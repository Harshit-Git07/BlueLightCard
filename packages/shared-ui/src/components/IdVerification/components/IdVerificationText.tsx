import { FC, ReactNode } from 'react';
import { colours, fonts } from '../../../tailwind/theme';

interface IdVerificationTextProps {
  children: ReactNode;
}

const IdVerificationText: FC<IdVerificationTextProps> = ({ children }) => {
  return <p className={`${fonts.bodySmall} ${colours.textOnSurfaceSubtle} pb-3`}>{children}</p>;
};

export default IdVerificationText;
