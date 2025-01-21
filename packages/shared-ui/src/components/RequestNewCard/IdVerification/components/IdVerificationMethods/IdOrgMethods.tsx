import { FC, SyntheticEvent } from 'react';
import { SupportedDocument } from '../../../../../api/types';
import IdVerificationDocumentOption from './IdVerificationDocumentOption';

interface IdOrgMethodsProps {
  documents: SupportedDocument[];
  selectedIdKey?: string;
  onClick?: (doc: SupportedDocument) => void;
}

const IdOrgMethods: FC<IdOrgMethodsProps> = ({ documents, selectedIdKey = '', onClick }) => {
  const onHandleClick = (doc: SupportedDocument) => (e?: SyntheticEvent) => {
    e?.preventDefault();

    if (!onClick) return;
    onClick(doc);
  };

  if (!documents) return <div>Loading...</div>;
  return (
    <div className={'pt-4'}>
      <div className={'flex flex-col gap-3'}>
        {documents.map((doc) => (
          <IdVerificationDocumentOption
            key={doc.idKey}
            doc={doc}
            isSelected={doc.idKey === selectedIdKey}
            onClick={onHandleClick(doc)}
          />
        ))}
      </div>
    </div>
  );
};

export default IdOrgMethods;
