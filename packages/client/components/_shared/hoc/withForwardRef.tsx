/* eslint-disable react/display-name */
import { FC, forwardRef } from 'react';

const withForwardRef = (Component: FC<any>) => {
  return forwardRef((props, ref) => <Component {...props} itemRef={ref} />);
};

export default withForwardRef;
