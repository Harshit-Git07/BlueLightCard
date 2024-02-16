export interface LabelProps {
  text: string;
  type: string;
  className?: string;
}

export interface style {
  textColor: string;
  backgroundColor: string;
}

export interface config {
  [key: string]: style;
}
