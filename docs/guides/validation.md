# Валидация и обработка ошибок

`@wandry/inertia-form` поддерживает универсальную валидацию через схемы с автоматическим определением типа валидатора.

## Быстрый старт

```tsx
import { Form, TextField, SubmitButton } from "@wandry/inertia-form";
import * as yup from "yup";

const schema = yup.object({
  name: yup.string().required("Имя обязательно"),
  email: yup.string().email("Неверный email").required("Email обязателен"),
});

function MyForm() {
  return (
    <Form
      action="/submit"
      method="post"
      defaultValues={{ name: "", email: "" }}
      validationSchema={schema}
    >
      <TextField name="name" label="Имя" />
      <TextField name="email" label="Email" type="email" />
      <SubmitButton>Отправить</SubmitButton>
    </Form>
  );
}
```

## Поддерживаемые библиотеки

Библиотека автоматически определяет тип схемы и использует соответствующий адаптер:

- **Yup** - `yup.object()`
- **Zod** - `z.object()`
- **Joi** - `Joi.object()`
- **Кастомные адаптеры** - через интерфейс `ValidationAdapter`

## API

### Form Props

| Prop               | Тип                 | Описание                          |
| ------------------ | ------------------- | --------------------------------- |
| `validationSchema` | `any`               | Схема валидации (автоопределение) |
| `validator`        | `ValidationAdapter` | Кастомный адаптер валидации       |

### ValidationAdapter Interface

```tsx
interface ValidationAdapter {
  validate(data: any): Promise<{
    success: boolean;
    errors?: Record<string, string>;
  }>;
}
```

## Примеры

### Yup схема

```tsx
import * as yup from "yup";

const userSchema = yup.object({
  name: yup.string().required("Имя обязательно").min(2, "Минимум 2 символа"),
  email: yup.string().email("Неверный email").required("Email обязателен"),
  age: yup.number().min(18, "Минимум 18 лет").required("Возраст обязателен"),
  password: yup
    .string()
    .min(8, "Минимум 8 символов")
    .required("Пароль обязателен"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Пароли не совпадают"),
});

<Form
  action="/users"
  method="post"
  defaultValues={{
    name: "",
    email: "",
    age: 0,
    password: "",
    confirmPassword: "",
  }}
  validationSchema={userSchema}
>
  <TextField name="name" label="Имя" />
  <TextField name="email" label="Email" type="email" />
  <TextField name="age" label="Возраст" type="number" />
  <TextField name="password" label="Пароль" type="password" />
  <TextField
    name="confirmPassword"
    label="Подтвердите пароль"
    type="password"
  />
  <SubmitButton>Создать пользователя</SubmitButton>
</Form>;
```

### Zod схема

```tsx
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Имя обязательно"),
  email: z.string().email("Неверный email"),
  message: z.string().min(10, "Минимум 10 символов"),
  agree: z.boolean().refine((val) => val === true, "Необходимо согласие"),
});

<Form
  action="/contact"
  method="post"
  defaultValues={{ name: "", email: "", message: "", agree: false }}
  validationSchema={contactSchema}
>
  <TextField name="name" label="Имя" />
  <TextField name="email" label="Email" type="email" />
  <TextareaField name="message" label="Сообщение" rows={4} />
  <CheckboxField name="agree" label="Согласен с условиями" />
  <SubmitButton>Отправить</SubmitButton>
</Form>;
```

### Joi схема

```tsx
import Joi from "joi";

const productSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Название обязательно",
    "any.required": "Название обязательно",
  }),
  price: Joi.number().positive().required().messages({
    "number.base": "Цена должна быть числом",
    "number.positive": "Цена должна быть положительной",
  }),
  category: Joi.string().valid("electronics", "clothing", "books").required(),
});

<Form
  action="/products"
  method="post"
  defaultValues={{ title: "", price: 0, category: "" }}
  validationSchema={productSchema}
>
  <TextField name="title" label="Название товара" />
  <TextField name="price" label="Цена" type="number" step="0.01" />
  <SelectField
    name="category"
    label="Категория"
    options={[
      { value: "electronics", title: "Электроника" },
      { value: "clothing", title: "Одежда" },
      { value: "books", title: "Книги" },
    ]}
  />
  <SubmitButton>Добавить товар</SubmitButton>
</Form>;
```

## Кастомные адаптеры

Если нужна поддержка других библиотек или кастомная логика:

```tsx
import { ValidationAdapter } from "@wandry/inertia-form";

// Кастомный адаптер для библиотеки VeeValidate
const veeValidateAdapter: ValidationAdapter = {
  async validate(data) {
    const { validate } = await import("@vee-validate/rules");

    const errors: Record<string, string> = {};

    // Валидация имени
    const nameResult = await validate(data.name, "required|min:2");
    if (!nameResult.valid) {
      errors.name = nameResult.errors[0];
    }

    // Валидация email
    const emailResult = await validate(data.email, "required|email");
    if (!emailResult.valid) {
      errors.email = emailResult.errors[0];
    }

    return {
      success: Object.keys(errors).length === 0,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
    };
  },
};

<Form
  action="/submit"
  method="post"
  defaultValues={{ name: "", email: "" }}
  validator={veeValidateAdapter}
>
  <TextField name="name" label="Имя" />
  <TextField name="email" label="Email" type="email" />
  <SubmitButton>Отправить</SubmitButton>
</Form>;
```

## Асинхронная валидация

Все адаптеры поддерживают асинхронную валидацию:

```tsx
const asyncSchema = yup.object({
  email: yup
    .string()
    .email()
    .test("unique-email", "Email уже используется", async (value) => {
      if (!value) return true;
      const response = await fetch(`/api/check-email?email=${value}`);
      const { available } = await response.json();
      return available;
    }),
  username: yup
    .string()
    .test("unique-username", "Имя пользователя занято", async (value) => {
      if (!value) return true;
      const response = await fetch(`/api/check-username?username=${value}`);
      const { available } = await response.json();
      return available;
    }),
});
```

## Обработка ошибок

Ошибки валидации автоматически отображаются в соответствующих полях:

```tsx
// Если валидация не прошла, ошибки показываются так:
{
  "name": "Имя обязательно",
  "email": "Неверный формат email",
  "age": "Возраст должен быть больше 18"
}
```

## Комбинирование с серверной валидацией

Клиентская валидация работает вместе с серверной:

```tsx
<Form
  action="/users"
  method="post"
  defaultValues={{ name: "", email: "" }}
  validationSchema={clientSchema}
  options={{
    onError: (errors) => {
      // Серверные ошибки валидации
      console.log("Серверные ошибки:", errors);
    },
  }}
>
  {/* Поля формы */}
</Form>
```

## Производительность

- Валидация происходит только при отправке формы
- Адаптеры кэшируются для повторного использования
- Асинхронная валидация не блокирует UI

## Следующие шаги

- [Кастомные поля](./custom-fields.md)
- [Условная отрисовка](./conditional-rendering.md)
- [Интеграция с Laravel](./laravel-integration.md)
