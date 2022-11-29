import { ChangeEventHandler, PropsWithChildren } from "react";
import { FormGroupProps, InputGroupProps } from "react-bootstrap";

export type FieldGroupProps = Pick<FormGroupProps, "controlId"> &
    PropsWithChildren & {
        labelText: string;
        invalid?: boolean;
        message?: string;
    };

export interface InputFieldSharedProps<E> {
    error?: boolean;
    value?: string;
    onChange?: ChangeEventHandler<E>;
}
