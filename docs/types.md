# Типы данных

Полная типизация для `@wandry/inertia-form` с TypeScript.

## Основные типы

### FormData

Базовый тип для данных формы:

```tsx
type FormData = Record<string, any>;
```

### FormProps

Пропсы для компонента `Form`:

```tsx
type FormProps<T = FormData> = {
  action: string;
  method?: "get" | "post" | "put" | "patch" | "delete";
  defaultValues?: T;
  options?: VisitOptions;
  id?: string;
  className?: string;
  validationSchema?: any;
  validator?: ValidationAdapter;
  onSubmit?: (values: T) => void;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLFormElement>, "defaultValue" | "onSubmit">;
```

### FieldProps

Базовые пропсы для всех полей:

```tsx
type WithSharedProps<T> = {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
} & T;
```

## Компоненты

### TextField

```tsx
type TextFieldProps = WithSharedProps<{
  name: string;
  type?: HTMLInputTypeAttribute;
  labelClassName?: string;
}> &
  HTMLAttributes<HTMLInputElement>;
```

### SelectField

```tsx
type SelectOption = {
  value: string;
  title: string;
  disabled?: boolean;
};

type SelectFieldProps = WithSharedProps<{
  name: string;
  options: SelectOption[];
  labelClassName?: string;
}> &
  HTMLAttributes<HTMLSelectElement>;
```

### CheckboxField

```tsx
type CheckboxFieldProps = WithSharedProps<{
  name: string;
}> &
  HTMLAttributes<HTMLInputElement>;
```

### TextareaField

```tsx
type TextareaFieldProps = WithSharedProps<{
  name: string;
  rows?: number;
  labelClassName?: string;
}> &
  HTMLAttributes<HTMLTextAreaElement>;
```

### Field

```tsx
type FieldControllerProps = {
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
};

type FieldProps = WithSharedProps<{
  name: string;
  controller: (props: FieldControllerProps) => ReactNode;
  labelClassName?: string;
}>;
```

### ValidationAdapter

```tsx
interface ValidationAdapter {
  validate(data: any): Promise<{
    success: boolean;
    errors?: Record<string, string>;
  }>;
}
```

### SubmitButton

```tsx
type SubmitButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  className?: string;
} & HTMLAttributes<HTMLButtonElement>;
```

## Хуки

### useFormContext

```tsx
type FormContextValues = {
  form: InertiaFormProps<FormData>;
  reset?: () => void;
  getValues: (name?: string, defaultValue?: any) => any;
  setValue: (name: string, value: any) => void;
};

function useFormContext<T = FormData>(): FormContextValues;
```

### useWatch

```tsx
function useWatch<T = any>(name: string): T;
function useWatch<T = any>(names: string[]): Record<string, T>;
```

## Inertia.js типы

Библиотека использует типы из Inertia.js:

```tsx
import { VisitOptions, InertiaFormProps } from "@inertiajs/core";
```

### VisitOptions

```tsx
type VisitOptions = {
  method?: "get" | "post" | "put" | "patch" | "delete";
  data?: Record<string, any>;
  replace?: boolean;
  preserveState?: boolean;
  preserveScroll?: boolean;
  only?: string[];
  headers?: Record<string, string>;
  onCancelToken?: (cancelToken: CancelToken) => void;
  onBefore?: (visit: Visit) => void;
  onStart?: (visit: Visit) => void;
  onProgress?: (progress: Progress) => void;
  onFinish?: (visit: Visit) => void;
  onCancel?: () => void;
  onSuccess?: (page: Page) => void;
  onError?: (errors: Record<string, string>) => void;
};
```

### InertiaFormProps

```tsx
type InertiaFormProps<T = Record<string, any>> = {
  data: T;
  errors: Record<string, string>;
  processing: boolean;
  progress: Progress | null;
  recentlySuccessful: boolean;
  setData: (key: string, value: any) => void;
  setError: (key: string, value: string) => void;
  clearErrors: (keys?: string[]) => void;
  reset: (fields?: string[]) => void;
  transform: (callback: (data: T) => T) => void;
  get: (url: string, options?: VisitOptions) => void;
  post: (url: string, options?: VisitOptions) => void;
  put: (url: string, options?: VisitOptions) => void;
  patch: (url: string, options?: VisitOptions) => void;
  delete: (url: string, options?: VisitOptions) => void;
};
```

## Примеры использования

### Типизированная форма

```tsx
interface UserFormData {
  name: string;
  email: string;
  age: number;
  role: "admin" | "user";
  agree: boolean;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
}

function UserForm() {
  return (
    <Form<UserFormData>
      action="/users"
      method="post"
      defaultValues={{
        name: "",
        email: "",
        age: 0,
        role: "user",
        agree: false,
        address: {
          street: "",
          city: "",
          zipCode: "",
        },
      }}
    >
      <TextField name="name" label="Имя" />
      <TextField name="email" label="Email" type="email" />
      <TextField name="age" label="Возраст" type="number" />

      <SelectField
        name="role"
        label="Роль"
        options={[
          { value: "admin", title: "Администратор" },
          { value: "user", title: "Пользователь" },
        ]}
      />

      <CheckboxField name="agree" label="Согласен с условиями" />

      <TextField name="address.street" label="Улица" />
      <TextField name="address.city" label="Город" />
      <TextField name="address.zipCode" label="Индекс" />

      <SubmitButton>Создать пользователя</SubmitButton>
    </Form>
  );
}
```

### Типизированный хук

```tsx
function FormDebugger() {
  const { form, getValues, setValue } = useFormContext<UserFormData>();

  // TypeScript знает типы
  const name: string = getValues("name");
  const age: number = getValues("age");
  const role: "admin" | "user" = getValues("role");

  const updateName = (newName: string) => {
    setValue("name", newName); // ✅ Правильно
    // setValue('name', 123); // ❌ Ошибка TypeScript
  };

  return (
    <div>
      <p>Имя: {name}</p>
      <p>Возраст: {age}</p>
      <p>Роль: {role}</p>
    </div>
  );
}
```

### Кастомное поле с типами

```tsx
interface ColorFieldProps {
  name: string;
  label: string;
  defaultValue?: string;
}

function ColorField({
  name,
  label,
  defaultValue = "#000000",
}: ColorFieldProps) {
  return (
    <Field
      name={name}
      label={label}
      controller={({ value, onChange }: FieldControllerProps) => (
        <input
          type="color"
          value={String(value || defaultValue)}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-8 border border-gray-300 rounded"
        />
      )}
    />
  );
}

// Использование
<ColorField name="themeColor" label="Цвет темы" defaultValue="#3b82f6" />;
```

## Утилиты

### Утилиты для работы с объектами

Библиотека использует lodash утилиты:

```tsx
import get from "lodash.get";
import set from "lodash.set";
import cloneDeep from "lodash.clonedeep";
import isEqual from "lodash.isequal";

// Примеры использования в коде
const value = get(formData, "address.street", "");
set(formData, "address.street", "New Street");
const cloned = cloneDeep(formData);
const isSame = isEqual(obj1, obj2);
```

### CSS утилиты

```tsx
import { cn } from "@wandry/inertia-form/lib/utils";

// Объединение классов с поддержкой Tailwind
const className = cn(
  "base-class",
  condition && "conditional-class",
  "another-class"
);
```

## Расширение типов

### Создание кастомных типов полей

```tsx
// Расширение базовых типов
interface CustomFieldProps
  extends WithSharedProps<{
    name: string;
    customProp?: string;
  }> {
  // Дополнительные пропсы
}

// Создание типизированного кастомного поля
function CustomField({ name, label, customProp }: CustomFieldProps) {
  return (
    <Field
      name={name}
      label={label}
      controller={({ value, onChange }) => <div>{/* Кастомная логика */}</div>}
    />
  );
}
```

### Типы для валидации

```tsx
interface ValidationRules {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

interface FieldWithValidation extends FieldProps {
  validation?: ValidationRules;
}
```
