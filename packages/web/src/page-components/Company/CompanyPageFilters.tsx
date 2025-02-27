import {
  getCompanyOffersQuery,
  getCompanyQuery,
  offerTypeLabelMap,
  PillButtons,
  PlatformVariant,
} from '@bluelightcard/shared-ui';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMedia } from 'react-use';
import { useCmsEnabled } from '../../common/hooks/useCmsEnabled';
import { useContext } from 'react';
import AmplitudeContext from '../../common/context/AmplitudeContext';
import amplitudeEvents from '@/utils/amplitude/events';

type Props = {
  companyId: string;
  value: string | null;
  onChange: (value: string | null) => void;
};

const CompanyPageFilters = (props: Props) => {
  const amplitude = useContext(AmplitudeContext);
  const isMobile = useMedia('(max-width: 500px)');
  const cmsEnabled = useCmsEnabled();

  const company = useSuspenseQuery(getCompanyQuery(props.companyId, cmsEnabled));
  const offerTypes = useSuspenseQuery({
    ...getCompanyOffersQuery(props.companyId, cmsEnabled),
    select: (data) => {
      const types = data?.map((offer) => offer.type) ?? [];

      return Array.from(new Set(types));
    },
  });

  const onSelect = (type: string | null) => {
    props.onChange(type);

    if (amplitude) {
      amplitude.trackEventAsync(amplitudeEvents.COMPANY_FILTER_CLICKED, {
        company_id: company.data.id,
        company_name: company.data.name,
        filter_name: props.value ?? 'All',
      });
    }
  };

  if (offerTypes.data.length === 0) {
    return <div className="py-6"></div>;
  }

  return (
    <div className="py-6 flex gap-3 overflow-x-auto">
      <div key={'Filter-all'}>
        <PillButtons
          text={'All'}
          onSelected={() => onSelect(null)}
          isSelected={props.value === null}
          platform={isMobile ? PlatformVariant.MobileHybrid : PlatformVariant.Web}
        />
      </div>
      {offerTypes.data.map((type, index) => {
        return (
          <div key={'Filter-' + index}>
            <PillButtons
              text={offerTypeLabelMap[type]}
              onSelected={() => onSelect(type)}
              isSelected={props.value === type}
              platform={isMobile ? PlatformVariant.MobileHybrid : PlatformVariant.Web}
            />
          </div>
        );
      })}
    </div>
  );
};

export default CompanyPageFilters;
