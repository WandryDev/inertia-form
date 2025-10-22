import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { Field } from "../core/fields";
import { Form } from "../core/form";
import { vi } from "vitest";

const user = userEvent.setup();

describe("Field", () => {
  it("should correctly render default layout", () => {
    render(
      <Form action="">
        <Field
          name="test"
          controller={(field) => (
            <label htmlFor="input">
              Test field
              <input id="input" />
            </label>
          )}
        />
      </Form>
    );

    expect(screen.getByText("Test field")).toBeInTheDocument();
  });

  it("should correctly render controller", () => {
    render(
      <Form action="">
        <Field name="test" controller={(field) => <input />} />
      </Form>
    );

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should correctly render entered value", async () => {
    render(
      <Form action="">
        <Field
          name="test"
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
