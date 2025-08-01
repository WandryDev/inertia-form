import React from "react";
import { Form } from "../src/components/form";
import {
  TextField,
  TextareaField,
  SelectField,
  CheckboxField,
} from "../src/components/fields";
import { SubmitButton } from "../src/components/form";

export default function FieldsDemoExample() {
  return (
    <Form
      action="/fields-demo"
      method="post"
      defaultValues={{
        username: "",
        about: "",
        gender: "male",
        agree: false,
      }}
    >
      <TextField
        name="username"
        label="Имя пользователя"
        placeholder="Введите имя пользователя"
      />
      <TextareaField
        name="about"
        label="О себе"
        placeholder="Расскажите о себе"
      />
      <SelectField
        name="gender"
        label="Пол"
        options={[
          { title: "Мужской", value: "male" },
          { title: "Женский", value: "female" },
        ]}
      />
      <CheckboxField name="agree" label="Согласен с условиями" />
      <SubmitButton>Сохранить</SubmitButton>
    </Form>
  );
}
