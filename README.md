![Wandry Inertia Form](public/hero.png)

Production-ready React form components for [Inertia.js](https://inertiajs.com/) with TypeScript support. Позволяет быстро создавать формы с поддержкой валидации, ошибок, сброса, кастомных полей и современных UI-практик (Radix UI, shadcn/ui, Tailwind).

## 🚀 Быстрый старт

```bash
pnpm add @wandry/inertia-form
```

```tsx
import { Form, TextField, SubmitButton } from "@wandry/inertia-form";

export function MyForm() {
  return (
    <Form action="/submit" method="post" defaultValues={{ name: "" }}>
      <TextField name="name" label="Имя" />
      <SubmitButton>Отправить</SubmitButton>
    </Form>
  );
}
```

## 📚 Документация

Полная документация доступна в папке [docs](./docs/):

- [📖 Основная документация](./docs/README.md)
- [⚡ Быстрый старт](./docs/getting-started.md)
- [🎯 Основные концепции](./docs/concepts.md)
- [🧩 Компоненты](./docs/components/)
- [🔧 Хуки](./docs/hooks/)
- [📋 Руководства](./docs/guides/)
- [💡 Примеры](./docs/examples/)

## ✨ Особенности

- ✅ **Простая интеграция** с Inertia.js и React
- ✅ **TypeScript-first** подход
- ✅ **Современный UI** (Radix UI, shadcn/ui, Tailwind)
- ✅ **Валидация** и обработка ошибок
- ✅ **Кастомные поля** через базовый Field компонент
- ✅ **Хуки** для гибкой работы с состоянием
- ✅ **Сброс формы** и управление состоянием

## 🛠 Установка

```bash
# pnpm
pnpm add @wandry/inertia-form

# npm
npm install @wandry/inertia-form

# yarn
yarn add @wandry/inertia-form
```

> **Важно:** Пакет требует peer-зависимости. См. [инструкцию по установке](./docs/getting-started.md).

## 📖 Примеры

### Простая форма

```tsx
import { Form, TextField, SubmitButton } from "@wandry/inertia-form";

export function ContactForm() {
  return (
    <Form
      action="/contact"
      method="post"
      defaultValues={{ name: "", email: "" }}
    >
      <TextField name="name" label="Имя" required />
      <TextField name="email" label="Email" type="email" required />
      <SubmitButton>Отправить</SubmitButton>
    </Form>
  );
}
```

### Кастомное поле

```tsx
import { Field } from "@wandry/inertia-form";

function ColorPicker({ name, label }) {
  return (
    <Field
      name={name}
      label={label}
      controller={({ value, onChange }) => (
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    />
  );
}
```

## 🔗 Ссылки

- [📖 Полная документация](./docs/README.md)
- [🚀 Быстрый старт](./docs/getting-started.md)
- [💡 Примеры](./docs/examples/)
- [🐛 Issues](https://github.com/your-repo/inertia-form/issues)
- [📦 NPM Package](https://www.npmjs.com/package/@wandry/inertia-form)

## 📄 Лицензия

ISC

---
