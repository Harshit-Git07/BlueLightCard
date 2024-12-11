import { FC, ReactNode, useMemo } from 'react';
import Tag from '../../../../Tag';
import { SupportedDocument } from '../../../../../api/types';
import { faCircleBolt } from '@fortawesome/pro-solid-svg-icons';
import { ListSelectorState } from '../../../../ListSelector/types';
import ListSelector from '../../../../ListSelector';

interface IdVerificationByMethodIdProps {
  onClick?: () => void;
  doc: SupportedDocument;
  isSelected?: boolean;
  tag?: ReactNode;
  showDetail?: boolean;
  showTrailingIcon?: boolean;
  isPrimary?: boolean;
}

const IdVerificationDocumentOption: FC<IdVerificationByMethodIdProps> = ({
  doc,
  onClick,
  isSelected = false,
  tag,
  showTrailingIcon = false,
}) => {
  const { idKey, description, title } = doc;

  const theTag = useMemo(() => {
    // use override tag supplied
    if (tag) return tag;

    if (doc.idKey.includes('email')) {
      return <Tag infoMessage={'Fast'} state={'Success'} iconLeft={faCircleBolt} />;
    }
  }, [tag, doc]);

  return (
    <ListSelector
      title={title ?? idKey ?? 'Title'}
      description={<span className={'whitespace-pre-wrap'}>{description ?? 'Description'}</span>}
      className={'sm:!min-w-full'}
      state={isSelected ? ListSelectorState.Selected : ListSelectorState.Default}
      onClick={onClick}
      showTrailingIcon={showTrailingIcon}
      tag={theTag}
    />
  );
};

export default IdVerificationDocumentOption;
