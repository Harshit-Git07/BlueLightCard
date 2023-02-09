import { PropsWithChildren } from "react";
import { FormGroupProps } from "react-bootstrap";

export type FieldGroupProps = Pick<FormGroupProps, "controlId"> &
    PropsWithChildren & {
        labelText: string;
        invalid?: boolean;
        message?: string;
    };
