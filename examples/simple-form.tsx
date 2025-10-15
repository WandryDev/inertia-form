import React from "react";
import { Form } from "../src/core/form";
import { TextField } from "../src/core/fields";
import { SubmitButton } from "../src/core/form";

export default function SimpleFormExample() {
  return (
    <Form action="/submit" method="post" defaultValues={{ name: "" }}>
      <TextField name="name" label="Имя" placeholder="Введите имя" />
      <SubmitButton>Отправить</SubmitButton>
    </Form>
  );
}
