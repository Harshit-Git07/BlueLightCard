export interface NotificationItemProps {
  id: string;
  title: string;
  subtext: string;
  isClicked: boolean;
  onClick: (id: string) => Promise<void>;
}
