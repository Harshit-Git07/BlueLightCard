import { FC } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { InputFieldProps } from "./types";

const InputField: FC<InputFieldProps> = ({
    labelText,
    controlId,
    children,
    invalid,
    invalidMessage,
    hasValidation = true,
}) => {
    return (
        <Form.Group controlId={controlId}>
            <Form.Label>{labelText}</Form.Label>
            <InputGroup hasValidation={hasValidation}>
                {children}
                {invalidMessage &&
                    <Form.Control.Feedback type={invalid ? "invalid" : undefined}>
                        {invalidMessage}
                    </Form.Control.Feedback>
                }
            </InputGroup>
        </Form.Group>
    );
};

export default InputField;