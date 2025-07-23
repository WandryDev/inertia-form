# @wandry/inertia-form

Production-ready React form components for [Inertia.js](https://inertiajs.com/) with TypeScript support. Позволяет быстро создавать формы с поддержкой валидации, ошибок, сброса, кастомных полей и современных UI-практик (Radix UI, shadcn/ui, Tailwind).

## Особенности

- Простая интеграция с Inertia.js и React
- Компоненты для типовых полей: TextField, SelectField, CheckboxField, TextareaField
- Базовый Field для создания собственных контролов
- Хуки для работы с формой: `useFormContext`, `useWatch`
- Поддержка ошибок, сброса, кастомных обработчиков
- Современный UI (Radix, shadcn, Tailwind)
- TypeScript-first

## Установка

```bash
pnpm add @wandry/inertia-form
# или
npm install @wandry/inertia-form
# или
yarn add @wandry/inertia-form
```

> **Важно:**
> Пакет требует peer-зависимости: `react`, `@inertiajs/core`, `@inertiajs/react`, `@radix-ui/react-*`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`.

## Быстрый старт

```tsx
import { Form, SubmitButton } from "@wandry/inertia-form";
import {
  TextField,
  SelectField,
  CheckboxField,
  TextareaField,
} from "@wandry/inertia-form";

export function ExampleForm() {
  return (
    <Form
      action="/submit"
      method="post"
      defaultValues={{ name: "", agree: false }}
    >
      <TextField name="name" label="Имя" />
      <SelectField
        name="role"
        label="Роль"
        options={[
          { value: "admin", title: "Админ" },
          { value: "user", title: "Пользователь" },
        ]}
      />
      <CheckboxField name="agree" label="Согласен с условиями" />
      <TextareaField name="bio" label="О себе" />
      <SubmitButton>Отправить</SubmitButton>
    </Form>
  );
}
```

## API

### Компоненты

- **Form** — основной компонент формы. Пропсы: `action`, `method`, `defaultValues`, `onSubmit`, `className` и др.
- **TextField** — текстовое поле. Пропсы: `name`, `label`, `type`, `labelClassName` и др.
- **SelectField** — выпадающий список. Пропсы: `name`, `label`, `options`, `labelClassName` и др.
- **CheckboxField** — чекбокс. Пропсы: `name`, `label`.
- **TextareaField** — многострочное поле. Пропсы: `name`, `label`, `rows`, `labelClassName` и др.
- **Field** — базовый компонент для создания собственных контролов.
- **SubmitButton** — кнопка отправки формы, автоматически блокируется при отправке.

### Хуки

- **useFormContext** — доступ к состоянию формы, значениям, ошибкам, методам `getValues`, `setValue` и др.
- **useWatch** — отслеживание изменений отдельных полей или группы полей.

## Пример кастомного поля

```tsx
import { Field, useFormContext } from "@wandry/inertia-form";

function CustomNumberField({ name, label }) {
  return (
    <Field
      name={name}
      label={label}
      controller={({ value, onChange }) => (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      )}
    />
  );
}
```

## Лицензия

ISC

---

[Документация и исходники](https://github.com/WandryDev/inertia-form)
