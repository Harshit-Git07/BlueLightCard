import { useCSSMerge, useCSSConditional } from '../../hooks/useCSS';
import { PlatformVariant, SharedProps, SizeVariant } from '../../types';
import { FC, PropsWithChildren } from 'react';

export type Props = PropsWithChildren &
  SharedProps & {
    disabled?: boolean;
    sizeVariant?: SizeVariant;
    onClick: () => void;
  };

const Button: FC<Props> = ({
  disabled,
  children,
  platform = PlatformVariant.Mobile,
  sizeVariant = SizeVariant.Medium,
  onClick,
}) => {
  const dynCss = useCSSConditional({
    'min-w-[100px]': platform === PlatformVariant.Desktop,
    'p-4': sizeVariant === SizeVariant.Large,
    'p-2': sizeVariant === SizeVariant.Medium,
    'p-1': sizeVariant === SizeVariant.Small,
  });
  const css = useCSSMerge('ring-offset-2 border rounded-sm focus:ring', dynCss);

  return (
    <button className={css} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
