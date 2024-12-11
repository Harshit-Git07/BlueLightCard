import { ListSelectorState } from '../../../ListSelector/types';
import ListSelector from '../../../ListSelector';
import { FC, ReactNode } from 'react';

interface IdVerificationOptionProps {
  onClick?: () => void;
  selected?: boolean;
  tag?: ReactNode;
  title: string;
  description: ReactNode;
  showTrailingIcon?: boolean;
}

const IdVerificationOption: FC<IdVerificationOptionProps> = ({
  selected = false,
  onClick,
  tag,
  title,
  description,
  showTrailingIcon = false,
}) => {
  return (
    <ListSelector
      title={title}
      description={description}
      tag={tag}
      className={'sm:!min-w-full'}
      showTrailingIcon={showTrailingIcon}
      state={selected ? ListSelectorState.Selected : ListSelectorState.Default}
      onClick={onClick}
    />
  );
};

export default IdVerificationOption;
