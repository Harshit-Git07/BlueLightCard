import { useMemo } from 'react';

interface Employer {
  id: string;
  label: string;
}

export function useEmployers(organisation: string | undefined): Employer[] | undefined {
  return useMemo(() => {
    if (!organisation) return undefined;
    /*
     This is a stub implementation to represent the Api call return a list of employers based off organisation, some organisations will not have employers,
     therefore we return an empty array which is then used to not render the Select Employer dropdown.
     */
    if (organisation === 'Blood Bikes') {
      return [];
    }
    return [
      { id: '1', label: 'Employer 1' },
      { id: '2', label: 'Employer 2' },
      { id: '3', label: 'Employer 3' },
    ];
  }, [organisation]);
}
