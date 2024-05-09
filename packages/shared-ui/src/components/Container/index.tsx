import { FC, PropsWithChildren } from 'react';
import { cssUtil } from '../../utils/cssUtil';
import { SharedProps, PlatformVariant } from '../../types';
import { useCSSConditional, useCSSMerge } from '../../hooks/useCSS';

export type Props = PropsWithChildren &
  SharedProps & {
    children: React.ReactNode;
    className?: string;
    nestedClassName?: string;
    addBottomHorizontalLine?: boolean;
  };

const Container: FC<Props> = ({
  children,
  className = '',
  nestedClassName = '',
  addBottomHorizontalLine = false,
  platform,
  ...props
}) => {
  const borderBottomClassNames = addBottomHorizontalLine
    ? `border-b-[0.95px] border-shade-greyscale-grey-100`
    : '';
  const containerRootClassNames = cssUtil([className ?? '', borderBottomClassNames]);

  const dynCss = useCSSConditional({
    'laptop:container laptop:mx-auto tablet:container tablet:mx-auto':
      platform === PlatformVariant.Desktop,
  });

  const css = useCSSMerge('px-5', nestedClassName, dynCss);

  return (
    <>
      <div className={containerRootClassNames} {...props}>
        <div className={css}>{children}</div>
      </div>
    </>
  );
};

export default Container;
