export interface AlertBoxProps {
  alertType: string;
  title: string;
  description: any;
}

export interface style {
  textColor: string;
  backgroundColor: string;
}

export interface config {
  [key: string]: style;
}
