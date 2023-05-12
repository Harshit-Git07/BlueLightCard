import UKFlagIcon from './UKFlagIcon';
import AUSFlagIcon from './AUSFlagIcon';
import { FC } from 'react';
import { IconProps } from './types';

export const icons: Record<string, any> = {
  uk: () => <UKFlagIcon />,
  aus: () => <AUSFlagIcon />,
};

const Icon: FC<IconProps> = ({ iconKey }) => {
  const Component = icons[iconKey];
  return Component ? <Component /> : null;
};

export default Icon;
