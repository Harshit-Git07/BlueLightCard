import {
  offerTypeParser,
  OfferTypeStrLiterals,
  PillButtons,
  PlatformVariant,
} from '@bluelightcard/shared-ui/index';
import React, { FC, useState } from 'react';
import { useMedia } from 'react-use';

export type companyPageFilterAllType = 'All';
export const companyPageFilterAllLabel: companyPageFilterAllType = 'All';

export type CompanyPageFilterOptions = OfferTypeStrLiterals | companyPageFilterAllType;

type props = {
  enabledFilters: CompanyPageFilterOptions[];
  onSelected: (pillType: CompanyPageFilterOptions) => void;
};

const offerTypesArray = Object.keys(offerTypeParser) as Array<keyof typeof offerTypeParser>;
export const CompanyPageFiltersTypes: CompanyPageFilterOptions[] = [
  companyPageFilterAllLabel,
  ...offerTypesArray,
];

const CompanyPageFilters: FC<props> = ({ enabledFilters, onSelected }) => {
  const isMobile = useMedia('(max-width: 500px)');

  const [selected, setSelected] = useState<CompanyPageFilterOptions>(companyPageFilterAllLabel);
  const selectionHandler = (pillType: CompanyPageFilterOptions) => {
    if (![companyPageFilterAllLabel, ...enabledFilters].includes(pillType)) {
      return;
    }

    const newType = selected === pillType ? companyPageFilterAllLabel : pillType;

    setSelected(newType);
    onSelected(newType);
  };

  return (
    <div className="py-6 flex gap-3 overflow-x-auto">
      {CompanyPageFiltersTypes.map((pillType, index) => {
        return (
          <div key={'Filter-' + index}>
            <PillButtons
              text={
                pillType === offerTypeParser.Giftcards.type
                  ? offerTypeParser.Giftcards.label
                  : CompanyPageFiltersTypes[index]
              }
              onSelected={() => selectionHandler(pillType)}
              isSelected={selected === pillType}
              platform={isMobile ? PlatformVariant.MobileHybrid : PlatformVariant.Web}
              disabled={
                pillType !== companyPageFilterAllLabel && !enabledFilters.includes(pillType)
              }
            />
          </div>
        );
      })}
    </div>
  );
};

export default CompanyPageFilters;
