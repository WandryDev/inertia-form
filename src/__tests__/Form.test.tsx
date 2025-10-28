import { render, screen } from "@testing-library/react";

import * as z from "zod";
import * as yup from "yup";

import userEvent from "@testing-library/user-event";

import { useFormContext } from "../hooks";

import { Form } from "../core/form";
import { Field } from "../core/fields";

const submitForm = async () => {
  const user = userEvent.setup();

  const button = screen.getByRole("button", { name: /submit/i });

  await user.click(button);
};

const TextField = ({ name, label }: { name: string; label?: string }) => {
  return (
    <Field
      name={name}
      label={label}
      controller={(field) => (
        <input
          value={field.value as string}
          onChange={(e) => field.onChange(e.target.value)}
        />
      )}
    />
  );
};

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

  it("should validate form data with zod", async () => {
    const schema = z.object({
      test: z.string("test is required"),
    });

    render(
      <Form
        action="/submit"
        method="post"
        data-testid="form"
        validationSchema={schema}
      >
        <TextField name="test" />
        <button type="submit">Submit</button>
      </Form>
    );

    await submitForm();

    expect(screen.getByText("test is required")).toBeInTheDocument();
  });

  it("should validate form data with yup", async () => {
    const schema = yup.object({
      test: yup.string().required("test is required"),
    });

    render(
      <Form
        action="/submit"
        method="post"
        data-testid="form"
        validationSchema={schema}
      >
        <TextField name="test" />
        <button type="submit">Submit</button>
      </Form>
    );

    await submitForm();

    expect(screen.getByText("test is required")).toBeInTheDocument();
  });

  it("should validate form data with custom validator", async () => {
    const validator = {
      validate: async (data: any) => {
        return { success: false, errors: { test: "test is required" } };
      },
    };

    render(
      <Form
        action="/submit"
        method="post"
        data-testid="form"
        validator={validator}
      >
        <TextField name="test" />
        <button type="submit">Submit</button>
      </Form>
    );

    await submitForm();

    expect(screen.getByText("test is required")).toBeInTheDocument();
  });

  it("should inject shared props a cross children", async () => {
    const TestComp = () => {
      const { sharedProps } = useFormContext();
      return <TextField name="test" label={sharedProps?.label} />;
    };

    render(
      <Form
        action="/submit"
        method="post"
        data-testid="form"
        sharedProps={{ label: "Shared Label" }}
      >
        <TestComp />
        <button type="submit">Submit</button>
      </Form>
    );

    expect(screen.getByText("Shared Label")).toBeInTheDocument();
  });

  it("should reset form data when reset method is called with fields", async () => {
    const TestComponent = () => {
      const { reset } = useFormContext();

      return (
        <>
          <TextField name="test" />
          <button type="button" onClick={() => reset(["test"])}>
            Reset
          </button>
          <button type="submit">Submit</button>
        </>
      );
    };

    render(
      <Form action="/submit" method="post" data-testid="form">
        <TestComponent />
      </Form>
    );

    const user = userEvent.setup();
    const input = screen.getByRole("textbox");
    const resetButton = screen.getByRole("button", { name: /reset/i });

    // Type some text
    await user.type(input, "test value");
    expect(input).toHaveValue("test value");

    // Reset the form
    await user.click(resetButton);
    expect(input).toHaveValue(undefined);
  });

  it("should reset form when reset method is called without fields", async () => {
    const TestComponent = () => {
      const { reset } = useFormContext();

      return (
        <>
          <button type="button" onClick={() => reset()}>
            Reset
          </button>
          <button type="submit">Submit</button>
        </>
      );
    };

    render(
      <Form action="/submit" method="post" data-testid="form">
        <TestComponent />
      </Form>
    );

    const user = userEvent.setup();
    const resetButton = screen.getByRole("button", { name: /reset/i });

    // Reset should work even without fields
    await user.click(resetButton);
    expect(resetButton).toBeInTheDocument();
  });
});
