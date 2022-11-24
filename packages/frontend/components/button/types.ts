import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ButtonProps as ReactButtonProps } from "react-bootstrap/Button";
import { ThemeMode } from "types";

export type ButtonProps = ReactButtonProps & {
    text: string;
    iconLeft?: IconDefinition;
    iconRight?: IconDefinition;
    mode?: ThemeMode;
}