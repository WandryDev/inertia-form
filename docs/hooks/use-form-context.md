# useFormContext

Хук для получения доступа к состоянию формы и методам управления.

## Импорт

```tsx
import { useFormContext } from "@wandry/inertia-form";
```

## Базовое использование

```tsx
function MyComponent() {
  const { form, reset, getValues, setValue } = useFormContext();

  // Доступ к данным формы
  const formData = form.data;

  // Проверка состояния загрузки
  const isLoading = form.processing;

  // Получение ошибок
  const errors = form.errors;

  return (
    <div>
      <p>Форма загружается: {isLoading ? "Да" : "Нет"}</p>
      <button onClick={reset}>Сбросить форму</button>
    </div>
  );
}
```

## Возвращаемые значения

### form

Объект формы из Inertia.js со следующими свойствами:

| Свойство             | Тип                                      | Описание                 |
| -------------------- | ---------------------------------------- | ------------------------ |
| `data`               | `Record<string, any>`                    | Текущие данные формы     |
| `errors`             | `Record<string, string[]>`               | Ошибки валидации         |
| `processing`         | `boolean`                                | Состояние загрузки       |
| `progress`           | `Progress`                               | Прогресс загрузки файлов |
| `recentlySuccessful` | `boolean`                                | Успешная отправка        |
| `setData`            | `(key: string, value: any) => void`      | Установка значения       |
| `setError`           | `(key: string, value: string) => void`   | Установка ошибки         |
| `clearErrors`        | `(keys?: string[]) => void`              | Очистка ошибок           |
| `reset`              | `(fields?: string[]) => void`            | Сброс формы              |
| `transform`          | `(callback: (data: any) => any) => void` | Трансформация данных     |

### reset

Функция для сброса формы к начальным значениям:

```tsx
const { reset } = useFormContext();

const handleReset = () => {
  reset();
};
```

### getValues

Функция для получения значений из формы:

```tsx
const { getValues } = useFormContext();

// Получить все данные формы
const allData = getValues();

// Получить конкретное поле
const username = getValues("username");

// Получить вложенное поле
const street = getValues("address.street");

// Получить с значением по умолчанию
const age = getValues("age", 18);
```

### setValue

Функция для установки значений в форму:

```tsx
const { setValue } = useFormContext();

// Установить простое поле
setValue("username", "john_doe");

// Установить вложенное поле
setValue("address.street", "Main Street");

// Установить массив
setValue("hobbies", ["reading", "gaming"]);
```

## Примеры

### Отслеживание изменений

```tsx
function FormDebugger() {
  const { form } = useFormContext();

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3>Отладка формы:</h3>
      <pre>{JSON.stringify(form.data, null, 2)}</pre>
      <p>Загружается: {form.processing ? "Да" : "Нет"}</p>
      <p>Ошибки: {Object.keys(form.errors).length}</p>
    </div>
  );
}

// Использование в форме
<Form action="/submit" method="post" defaultValues={{ name: "" }}>
  <TextField name="name" label="Имя" />
  <FormDebugger />
  <SubmitButton>Отправить</SubmitButton>
</Form>;
```

### Кастомная валидация

```tsx
function CustomValidation() {
  const { form, setError, clearErrors } = useFormContext();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("email", "Неверный формат email");
      return false;
    }
    clearErrors(["email"]);
    return true;
  };

  const handleEmailChange = (email: string) => {
    form.setData("email", email);
    validateEmail(email);
  };

  return (
    <TextField
      name="email"
      label="Email"
      onChange={(e) => handleEmailChange(e.target.value)}
    />
  );
}
```

### Условная логика

```tsx
function ConditionalFields() {
  const { getValues } = useFormContext();
  const userType = getValues("userType");
  const isCompany = userType === "company";

  return (
    <div>
      <SelectField
        name="userType"
        label="Тип пользователя"
        options={[
          { value: "individual", title: "Физическое лицо" },
          { value: "company", title: "Компания" },
        ]}
      />

      {isCompany && <TextField name="companyName" label="Название компании" />}
    </div>
  );
}
```

### Программное управление

```tsx
function FormController() {
  const { form, setValue, reset } = useFormContext();

  const fillWithDefaults = () => {
    setValue("name", "Иван Иванов");
    setValue("email", "ivan@example.com");
    setValue("phone", "+7 (999) 123-45-67");
  };

  const clearForm = () => {
    reset();
  };

  const submitProgrammatically = () => {
    // Программная отправка формы
    form.post("/submit");
  };

  return (
    <div className="space-x-2">
      <button
        type="button"
        onClick={fillWithDefaults}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Заполнить по умолчанию
      </button>

      <button
        type="button"
        onClick={clearForm}
        className="px-4 py-2 bg-gray-500 text-white rounded"
      >
        Очистить
      </button>

      <button
        type="button"
        onClick={submitProgrammatically}
        disabled={form.processing}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Отправить программно
      </button>
    </div>
  );
}
```

### Обработка файлов

```tsx
function FileUpload() {
  const { form } = useFormContext();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setData("avatar", file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      {form.progress && (
        <div>Прогресс загрузки: {form.progress.percentage}%</div>
      )}
    </div>
  );
}
```

## Ограничения

- Хук должен использоваться только внутри компонента `Form`
- При использовании вне `Form` будет выброшена ошибка
- Изменения через `setValue` автоматически вызывают ре-рендер компонентов

## TypeScript

Хук полностью типизирован:

```tsx
interface FormData {
  name: string;
  email: string;
  age: number;
}

function TypedComponent() {
  const { form, getValues, setValue } = useFormContext<FormData>();

  // TypeScript знает типы данных
  const name: string = getValues("name");
  setValue("age", 25); // Ошибка, если передать строку

  return <div>Имя: {name}</div>;
}
```
