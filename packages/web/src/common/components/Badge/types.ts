export type BgColorString = `bg-${string}`;

export type BadgeProps = {
  label: string;
  color: BgColorString;
  size: 'small' | 'large';
};
