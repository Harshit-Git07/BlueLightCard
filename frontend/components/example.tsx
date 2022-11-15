import { ReactElement } from "react";

export interface ExampleComponentProps {
    text: string;
}

export default function Example({ text }: ExampleComponentProps): ReactElement {
    return <h2>{text}</h2>;
}