import { render, screen } from "@testing-library/react";

import { Form, SubmitButton } from "../components/form";
import { TextField } from "../components/fields";

import * as z from "zod";
import * as yup from "yup";
import joi from "joi";

import userEvent from "@testing-library/user-event";
import { useFormContext } from "../hooks";

const submitForm = async () => {
  const user = userEvent.setup();

  const button = screen.getByRole("button", { name: /submit/i });

  await user.click(button);
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
        <SubmitButton>Submit</SubmitButton>
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
        <SubmitButton>Submit</SubmitButton>
      </Form>
    );

    await submitForm();

    expect(screen.getByText("test is required")).toBeInTheDocument();
  });

  it("should validate form data with joi", async () => {
    const schema = joi.object({
      test: joi.string().required().messages({
        "any.required": "test is required",
        "string.empty": "test is required",
      }),
    });

    render(
      <Form
        action="/submit"
        method="post"
        data-testid="form"
        validationSchema={schema}
      >
        <TextField name="test" />
        <SubmitButton>Submit</SubmitButton>
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
        <SubmitButton>Submit</SubmitButton>
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
        <SubmitButton>Submit</SubmitButton>
      </Form>
    );

    expect(screen.getByText("Shared Label")).toBeInTheDocument();
  });
});
