import { ReactElement } from "react";

interface Props {
    text: string;
}

export default function Example({ text }: Props): ReactElement {
    return <h2>{text}</h2>;
}