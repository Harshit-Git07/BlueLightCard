import { InputFieldSharedProps } from "../FieldGroup/types";

interface DOBProps {
    value?: string;
    error?: boolean;
}

export type InputDOBFieldProps = InputFieldSharedProps<HTMLInputElement> & {
    dd?: DOBProps;
    mm?: DOBProps;
    yyyy?: DOBProps;
};
