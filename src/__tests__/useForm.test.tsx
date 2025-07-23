import { userEvent } from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";

import { useFormContext, useWatch } from "../hooks";
import { Form } from "../components/form";

const user = userEvent.setup();

const TestWatchComponent = ({ name = "test" }: { name?: string }) => {
  const value = useWatch(name);

  return <div data-testid="test-watch">{value}</div>;
};

const Input = ({ name = "test" }: { name?: string }) => {
  const { setValue } = useFormContext();

  const onChange = (value: string) => {
    setValue(name, value);
  };

  return (
    <input
      type="text"
      name="test"
      aria-label="test"
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

describe("useWatch", () => {
  it("should render default form input value", () => {
    render(
      <Form
        action="/submit"
        method="post"
        data-testid="form"
        defaultValues={{ test: "initial" }}
      >
        <Input />
        <TestWatchComponent />
      </Form>
    );

    expect(screen.getByTestId("test-watch")).toHaveTextContent("initial");
  });

  it("should render value after input change", async () => {
    render(
      <Form
        action="/submit"
        method="post"
        data-testid="form"
        defaultValues={{ test: "initial" }}
      >
        <Input />
        <TestWatchComponent />
      </Form>
    );

    const testWatchComponent = screen.getByTestId("test-watch");
    const input = screen.getByRole("textbox", { name: /test/i });

    expect(testWatchComponent).toHaveTextContent("initial");

    user.type(input, "changed");

    await waitFor(() => {
      expect(testWatchComponent).toHaveTextContent("changed");
    });
  });

  it("should render value for a nested field ", async () => {
    render(
      <Form
        action="/submit"
        method="post"
        data-testid="form"
        defaultValues={{ test: { a: "initial" } }}
      >
        <Input name="test.a" />
        <TestWatchComponent name="test.a" />
      </Form>
    );

    const testWatchComponent = screen.getByTestId("test-watch");
    const input = screen.getByRole("textbox", { name: /test/i });

    expect(testWatchComponent).toHaveTextContent("initial");

    user.type(input, "changed");

    await waitFor(() => {
      expect(testWatchComponent).toHaveTextContent("changed");
    });
  });
});
