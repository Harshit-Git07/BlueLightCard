import { InputFieldSharedProps } from "../_shared/types";

interface DOBProps {
    value?: string;
    error?: boolean;
    placeholder?: string;
}

export type InputDOBFieldProps = InputFieldSharedProps<HTMLInputElement> & {
    dd?: DOBProps;
    mm?: DOBProps;
    yyyy?: DOBProps;
    minAgeConstraint?: number;
};
