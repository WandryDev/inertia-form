import { render, screen } from "@testing-library/react";

import { Form } from "../components/form";

describe("Form", () => {
  it("should render without crashing", () => {
    render(<Form action="/submit" method="post" data-testid="form"></Form>);

    expect(screen.getByTestId("form")).toBeInTheDocument();
  });

  it("should render form input with submit button", () => {
    render(
      <Form action="/submit" method="post" data-testid="form">
        <input type="text" name="test" />
        <button type="submit">Submit</button>
      </Form>
    );

    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });
});
