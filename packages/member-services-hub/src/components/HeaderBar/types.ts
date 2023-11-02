export type HeaderBarProps = {
  firstname: string;
  surname: string;
  email: string;
  button?: boolean;
  chevronPosition?: 'left' | 'right';
  notifications?: boolean;
  messages?: boolean;
  calender?: boolean;
  welcome?: boolean;
  welcomeHeader?: string;
  welcomeText?: string;
  search?: boolean;
  profilePicture?: string;
  buttonText?: string;
};
