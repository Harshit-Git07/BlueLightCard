export type ShareButtonProps = {
  showShareLabel?: boolean;
  shareDetails: {
    name: string | undefined;
    description: string | undefined;
    url: string;
  };
  shareLabel?: string;
};
