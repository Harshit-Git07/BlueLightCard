import { ChangeEventHandler, PropsWithChildren } from "react";
import { FormGroupProps, InputGroupProps } from "react-bootstrap";

export type FieldGroupProps = Pick<FormGroupProps, "controlId"> &
    PropsWithChildren & {
        labelText: string;
        invalid?: boolean;
        message?: string;
    };

export interface InputFieldSharedProps<E, V = string> {
    error?: boolean;
    value?: V;
    onChange?: ChangeEventHandler<E>;
}
