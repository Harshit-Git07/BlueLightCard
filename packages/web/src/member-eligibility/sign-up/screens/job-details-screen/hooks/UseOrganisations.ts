import { useMemo } from 'react';

interface Organisation {
  id: string;
  label: string;
}

export function useOrganisations(): Organisation[] {
  // This is a stub implementation to represent the Api call which will return a list of organisations
  return useMemo(
    () => [
      { id: '1', label: 'Police' },
      { id: '2', label: 'NHS' },
      { id: '3', label: 'Blood Bikes' },
      { id: '4', label: 'Ambulance' },
      { id: '5', label: 'Dentist' },
      { id: '6', label: 'Option 6' },
    ],
    []
  );
}
