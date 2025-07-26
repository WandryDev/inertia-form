# Форма с валидацией

Пример создания формы с клиентской валидацией с использованием различных библиотек схем.

## Yup валидация

```tsx
import React from "react";
import {
  Form,
  TextField,
  SelectField,
  CheckboxField,
  SubmitButton,
} from "@wandry/inertia-form";
import * as yup from "yup";

interface UserFormData {
  name: string;
  email: string;
  age: number;
  role: "admin" | "user";
  password: string;
  confirmPassword: string;
  agree: boolean;
}

const userSchema = yup.object({
  name: yup
    .string()
    .required("Имя обязательно")
    .min(2, "Минимум 2 символа")
    .max(50, "Максимум 50 символов"),

  email: yup
    .string()
    .required("Email обязателен")
    .email("Неверный формат email"),

  age: yup
    .number()
    .required("Возраст обязателен")
    .min(18, "Минимум 18 лет")
    .max(100, "Максимум 100 лет"),

  role: yup
    .string()
    .oneOf(["admin", "user"], "Неверная роль")
    .required("Роль обязательна"),

  password: yup
    .string()
    .required("Пароль обязателен")
    .min(8, "Минимум 8 символов")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Пароль должен содержать буквы и цифры"
    ),

  confirmPassword: yup
    .string()
    .required("Подтвердите пароль")
    .oneOf([yup.ref("password")], "Пароли не совпадают"),

  agree: yup.boolean().oneOf([true], "Необходимо согласие с условиями"),
});

function UserRegistrationForm() {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Регистрация</h2>

      <Form<UserFormData>
        action="/users"
        method="post"
        defaultValues={{
          name: "",
          email: "",
          age: 18,
          role: "user",
          password: "",
          confirmPassword: "",
          agree: false,
        }}
        validationSchema={userSchema}
        options={{
          onSuccess: () => {
            alert("Пользователь успешно зарегистрирован!");
          },
          onError: (errors) => {
            console.log("Серверные ошибки:", errors);
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

        <TextField
          name="age"
          label="Возраст"
          type="number"
          min="18"
          max="100"
          required
        />

        <SelectField
          name="role"
          label="Роль"
          options={[
            { value: "user", title: "Пользователь" },
            { value: "admin", title: "Администратор" },
          ]}
          required
        />

        <TextField
          name="password"
          label="Пароль"
          type="password"
          placeholder="Минимум 8 символов"
          required
        />

        <TextField
          name="confirmPassword"
          label="Подтвердите пароль"
          type="password"
          placeholder="Повторите пароль"
          required
        />

        <CheckboxField
          name="agree"
          label="Согласен с условиями использования и политикой конфиденциальности"
          required
        />

        <SubmitButton className="w-full">Зарегистрироваться</SubmitButton>
      </Form>
    </div>
  );
}

export default UserRegistrationForm;
```

## Zod валидация

```tsx
import React from "react";
import {
  Form,
  TextField,
  TextareaField,
  CheckboxField,
  SubmitButton,
} from "@wandry/inertia-form";
import { z } from "zod";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  newsletter: boolean;
}

const contactSchema = z.object({
  name: z.string().min(1, "Имя обязательно").max(100, "Имя слишком длинное"),

  email: z.string().min(1, "Email обязателен").email("Неверный формат email"),

  subject: z
    .string()
    .min(5, "Тема должна содержать минимум 5 символов")
    .max(200, "Тема слишком длинная"),

  message: z
    .string()
    .min(10, "Сообщение должно содержать минимум 10 символов")
    .max(1000, "Сообщение слишком длинное"),

  newsletter: z.boolean().optional(),
});

function ContactForm() {
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Связаться с нами</h2>

      <Form<ContactFormData>
        action="/contact"
        method="post"
        defaultValues={{
          name: "",
          email: "",
          subject: "",
          message: "",
          newsletter: false,
        }}
        validationSchema={contactSchema}
      >
        <TextField name="name" label="Имя" placeholder="Ваше имя" required />

        <TextField
          name="email"
          label="Email"
          type="email"
          placeholder="your@email.com"
          required
        />

        <TextField
          name="subject"
          label="Тема"
          placeholder="Тема сообщения"
          required
        />

        <TextareaField
          name="message"
          label="Сообщение"
          placeholder="Ваше сообщение..."
          rows={5}
          required
        />

        <CheckboxField name="newsletter" label="Подписаться на новости" />

        <SubmitButton className="w-full">Отправить сообщение</SubmitButton>
      </Form>
    </div>
  );
}

export default ContactForm;
```

## Асинхронная валидация

```tsx
import React from "react";
import { Form, TextField, SubmitButton } from "@wandry/inertia-form";
import * as yup from "yup";

interface AsyncFormData {
  username: string;
  email: string;
}

const asyncSchema = yup.object({
  username: yup
    .string()
    .required("Имя пользователя обязательно")
    .min(3, "Минимум 3 символа")
    .test("unique-username", "Имя пользователя уже занято", async (value) => {
      if (!value) return true;

      try {
        const response = await fetch(`/api/check-username?username=${value}`);
        const { available } = await response.json();
        return available;
      } catch (error) {
        console.error("Ошибка проверки username:", error);
        return true; // В случае ошибки пропускаем
      }
    }),

  email: yup
    .string()
    .required("Email обязателен")
    .email("Неверный формат email")
    .test("unique-email", "Email уже используется", async (value) => {
      if (!value) return true;

      try {
        const response = await fetch(`/api/check-email?email=${value}`);
        const { available } = await response.json();
        return available;
      } catch (error) {
        console.error("Ошибка проверки email:", error);
        return true; // В случае ошибки пропускаем
      }
    }),
});

function AsyncValidationForm() {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Проверка доступности
      </h2>

      <Form<AsyncFormData>
        action="/register"
        method="post"
        defaultValues={{
          username: "",
          email: "",
        }}
        validationSchema={asyncSchema}
        options={{
          onSuccess: () => {
            alert("Регистрация успешна!");
          },
        }}
      >
        <TextField
          name="username"
          label="Имя пользователя"
          placeholder="Введите имя пользователя"
          required
        />

        <TextField
          name="email"
          label="Email"
          type="email"
          placeholder="your@email.com"
          required
        />

        <SubmitButton className="w-full">
          Проверить и зарегистрироваться
        </SubmitButton>
      </Form>
    </div>
  );
}

export default AsyncValidationForm;
```

## Кастомный адаптер валидации

```tsx
import React from "react";
import {
  Form,
  TextField,
  SubmitButton,
  ValidationAdapter,
} from "@wandry/inertia-form";

interface CustomFormData {
  name: string;
  email: string;
}

// Кастомный адаптер для простой валидации
const customValidator: ValidationAdapter = {
  async validate(data: CustomFormData) {
    const errors: Record<string, string> = {};

    // Валидация имени
    if (!data.name || data.name.trim().length === 0) {
      errors.name = "Имя обязательно";
    } else if (data.name.length < 2) {
      errors.name = "Имя должно содержать минимум 2 символа";
    } else if (data.name.length > 50) {
      errors.name = "Имя слишком длинное";
    }

    // Валидация email
    if (!data.email || data.email.trim().length === 0) {
      errors.email = "Email обязателен";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.email = "Неверный формат email";
      }
    }

    return {
      success: Object.keys(errors).length === 0,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
    };
  },
};

function CustomValidationForm() {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Кастомная валидация
      </h2>

      <Form<CustomFormData>
        action="/submit"
        method="post"
        defaultValues={{
          name: "",
          email: "",
        }}
        validator={customValidator}
      >
        <TextField name="name" label="Имя" placeholder="Введите имя" required />

        <TextField
          name="email"
          label="Email"
          type="email"
          placeholder="example@email.com"
          required
        />

        <SubmitButton className="w-full">Отправить</SubmitButton>
      </Form>
    </div>
  );
}

export default CustomValidationForm;
```

## Laravel контроллер

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:50',
            'email' => 'required|email|unique:users,email',
            'age' => 'required|integer|min:18|max:100',
            'role' => 'required|in:admin,user',
            'password' => 'required|string|min:8|confirmed',
            'agree' => 'required|accepted',
        ], [
            'name.required' => 'Имя обязательно',
            'name.min' => 'Имя должно содержать минимум 2 символа',
            'name.max' => 'Имя слишком длинное',
            'email.required' => 'Email обязателен',
            'email.email' => 'Неверный формат email',
            'email.unique' => 'Email уже используется',
            'age.required' => 'Возраст обязателен',
            'age.min' => 'Минимум 18 лет',
            'age.max' => 'Максимум 100 лет',
            'role.required' => 'Роль обязательна',
            'role.in' => 'Неверная роль',
            'password.required' => 'Пароль обязателен',
            'password.min' => 'Минимум 8 символов',
            'password.confirmed' => 'Пароли не совпадают',
            'agree.required' => 'Необходимо согласие',
            'agree.accepted' => 'Необходимо согласие с условиями',
        ]);

        // Создание пользователя
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'age' => $validated['age'],
            'role' => $validated['role'],
            'password' => bcrypt($validated['password']),
        ]);

        return redirect()->back()->with('success', 'Пользователь успешно создан!');
    }
}
```

## Ключевые особенности

1. **Автоопределение схемы** - библиотека автоматически определяет тип валидатора
2. **Асинхронная поддержка** - все адаптеры поддерживают async/await
3. **Интеграция с Inertia.js** - ошибки автоматически отображаются в полях
4. **Типизация** - полная поддержка TypeScript
5. **Гибкость** - поддержка любых библиотек валидации через адаптеры

## Следующие шаги

- [Кастомные поля](./custom-color-field.md)
- [Условная отрисовка](./conditional-fields.md)
- [Интеграция с Laravel](./laravel-integration.md)
