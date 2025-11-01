import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useArrayField } from "../hooks/useArrayField";
import { Form } from "../core/form";
import { useField } from "../hooks";

const user = userEvent.setup();

const clickToAppendButton = () => {
  const appendButton = screen.getByTestId("append-button");

  return user.click(appendButton);
};

const clickToRemoveButton = (index: number) => {
  const removeButton = screen.getAllByTestId("remove-button")[index];

  return user.click(removeButton);
};

const TestField = ({ name }: { name: string }) => {
  const { value, onChange } = useField(name);

  return <input data-testid="item" value={value} onChange={onChange} />;
};

const TestFields = () => {
  const { append, remove, value } = useArrayField("items");

  return (
    <div>
      <button
        data-testid="append-button"
        type="button"
        onClick={() => append({ id: "new" })}
      >
        Append
      </button>

      {value.map((item, index) => (
        <>
          <TestField key={item.id} name={`items[${index}].id`} />
          <button
            data-testid="remove-button"
            type="button"
            onClick={() => remove(index)}
          >
            Remove
          </button>
        </>
      ))}
    </div>
  );
};

describe("useArrayField", () => {
  it("should render default values correctly", async () => {
    render(
      <Form action="#" defaultValues={{ items: [{ id: "1" }] }}>
        <TestFields />
      </Form>
    );

    const items = screen.getAllByTestId("item");
    expect(items).toHaveLength(1);

    expect(items[0]).toHaveValue("1");
  });

  it("should append new item with default value correctly", async () => {
    render(
      <Form action="#" defaultValues={{ items: [{ id: "1" }] }}>
        <TestFields />
      </Form>
    );

    await clickToAppendButton();

    const items = screen.getAllByTestId("item");
    expect(items).toHaveLength(2);

    expect(items[0]).toHaveValue("1");
    expect(items[1]).toHaveValue("new");
  });

  it("should remove item correctly", async () => {
    render(
      <Form action="#" defaultValues={{ items: [{ id: "1" }] }}>
        <TestFields />
      </Form>
    );

    await clickToAppendButton();

    const appendedItems = screen.getAllByTestId("item");
    expect(appendedItems).toHaveLength(2);

    expect(appendedItems[0]).toHaveValue("1");
    expect(appendedItems[1]).toHaveValue("new");

    await clickToRemoveButton(1);

    const removedItems = screen.getAllByTestId("item");
    expect(removedItems).toHaveLength(1);
    expect(removedItems[0]).toHaveValue("1");
  });

  it("shouldn't remove first item", async () => {
    render(
      <Form action="#" defaultValues={{ items: [{ id: "1" }] }}>
        <TestFields />
      </Form>
    );

    await clickToRemoveButton(1);

    const removedItems = screen.getAllByTestId("item");
    expect(removedItems).toHaveLength(1);
    expect(removedItems[0]).toHaveValue("1");
  });
});
