import { renderHook } from "@testing-library/react";

import { useField, useFormContext, useWatch } from "../hooks";
import { Form } from "../core/form";

const TestWatchComponent = ({ name = "test" }: { name?: string }) => {
  const value = useWatch<any>(name);

  return <div data-testid="test-watch">{value}</div>;
};

const Input = ({ name = "test" }: { name?: string }) => {
  const { value, onChange } = useField(name);

  return (
    <input
      type="text"
      aria-label="test"
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

describe("useWatch", () => {
  it("should return default value", () => {
    const result = renderHook(() => useWatch("watch"), {
      wrapper: ({ children }) => (
        <Form
          action="/submit"
          method="post"
          data-testid="form"
          defaultValues={{ watch: "initial" }}
        >
          {children}
          <Input name="watch" />
        </Form>
      ),
    });

    expect(result.result.current).toBe("initial");
  });
});
