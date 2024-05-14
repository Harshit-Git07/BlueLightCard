import { Amplitude } from './amplitude';
import amplitudeEvents from '@/utils/amplitude/events';

type LogCompanyViewParams = {
  amplitude: Amplitude | null | undefined;
  userUuid?: string;
  eventSource: string;
  origin: string;
  companyId?: string;
  companyName?: string;
};

export const logCompanyView = ({
  amplitude,
  userUuid,
  eventSource,
  origin,
  companyId,
  companyName,
}: LogCompanyViewParams) => {
  if (amplitude && companyId) {
    amplitude.setUserId(userUuid ?? '');
    amplitude.trackEventAsync(amplitudeEvents.COMPANY_VIEWED, {
      company_id: companyId,
      company_name: companyName,
      source: eventSource,
      origin,
    });
  }
};
