import { render, screen } from "@testing-library/react";
import Example, { ExampleComponentProps } from "@/components/example";

describe("Example component", () => {
    let props: ExampleComponentProps;

    beforeEach(() => {
        props = {
            text: "Hello World",
            buttonText: "",
        };
    });

    it("smoke test", () => {
        render(<Example {...props} />);

        const text = screen.getByText("Hello World");

        expect(text).toBeTruthy();
    });
});