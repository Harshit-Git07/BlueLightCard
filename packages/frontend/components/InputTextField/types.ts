import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { MouseEventHandler } from "react";
import { FormControlProps } from "react-bootstrap";
import { InputFieldSharedProps } from "../FieldGroup/types";

export type InputTextFieldProps = FormControlProps &
    InputFieldSharedProps<HTMLInputElement> & {
        icon?: IconDefinition;
        onTogglePasswordVisible?: () => void;
    };
