import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare } from "@fortawesome/free-regular-svg-icons";
import { FC } from "react";
import { Button } from "react-bootstrap";
import styled from "styled-components";

export interface ExampleComponentProps {
    text: string;
    buttonText: string;
    showButtonIcon?: boolean;
}

const StyledButton = styled(Button)`
    margin-bottom: 10px;
`;

const StyledButtonIcon = styled(FontAwesomeIcon)`
    margin-right: 5px;
`;

const Example: FC<ExampleComponentProps> = ({ text, buttonText, showButtonIcon }) => {
    const onClick = () => {
        console.info(text);
    };

    return (
        <div>
            <StyledButton onClick={onClick}>
                {showButtonIcon && <StyledButtonIcon icon={faCheckSquare} />}
                {buttonText}
            </StyledButton>
            <h2>{text} example</h2>
        </div>
    );
}

export default Example;