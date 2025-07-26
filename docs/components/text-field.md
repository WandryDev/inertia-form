# TextField

Компонент для создания текстовых полей ввода с поддержкой различных типов.

## Импорт

```tsx
import { TextField } from "@wandry/inertia-form";
```

## Базовое использование

```tsx
<TextField name="username" label="Имя пользователя" />
```

## Props

### Обязательные

| Prop   | Тип      | Описание         |
| ------ | -------- | ---------------- |
| `name` | `string` | Имя поля в форме |

### Опциональные

| Prop             | Тип                      | По умолчанию | Описание               |
| ---------------- | ------------------------ | ------------ | ---------------------- |
| `label`          | `string`                 | -            | Подпись к полю         |
| `type`           | `HTMLInputTypeAttribute` | `"text"`     | Тип HTML input         |
| `placeholder`    | `string`                 | -            | Плейсхолдер            |
| `disabled`       | `boolean`                | `false`      | Отключить поле         |
| `className`      | `string`                 | -            | CSS классы для поля    |
| `labelClassName` | `string`                 | -            | CSS классы для подписи |

### HTML Attributes

Компонент принимает все стандартные HTML атрибуты для `<input>` элемента.

## Типы полей

### Текстовое поле

```tsx
<TextField name="name" label="Имя" placeholder="Введите ваше имя" />
```

### Email поле

```tsx
<TextField
  name="email"
  label="Email"
  type="email"
  placeholder="example@email.com"
/>
```

### Пароль

```tsx
<TextField
  name="password"
  label="Пароль"
  type="password"
  placeholder="Введите пароль"
/>
```

### Числовое поле

```tsx
<TextField name="age" label="Возраст" type="number" min="0" max="120" />
```

### URL поле

```tsx
<TextField
  name="website"
  label="Веб-сайт"
  type="url"
  placeholder="https://example.com"
/>
```

### Телефон

```tsx
<TextField
  name="phone"
  label="Телефон"
  type="tel"
  placeholder="+7 (999) 123-45-67"
/>
```

### Дата

```tsx
<TextField name="birthDate" label="Дата рождения" type="date" />
```

### Время

```tsx
<TextField name="meetingTime" label="Время встречи" type="time" />
```

### Поиск

```tsx
<TextField name="search" label="Поиск" type="search" placeholder="Поиск..." />
```

## Примеры

### Простая форма регистрации

```tsx
<Form
  action="/register"
  method="post"
  defaultValues={{
    username: "",
    email: "",
    password: "",
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
    placeholder="example@email.com"
    required
  />
  <TextField
    name="password"
    label="Пароль"
    type="password"
    placeholder="Минимум 8 символов"
    required
  />
  <SubmitButton>Зарегистрироваться</SubmitButton>
</Form>
```

### Поле с валидацией

```tsx
<TextField
  name="age"
  label="Возраст"
  type="number"
  min="18"
  max="100"
  step="1"
  placeholder="Введите возраст"
  required
/>
```

### Отключенное поле

```tsx
<TextField name="username" label="Имя пользователя" value="john_doe" disabled />
```

### Поле с кастомными стилями

```tsx
<TextField
  name="company"
  label="Название компании"
  className="border-2 border-blue-300 focus:border-blue-500"
  labelClassName="text-blue-600 font-semibold"
  placeholder="Введите название компании"
/>
```

### Поле с маской

```tsx
<TextField
  name="phone"
  label="Телефон"
  type="tel"
  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
  placeholder="123-456-7890"
  title="Формат: 123-456-7890"
/>
```

## Обработка ошибок

Ошибки валидации автоматически отображаются под полем:

```tsx
// Если сервер вернул ошибку для поля "email"
{
  "errors": {
    "email": ["Неверный формат email"]
  }
}

// TextField автоматически покажет ошибку
<TextField name="email" label="Email" type="email" />
```

## Стилизация

Компонент использует базовые стили из `Input` компонента. Вы можете кастомизировать:

```tsx
// Глобальная кастомизация через CSS
.text-field-input {
  @apply border-gray-300 rounded-md shadow-sm;
}

.text-field-input:focus {
  @apply border-blue-500 ring-1 ring-blue-500;
}

// Или через className
<TextField
  name="custom"
  label="Кастомное поле"
  className="border-2 border-purple-300 focus:border-purple-500"
/>
```

## Доступность

Компонент автоматически:

- Связывает label с input через `htmlFor` и `id`
- Поддерживает ARIA атрибуты
- Обрабатывает состояния focus и error
- Поддерживает клавиатурную навигацию

## TypeScript

Компонент полностью типизирован:

```tsx
interface FormData {
  username: string;
  email: string;
  age: number;
}

<Form<FormData>
  action="/submit"
  method="post"
  defaultValues={{
    username: "",
    email: "",
    age: 0,
  }}
>
  <TextField name="username" label="Имя пользователя" />
  <TextField name="email" label="Email" type="email" />
  <TextField name="age" label="Возраст" type="number" />
</Form>;
```
