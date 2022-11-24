import Button from "@/components/button/Button";
import { ButtonProps } from "@/components/button/types";
import { render, screen } from "@testing-library/react";

describe("Button component", () => {
    let props: ButtonProps;

    beforeEach(() => {
        props = {
            text: "Button",
        };
    });

    describe("smoke test", () => {
        it("should render component without error", () => {
            render(<Button {...props} />);

            const button = screen.getByRole("button");

            expect(button).toBeTruthy();
        });
    });
});