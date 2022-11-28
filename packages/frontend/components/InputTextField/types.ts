import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FormControlProps } from "react-bootstrap";
import { InputFieldSharedProps } from "../FieldGroup/types";

export type InputTextFieldProps = FormControlProps & InputFieldSharedProps<HTMLInputElement> & {
    icon?: IconDefinition;
};