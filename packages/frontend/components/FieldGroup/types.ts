import { ChangeEventHandler, PropsWithChildren } from "react";
import { FormGroupProps, InputGroupProps } from "react-bootstrap";

export type FieldGroupProps = Pick<FormGroupProps, "controlId"> & Pick<InputGroupProps, "hasValidation"> & PropsWithChildren & {
    labelText: string;
    invalid?: boolean;
    invalidMessage?: string;
}

export interface InputFieldSharedProps {
    error?: boolean;
    onChange?: ChangeEventHandler;
}