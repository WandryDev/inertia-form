# Создание простой формы

Пошаговое руководство по созданию первой формы с `@wandry/inertia-form`.

## Шаг 1: Установка

Убедитесь, что библиотека установлена:

```bash
pnpm add @wandry/inertia-form
```

## Шаг 2: Базовый импорт

```tsx
import { Form, TextField, SubmitButton } from "@wandry/inertia-form";
```

## Шаг 3: Создание компонента формы

```tsx
function ContactForm() {
  return (
    <Form
      action="/contact"
      method="post"
      defaultValues={{
        name: "",
        email: "",
        message: "",
      }}
    >
      <TextField
        name="name"
        label="Имя"
        placeholder="Введите ваше имя"
        required
      />

      <TextField
        name="email"
        label="Email"
        type="email"
        placeholder="example@email.com"
        required
      />

      <TextareaField
        name="message"
        label="Сообщение"
        placeholder="Введите ваше сообщение"
        rows={4}
        required
      />

      <SubmitButton>Отправить</SubmitButton>
    </Form>
  );
}
```

## Шаг 4: Добавление валидации

Для серверной валидации создайте Laravel контроллер:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|max:1000',
        ]);

        // Обработка данных...

        return redirect()->back()->with('success', 'Сообщение отправлено!');
    }
}
```

## Шаг 5: Добавление маршрута

```php
// routes/web.php
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
```

## Шаг 6: Улучшение UX

Добавьте обработку состояний и обратную связь:

```tsx
function ContactForm() {
  const { form } = useFormContext();

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Связаться с нами</h2>

      <Form
        action="/contact"
        method="post"
        defaultValues={{
          name: "",
          email: "",
          message: "",
        }}
        options={{
          onSuccess: () => {
            alert("Сообщение отправлено успешно!");
          },
          onError: (errors) => {
            console.log("Ошибки валидации:", errors);
          },
        }}
      >
        <TextField
          name="name"
          label="Имя"
          placeholder="Введите ваше имя"
          required
        />

        <TextField
          name="email"
          label="Email"
          type="email"
          placeholder="example@email.com"
          required
        />

        <TextareaField
          name="message"
          label="Сообщение"
          placeholder="Введите ваше сообщение"
          rows={4}
          required
        />

        <div className="flex justify-between items-center">
          <SubmitButton
            disabled={form.processing}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {form.processing ? "Отправка..." : "Отправить"}
          </SubmitButton>

          {form.recentlySuccessful && (
            <span className="text-green-600 text-sm">
              ✓ Сообщение отправлено!
            </span>
          )}
        </div>
      </Form>
    </div>
  );
}
```

## Шаг 7: Добавление стилизации

Создайте кастомные стили:

```css
/* styles/forms.css */
.form-container {
  @apply max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg;
}

.form-title {
  @apply text-2xl font-bold mb-6 text-gray-800;
}

.form-field {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.form-error {
  @apply text-red-600 text-sm mt-1;
}

.form-button {
  @apply w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
}
```

## Шаг 8: Типизация с TypeScript

```tsx
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

function ContactForm() {
  return (
    <Form<ContactFormData>
      action="/contact"
      method="post"
      defaultValues={{
        name: "",
        email: "",
        message: "",
      }}
    >
      <TextField name="name" label="Имя" required />
      <TextField name="email" label="Email" type="email" required />
      <TextareaField name="message" label="Сообщение" required />
      <SubmitButton>Отправить</SubmitButton>
    </Form>
  );
}
```

## Шаг 9: Добавление клиентской валидации

```tsx
function ContactForm() {
  const { form, setError, clearErrors } = useFormContext();

  const validateForm = () => {
    let isValid = true;

    // Валидация имени
    if (!form.data.name.trim()) {
      setError("name", "Имя обязательно для заполнения");
      isValid = false;
    } else {
      clearErrors(["name"]);
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.data.email)) {
      setError("email", "Неверный формат email");
      isValid = false;
    } else {
      clearErrors(["email"]);
    }

    // Валидация сообщения
    if (!form.data.message.trim()) {
      setError("message", "Сообщение обязательно для заполнения");
      isValid = false;
    } else {
      clearErrors(["message"]);
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (!validateForm()) {
      e.preventDefault();
      return false;
    }
  };

  return (
    <Form
      action="/contact"
      method="post"
      defaultValues={{ name: "", email: "", message: "" }}
      onSubmit={handleSubmit}
    >
      {/* Поля формы */}
    </Form>
  );
}
```

## Шаг 10: Тестирование

Создайте тесты для вашей формы:

```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ContactForm } from "./ContactForm";

test("отправляет форму с валидными данными", async () => {
  render(<ContactForm />);

  // Заполняем форму
  fireEvent.change(screen.getByLabelText(/имя/i), {
    target: { value: "Иван Иванов" },
  });

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "ivan@example.com" },
  });

  fireEvent.change(screen.getByLabelText(/сообщение/i), {
    target: { value: "Тестовое сообщение" },
  });

  // Отправляем форму
  fireEvent.click(screen.getByText(/отправить/i));

  // Проверяем, что форма отправлена
  await waitFor(() => {
    expect(screen.getByText(/отправка/i)).toBeInTheDocument();
  });
});
```

## Готовый пример

Вот полный пример простой формы:

```tsx
import React from "react";
import {
  Form,
  TextField,
  TextareaField,
  SubmitButton,
  useFormContext,
} from "@wandry/inertia-form";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

function ContactForm() {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Связаться с нами</h2>

      <Form<ContactFormData>
        action="/contact"
        method="post"
        defaultValues={{ name: "", email: "", message: "" }}
        options={{
          onSuccess: () => {
            alert("Сообщение отправлено успешно!");
          },
        }}
      >
        <TextField
          name="name"
          label="Имя"
          placeholder="Введите ваше имя"
          required
        />

        <TextField
          name="email"
          label="Email"
          type="email"
          placeholder="example@email.com"
          required
        />

        <TextareaField
          name="message"
          label="Сообщение"
          placeholder="Введите ваше сообщение"
          rows={4}
          required
        />

        <SubmitButton className="w-full">Отправить сообщение</SubmitButton>
      </Form>
    </div>
  );
}

export default ContactForm;
```

## Следующие шаги

- [Валидация и обработка ошибок](./validation.md)
- [Кастомные поля](./custom-fields.md)
- [Условная отрисовка](./conditional-rendering.md)
