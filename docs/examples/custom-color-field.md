# Кастомное поле выбора цвета

Пример создания кастомного поля для выбора цвета с использованием базового компонента `Field`.

## Исходный код

```tsx
import React from "react";
import { Form, Field, SubmitButton } from "@wandry/inertia-form";

export default function CustomColorFieldExample() {
  return (
    <Form
      action="/custom-field"
      method="post"
      defaultValues={{ color: "#ff0000" }}
    >
      <Field
        name="color"
        label="Выберите цвет"
        controller={({ value, onChange }) => (
          <input
            type="color"
            value={String(value)}
            onChange={(e) => onChange(e.target.value)}
            style={{
              width: 48,
              height: 32,
              border: "none",
              background: "none",
            }}
          />
        )}
      />
      <SubmitButton>Сохранить</SubmitButton>
    </Form>
  );
}
```

## Пошаговое объяснение

### 1. Импорт компонентов

```tsx
import { Form, Field, SubmitButton } from "@wandry/inertia-form";
```

- `Form` - основной компонент формы
- `Field` - базовый компонент для создания кастомных полей
- `SubmitButton` - кнопка отправки формы

### 2. Настройка формы

```tsx
<Form
  action="/custom-field"
  method="post"
  defaultValues={{ color: "#ff0000" }}
>
```

- `action="/custom-field"` - URL для отправки данных
- `method="post"` - HTTP метод
- `defaultValues={{ color: "#ff0000" }}` - начальное значение цвета (красный)

### 3. Создание кастомного поля

```tsx
<Field
  name="color"
  label="Выберите цвет"
  controller={({ value, onChange }) => (
    <input
      type="color"
      value={String(value)}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: 48,
        height: 32,
        border: "none",
        background: "none",
      }}
    />
  )}
/>
```

#### Параметры Field:

- `name="color"` - имя поля в форме
- `label="Выберите цвет"` - подпись к полю
- `controller` - функция, которая возвращает JSX для рендеринга поля

#### Параметры controller:

- `value` - текущее значение поля из формы
- `onChange` - функция для обновления значения в форме

### 4. Стилизация color input

```tsx
style={{
  width: 48,
  height: 32,
  border: "none",
  background: "none",
}}
```

- Устанавливаем фиксированные размеры
- Убираем стандартную рамку
- Убираем фон

## Улучшенная версия

Вот более продвинутая версия с дополнительными возможностями:

```tsx
import React, { useState } from "react";
import { Form, Field, SubmitButton } from "@wandry/inertia-form";

interface ColorFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

function ColorPicker({ value, onChange, disabled }: ColorFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  const predefinedColors = [
    "#ff0000",
    "#ff8000",
    "#ffff00",
    "#80ff00",
    "#00ff00",
    "#00ff80",
    "#00ffff",
    "#0080ff",
    "#0000ff",
    "#8000ff",
    "#ff00ff",
    "#ff0080",
  ];

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          disabled={disabled}
          className="w-12 h-8 rounded border-2 border-gray-300 hover:border-gray-400 disabled:opacity-50"
          style={{ backgroundColor: value }}
          title="Выбрать цвет"
        />

        {showPicker && (
          <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-300 rounded shadow-lg z-10">
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-8 border border-gray-300 rounded"
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1">
        {predefinedColors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            disabled={disabled}
            className="w-6 h-6 rounded border border-gray-300 hover:border-gray-400 disabled:opacity-50"
            style={{ backgroundColor: color }}
            title={`Выбрать ${color}`}
          />
        ))}
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
        placeholder="#000000"
      />
    </div>
  );
}

export default function AdvancedColorFieldExample() {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Настройка темы</h2>

      <Form
        action="/theme-settings"
        method="post"
        defaultValues={{
          primaryColor: "#3b82f6",
          secondaryColor: "#10b981",
          accentColor: "#f59e0b",
        }}
      >
        <Field
          name="primaryColor"
          label="Основной цвет"
          controller={({ value, onChange }) => (
            <ColorPicker value={value} onChange={onChange} />
          )}
        />

        <Field
          name="secondaryColor"
          label="Дополнительный цвет"
          controller={({ value, onChange }) => (
            <ColorPicker value={value} onChange={onChange} />
          )}
        />

        <Field
          name="accentColor"
          label="Акцентный цвет"
          controller={({ value, onChange }) => (
            <ColorPicker value={value} onChange={onChange} />
          )}
        />

        <SubmitButton className="w-full">Сохранить настройки</SubmitButton>
      </Form>
    </div>
  );
}
```

## Laravel контроллер

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ThemeController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'primaryColor' => 'required|regex:/^#[0-9A-F]{6}$/i',
            'secondaryColor' => 'required|regex:/^#[0-9A-F]{6}$/i',
            'accentColor' => 'required|regex:/^#[0-9A-F]{6}$/i',
        ]);

        // Сохранение настроек темы
        auth()->user()->update([
            'theme_settings' => $validated
        ]);

        return redirect()->back()->with('success', 'Настройки темы сохранены!');
    }
}
```

## Тестирование

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { AdvancedColorFieldExample } from "./AdvancedColorFieldExample";

test("изменяет цвет при выборе из палитры", () => {
  render(<AdvancedColorFieldExample />);

  const colorButtons = screen.getAllByTitle(/выбрать #/);
  const firstColorButton = colorButtons[0];

  fireEvent.click(firstColorButton);

  // Проверяем, что цвет изменился
  expect(firstColorButton).toHaveStyle({ backgroundColor: "#ff0000" });
});

test("открывает color picker при клике на кнопку", () => {
  render(<AdvancedColorFieldExample />);

  const colorButton = screen.getByTitle("Выбрать цвет");
  fireEvent.click(colorButton);

  // Проверяем, что color picker появился
  expect(screen.getByDisplayValue("#3b82f6")).toBeInTheDocument();
});
```

## Ключевые особенности

1. **Гибкость**: `Field` компонент позволяет создать любое кастомное поле
2. **Интеграция**: Кастомное поле полностью интегрировано с системой форм
3. **Валидация**: Поддерживает серверную валидацию
4. **Доступность**: Можно добавить ARIA атрибуты для доступности
5. **Стилизация**: Полный контроль над внешним видом

## Следующие шаги

- [Создание других кастомных полей](./custom-fields.md)
- [Валидация кастомных полей](./validation.md)
- [Интеграция с другими UI библиотеками](./ui-integration.md)
