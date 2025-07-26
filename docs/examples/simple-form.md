# Простая форма

Базовый пример создания формы с `@wandry/inertia-form`.

## Исходный код

```tsx
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
```

## Пошаговое объяснение

### 1. Импорт компонентов

```tsx
import { Form } from "../src/components/form";
import { TextField } from "../src/components/fields";
import { SubmitButton } from "../src/components/form";
```

- `Form` - основной компонент, который создает контекст формы и управляет отправкой
- `TextField` - компонент для текстового поля ввода
- `SubmitButton` - кнопка отправки формы с автоматической блокировкой

### 2. Настройка формы

```tsx
<Form action="/submit" method="post" defaultValues={{ name: "" }}>
```

- `action="/submit"` - URL, на который будут отправлены данные формы
- `method="post"` - HTTP метод для отправки (по умолчанию "post")
- `defaultValues={{ name: "" }}` - начальные значения полей формы

### 3. Добавление поля

```tsx
<TextField name="name" label="Имя" placeholder="Введите имя" />
```

- `name="name"` - уникальное имя поля в форме
- `label="Имя"` - подпись к полю
- `placeholder="Введите имя"` - плейсхолдер для поля

### 4. Кнопка отправки

```tsx
<SubmitButton>Отправить</SubmitButton>
```

Кнопка автоматически:

- Блокируется во время отправки формы
- Показывает состояние загрузки
- Имеет правильный тип `submit`

## Улучшенная версия

Вот более полная версия с дополнительными возможностями:

```tsx
import React from "react";
import {
  Form,
  TextField,
  SubmitButton,
  useFormContext,
} from "@wandry/inertia-form";

interface SimpleFormData {
  name: string;
  email: string;
}

function SimpleForm() {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Контактная форма</h2>

      <Form<SimpleFormData>
        action="/contact"
        method="post"
        defaultValues={{
          name: "",
          email: "",
        }}
        options={{
          onSuccess: () => {
            alert("Форма отправлена успешно!");
          },
          onError: (errors) => {
            console.log("Ошибки валидации:", errors);
          },
        }}
        className="space-y-4"
      >
        <TextField
          name="name"
          label="Имя"
          placeholder="Введите ваше имя"
          required
          className="w-full"
        />

        <TextField
          name="email"
          label="Email"
          type="email"
          placeholder="example@email.com"
          required
          className="w-full"
        />

        <SubmitButton className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Отправить
        </SubmitButton>
      </Form>
    </div>
  );
}

export default SimpleForm;
```

## Laravel контроллер

Для обработки формы на сервере создайте контроллер:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function show()
    {
        return Inertia::render('ContactPage');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
        ]);

        // Обработка данных...
        // Например, отправка email или сохранение в базу данных

        return redirect()->back()->with('success', 'Сообщение отправлено!');
    }
}
```

## Маршруты

Добавьте маршруты в `routes/web.php`:

```php
Route::get('/contact', [ContactController::class, 'show'])->name('contact.show');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
```

## Обработка состояний

Добавьте компонент для отображения состояний формы:

```tsx
function FormStatus() {
  const { form } = useFormContext();

  return (
    <div className="mt-4">
      {form.processing && (
        <div className="text-blue-600">Отправка формы...</div>
      )}

      {form.recentlySuccessful && (
        <div className="text-green-600">✓ Форма отправлена успешно!</div>
      )}

      {Object.keys(form.errors).length > 0 && (
        <div className="text-red-600">Произошли ошибки при отправке формы</div>
      )}
    </div>
  );
}

// Использование в форме
<Form action="/contact" method="post" defaultValues={{ name: "", email: "" }}>
  <TextField name="name" label="Имя" required />
  <TextField name="email" label="Email" type="email" required />
  <SubmitButton>Отправить</SubmitButton>
  <FormStatus />
</Form>;
```

## Стилизация

Создайте кастомные стили:

```css
/* styles/forms.css */
.simple-form {
  @apply max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg;
}

.simple-form-title {
  @apply text-2xl font-bold mb-6 text-center text-gray-800;
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

.form-button {
  @apply w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
}
```

## Тестирование

Создайте тесты для формы:

```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SimpleForm } from "./SimpleForm";

test("отправляет форму с валидными данными", async () => {
  render(<SimpleForm />);

  // Заполняем форму
  fireEvent.change(screen.getByLabelText(/имя/i), {
    target: { value: "Иван Иванов" },
  });

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "ivan@example.com" },
  });

  // Отправляем форму
  fireEvent.click(screen.getByText(/отправить/i));

  // Проверяем, что форма отправлена
  await waitFor(() => {
    expect(screen.getByText(/отправка/i)).toBeInTheDocument();
  });
});

test("показывает ошибки валидации", async () => {
  render(<SimpleForm />);

  // Отправляем пустую форму
  fireEvent.click(screen.getByText(/отправить/i));

  // Проверяем, что ошибки отображаются
  await waitFor(() => {
    expect(screen.getByText(/имя обязательно/i)).toBeInTheDocument();
    expect(screen.getByText(/email обязателен/i)).toBeInTheDocument();
  });
});
```

## Ключевые особенности

1. **Простота**: Минимальный код для создания рабочей формы
2. **Интеграция**: Автоматическая интеграция с Inertia.js
3. **Валидация**: Поддержка серверной валидации
4. **Состояния**: Автоматическое управление состояниями загрузки
5. **Доступность**: Встроенная поддержка ARIA атрибутов
6. **Стилизация**: Гибкая система стилизации через CSS классы

## Следующие шаги

- [Добавление валидации](./form-with-validation.md)
- [Создание кастомных полей](./custom-color-field.md)
- [Условная отрисовка полей](./conditional-fields.md)
