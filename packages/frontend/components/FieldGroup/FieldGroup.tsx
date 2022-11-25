import { FC } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { FieldGroupProps } from "./types";

const FieldGroup: FC<FieldGroupProps> = ({
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

export default FieldGroup;