import { useSuspenseQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import {
  getCompanyOffersQuery,
  offerTypeLabelMap,
  PillButtons,
  PlatformVariant,
} from '@bluelightcard/shared-ui';
import { useCmsEnabled } from '@/hooks/useCmsEnabled';
import { selectedFilter } from '../atoms';
import { FiltersType } from '../types';

const offerTypesArray = Object.keys(offerTypeLabelMap) as Array<keyof typeof offerTypeLabelMap>;
const filterArray: FiltersType[] = ['All', ...offerTypesArray];

const PillsController = ({ companyId }: { companyId: string }) => {
  const [selectedType, setSelectedType] = useAtom(selectedFilter);

  const toggleFilter = (pillType: FiltersType) => {
    if (selectedType === pillType) {
      setSelectedType('All');
    } else {
      setSelectedType(pillType);
    }
  };

  const cmsEnabled = useCmsEnabled();
  const { data: offers } = useSuspenseQuery(getCompanyOffersQuery(companyId, cmsEnabled));

  return (
    <div className="py-4 flex gap-3 overflow-x-auto">
      {filterArray.map((pillType) => {
        return (
          <div key={pillType}>
            <PillButtons
              text={pillType === 'All' ? pillType : offerTypeLabelMap[pillType]}
              onSelected={() => toggleFilter(pillType)}
              isSelected={selectedType === pillType}
              disabled={pillType !== 'All' && !offers?.find((offer) => offer.type === pillType)}
              platform={PlatformVariant.MobileHybrid}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PillsController;
