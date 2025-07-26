# @wandry/inertia-form - Документация

Production-ready React form компоненты для [Inertia.js](https://inertiajs.com/) с поддержкой TypeScript. Позволяет быстро создавать формы с валидацией, обработкой ошибок, сбросом и современным UI.

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

## 📚 Содержание

### Основы

- [Установка и настройка](./getting-started.md)
- [Основные концепции](./concepts.md)
- [Типы данных](./types.md)

### Компоненты

- [Form](./components/form.md) - Основной компонент формы
- [TextField](./components/text-field.md) - Текстовые поля
- [SelectField](./components/select-field.md) - Выпадающие списки
- [CheckboxField](./components/checkbox-field.md) - Чекбоксы
- [TextareaField](./components/textarea-field.md) - Многострочные поля
- [Field](./components/field.md) - Базовый компонент для кастомных полей
- [SubmitButton](./components/submit-button.md) - Кнопка отправки

### Хуки

- [useFormContext](./hooks/use-form-context.md) - Доступ к состоянию формы
- [useWatch](./hooks/use-watch.md) - Отслеживание изменений полей

### Руководства

- [Создание простой формы](./guides/simple-form.md)
- [Валидация и обработка ошибок](./guides/validation.md)
- [Кастомные поля](./guides/custom-fields.md)
- [Условная отрисовка](./guides/conditional-rendering.md)
- [Интеграция с Laravel](./guides/laravel-integration.md)

### Примеры

- [Простая форма](./examples/simple-form.md)
- [Форма с валидацией](./examples/form-with-validation.md)
- [Кастомное поле выбора цвета](./examples/custom-color-field.md)
- [Форма с условными полями](./examples/conditional-fields.md)

## 🎯 Особенности

- ✅ **Простая интеграция** с Inertia.js и React
- ✅ **TypeScript-first** подход
- ✅ **Современный UI** (Radix UI, shadcn/ui, Tailwind)
- ✅ **Валидация** и обработка ошибок
- ✅ **Кастомные поля** через базовый Field компонент
- ✅ **Хуки** для гибкой работы с состоянием
- ✅ **Сброс формы** и управление состоянием

## 🔗 Ссылки

- [GitHub Repository](https://github.com/your-repo/inertia-form)
- [NPM Package](https://www.npmjs.com/package/@wandry/inertia-form)
- [Inertia.js Documentation](https://inertiajs.com/)
