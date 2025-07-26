import React from "react";
import { Form } from "../src/components/form";
import { TextField } from "../src/components/fields";
import { SubmitButton } from "../src/components/form";

export default function SimpleFormExample() {
  return (
    <Form action="/submit" method="post" defaultValues={{ name: "" }}>
      <TextField name="name" label="Имя" placeholder="Введите имя" />
      <SubmitButton>Отправить</SubmitButton>
    </Form>
  );
}
