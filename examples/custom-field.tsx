import React from "react";
import { Form } from "../src/components/form";
import { Field } from "../src/components/fields";
import { SubmitButton } from "../src/components/form";

export default function CustomFieldExample() {
  return (
    <Form
      action="/custom-field"
      method="post"
      defaultValues={{ color: "#ff0000" }}
    >
      <Field
        name="color"
        label="Выберите цвет"
        controller={({ value, onChange }) => (
          <input
            type="color"
            value={String(value)}
            onChange={(e) => onChange(e.target.value)}
            style={{
              width: 48,
              height: 32,
              border: "none",
              background: "none",
            }}
          />
        )}
      />
      <SubmitButton>Сохранить</SubmitButton>
    </Form>
  );
}
