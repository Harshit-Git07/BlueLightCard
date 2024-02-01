import { config } from './types';

const labelConfig: config = {
  //TODO::Not whitelabel with design tokens revisit
  normal: {
    textColor: 'text-[#202125]',
    backgroundColor: 'bg-[#ECEFF2]',
  },
  alert: {
    textColor: 'text-white',
    backgroundColor: 'bg-shade-system-red-500',
  },
};

export default labelConfig;
