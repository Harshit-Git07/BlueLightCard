export type AustralianStateId = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export interface AustralianState {
  id: AustralianStateId;
  label: string;
}

export const australianStates: AustralianState[] = [
  {
    id: 'NSW',
    label: 'New South Wales',
  },
  {
    id: 'VIC',
    label: 'Victoria',
  },
  {
    id: 'QLD',
    label: 'Queensland',
  },
  {
    id: 'WA',
    label: 'Western Australia',
  },
  {
    id: 'SA',
    label: 'South Australia',
  },
  {
    id: 'TAS',
    label: 'Tasmania',
  },
  {
    id: 'NT',
    label: 'Northern Territory',
  },
  {
    id: 'ACT',
    label: 'Australian Capital Territory',
  },
] as const;
