export interface AccordionProps {
  header: string;
  icon?: React.ReactNode;
  childComponent?: React.ReactNode;
}

export interface AccordionChildTextProps {
  text: string;
}

export interface AccordionChildInputProps {
  fields: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
}
