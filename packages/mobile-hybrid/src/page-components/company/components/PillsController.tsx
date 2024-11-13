import { offerTypeLabelMap, PillButtons, PlatformVariant } from '@bluelightcard/shared-ui';
import { useAtom } from 'jotai';
import { FC } from 'react';
import { selectedFilter, companyDataAtom } from '../atoms';
import { filtersType, OfferModel, CMSOfferModel } from '../types';

const offerTypesArray = Object.keys(offerTypeLabelMap) as Array<keyof typeof offerTypeLabelMap>;
const filterArray: filtersType[] = ['All', ...offerTypesArray];

const PillsController: FC = () => {
  const [selectedType, setSelectedType] = useAtom(selectedFilter);

  const toggleFilter = (pillType: filtersType) => {
    if (selectedType === pillType) {
      setSelectedType('All');
    } else {
      setSelectedType(pillType);
    }
  };

  const company = useAtom(companyDataAtom)[0];
  const offers = company?.offers;

  return (
    <>
      <div className="py-4 flex gap-3 overflow-x-auto">
        {filterArray.map((pillType, index) => {
          return (
            <div key={index}>
              <PillButtons
                text={pillType === 'All' ? pillType : offerTypeLabelMap[pillType]}
                onSelected={() => toggleFilter(pillType)}
                isSelected={selectedType === pillType}
                disabled={
                  pillType !== 'All' &&
                  !offers?.find((offer: OfferModel | CMSOfferModel) => offer.type === pillType)
                }
                platform={PlatformVariant.MobileHybrid}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PillsController;
