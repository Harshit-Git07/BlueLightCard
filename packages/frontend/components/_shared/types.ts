import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ChangeEventHandler, MouseEventHandler, PropsWithChildren } from "react";

export type InputFieldWrapperProps = PropsWithChildren & {
    icon?: IconDefinition;
    iconRight?: IconDefinition;
    showRightIcon?: boolean;
    showErrorState?: boolean;
    onRightIconClick?: MouseEventHandler;
};

export interface StyledInputProps {
    error?: boolean;
    $spaceForIcon?: boolean;
}
