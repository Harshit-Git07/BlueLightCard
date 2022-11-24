import { ChangeEventHandler, PropsWithChildren } from "react";
import { FormControlProps, FormGroupProps, InputGroupProps } from "react-bootstrap";

export type InputFieldProps = Pick<FormGroupProps, "controlId"> & Pick<InputGroupProps, "hasValidation"> & PropsWithChildren & {
    labelText: string;
    invalid?: boolean;
    invalidMessage?: string;
}

export interface InputFieldSharedProps {
    required?: boolean;
    onChange?: ChangeEventHandler;
}