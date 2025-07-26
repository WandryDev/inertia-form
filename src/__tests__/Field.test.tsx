import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { Field } from "../components/fields";
import { Form } from "../components/form";
import { vi } from "vitest";

const user = userEvent.setup();

describe("Field", () => {
  it("should correctly render default layout", () => {
    render(
      <Form action="">
        <Field name="test" label="Test field" controller={(field) => <></>} />
      </Form>
    );

    expect(screen.getByText("Test field")).toBeInTheDocument();
    expect(screen.getByTestId("field-group")).toBeInTheDocument();
  });

  it("should correctly render controller", () => {
    render(
      <Form action="">
        <Field
          name="test"
          label="Test field"
          controller={(field) => <input />}
        />
      </Form>
    );

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should correctly render entered value", async () => {
    render(
      <Form action="">
        <Field
          name="test"
          label="Test field"
          controller={(field) => (
            <input
              value={field.value as string}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
      </Form>
    );

    const input = screen.getByRole("textbox");

    await user.type(input, "test value");

    expect(input).toHaveValue("test value");
  });

  it("should throw error when Field is used outside Form", () => {
    vi.spyOn(console, "error");

    expect(() => {
      render(
        <Field
          name="test"
          label="Test field"
          controller={(field) => (
            <input
              value={field.value as string}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
      );
    }).toThrow("Field must be used inside Form component");
  });
});
