export type PillGroupProps = {
  pillGroup: PillProps[];
  onSelectedPill: (pill: PillProps) => void;
  title: string;
};

// This might need to be adapt in future when we know the result coming from the API
export interface PillProps {
  id: number;
  label: string;
}
[];
