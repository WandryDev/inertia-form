# Form

Основной компонент для создания форм с интеграцией Inertia.js.

## Импорт

```tsx
import { Form } from "@wandry/inertia-form";
```

## Базовое использование

```tsx
<Form action="/submit" method="post" defaultValues={{ name: "", email: "" }}>
  <TextField name="name" label="Имя" />
  <TextField name="email" label="Email" />
  <SubmitButton>Отправить</SubmitButton>
</Form>
```

## Props

### Обязательные

| Prop       | Тип         | Описание                  |
| ---------- | ----------- | ------------------------- |
| `action`   | `string`    | URL для отправки формы    |
| `children` | `ReactNode` | Дочерние компоненты формы |

### Опциональные

| Prop            | Тип                                               | По умолчанию  | Описание                    |
| --------------- | ------------------------------------------------- | ------------- | --------------------------- |
| `method`        | `"get" \| "post" \| "put" \| "patch" \| "delete"` | `"post"`      | HTTP метод для отправки     |
| `defaultValues` | `Record<string, any>`                             | `{}`          | Начальные значения полей    |
| `options`       | `VisitOptions`                                    | `{}`          | Опции для Inertia.js visit  |
| `id`            | `string`                                          | -             | ID формы                    |
| `className`     | `string`                                          | `"space-y-4"` | CSS классы для формы        |
| `onSubmit`      | `(values: any) => void`                           | -             | Callback при отправке формы |

### HTML Attributes

Компонент принимает все стандартные HTML атрибуты формы, кроме:

- `defaultValue` (используйте `defaultValues`)
- `onSubmit` (используйте проп `onSubmit`)

## Примеры

### Простая форма

```tsx
<Form action="/contact" method="post" defaultValues={{ name: "", email: "" }}>
  <TextField name="name" label="Имя" required />
  <TextField name="email" label="Email" type="email" required />
  <SubmitButton>Отправить</SubmitButton>
</Form>
```

### Форма с кастомными опциями

```tsx
<Form
  action="/api/users"
  method="post"
  defaultValues={{ name: "", email: "" }}
  options={{
    preserveScroll: true,
    onSuccess: () => {
      console.log("Форма отправлена успешно!");
    },
    onError: (errors) => {
      console.log("Ошибки валидации:", errors);
    },
  }}
  className="max-w-md mx-auto"
>
  <TextField name="name" label="Имя" />
  <TextField name="email" label="Email" />
  <SubmitButton>Создать пользователя</SubmitButton>
</Form>
```

### Форма с TypeScript

```tsx
interface UserFormData {
  name: string;
  email: string;
  role: "admin" | "user";
  agree: boolean;
}

<Form<UserFormData>
  action="/users"
  method="post"
  defaultValues={{
    name: "",
    email: "",
    role: "user",
    agree: false,
  }}
>
  <TextField name="name" label="Имя" />
  <TextField name="email" label="Email" type="email" />
  <SelectField
    name="role"
    label="Роль"
    options={[
      { value: "admin", title: "Администратор" },
      { value: "user", title: "Пользователь" },
    ]}
  />
  <CheckboxField name="agree" label="Согласен с условиями" />
  <SubmitButton>Создать</SubmitButton>
</Form>;
```

### Форма с условной логикой

```tsx
function ConditionalForm() {
  const { form } = useFormContext();
  const userType = useWatch("userType");

  return (
    <Form
      action="/register"
      method="post"
      defaultValues={{
        userType: "individual",
        companyName: "",
        firstName: "",
        lastName: "",
      }}
    >
      <SelectField
        name="userType"
        label="Тип пользователя"
        options={[
          { value: "individual", title: "Физическое лицо" },
          { value: "company", title: "Компания" },
        ]}
      />

      {userType === "company" && (
        <TextField name="companyName" label="Название компании" />
      )}

      {userType === "individual" && (
        <>
          <TextField name="firstName" label="Имя" />
          <TextField name="lastName" label="Фамилия" />
        </>
      )}

      <SubmitButton>Зарегистрироваться</SubmitButton>
    </Form>
  );
}
```

## Контекст формы

Компонент `Form` создает React Context, который предоставляет:

- `form` - объект формы из Inertia.js
- `reset` - функция для сброса формы

Доступ к контексту можно получить через хук `useFormContext`:

```tsx
import { useFormContext } from "@wandry/inertia-form";

function CustomComponent() {
  const { form, reset } = useFormContext();

  const handleReset = () => {
    reset();
  };

  return (
    <button type="button" onClick={handleReset}>
      Сбросить форму
    </button>
  );
}
```

## Обработка ошибок

Ошибки валидации автоматически отображаются в соответствующих полях. Для обработки общих ошибок используйте `options.onError`:

```tsx
<Form
  action="/submit"
  method="post"
  options={{
    onError: (errors) => {
      // Обработка ошибок валидации
      console.log("Ошибки:", errors);
    },
  }}
>
  {/* Поля формы */}
</Form>
```

## Стилизация

По умолчанию форма имеет класс `space-y-4` для вертикальных отступов между полями. Вы можете переопределить это:

```tsx
<Form
  action="/submit"
  method="post"
  className="space-y-6 max-w-lg mx-auto p-6 bg-white rounded-lg shadow"
>
  {/* Поля формы */}
</Form>
```

## Методы HTTP

Поддерживаются все стандартные HTTP методы:

- `GET` - для получения данных
- `POST` - для создания новых ресурсов
- `PUT` - для полного обновления ресурса
- `PATCH` - для частичного обновления ресурса
- `DELETE` - для удаления ресурса

```tsx
// Создание
<Form action="/users" method="post">...</Form>

// Обновление
<Form action="/users/1" method="put">...</Form>

// Частичное обновление
<Form action="/users/1" method="patch">...</Form>

// Удаление
<Form action="/users/1" method="delete">...</Form>
```
