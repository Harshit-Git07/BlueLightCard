import { IdVerificationMethod } from '../../IdVerificationTypes';
import { FC, ReactNode, useMemo } from 'react';
import IdVerificationOption from './IdVerificationOption';
import { verificationMethods } from '../../IdVerificationConfig';
import Tag from '../../../Tag';

interface IdVerificationByMethodIdProps {
  onClick?: (selectedMethod?: IdVerificationMethod) => () => void;
  id: IdVerificationMethod;
  selected?: boolean;
  tag?: ReactNode;
  showDetail?: boolean;
  showTrailingIcon?: boolean;
}

const IdVerificationByMethodId: FC<IdVerificationByMethodIdProps> = ({
  id,
  onClick,
  selected = false,
  tag,
  showDetail = false,
  showTrailingIcon = false,
}) => {
  const { title, description, tag: defaultTag, detail } = verificationMethods[id];

  const theTag = useMemo(() => {
    // use override tag supplied
    if (tag) return tag;

    // no tag
    if (!defaultTag) return undefined;

    // tag as specified in method details
    const { infoMessage, state, iconLeft } = defaultTag;
    return <Tag infoMessage={infoMessage} state={state} iconLeft={iconLeft} />;
  }, [tag, defaultTag]);

  return (
    <IdVerificationOption
      key={id}
      onClick={onClick ? onClick(id) : undefined}
      title={title}
      description={
        <span className={'whitespace-pre-wrap'}>{showDetail && detail ? detail : description}</span>
      }
      selected={selected}
      tag={theTag}
      showTrailingIcon={showTrailingIcon}
    />
  );
};

export default IdVerificationByMethodId;
