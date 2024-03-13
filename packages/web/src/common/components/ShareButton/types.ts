export type ShareButtonProps = {
  onShareClick: () => void;
  shareBtnState?: 'share' | 'error' | 'success';
  hasText?: boolean;
};
