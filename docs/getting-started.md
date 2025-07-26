# Установка и настройка

## Установка

Установите пакет с помощью вашего менеджера пакетов:

```bash
# pnpm
pnpm add @wandry/inertia-form

# npm
npm install @wandry/inertia-form

# yarn
yarn add @wandry/inertia-form
```

## Peer Dependencies

Библиотека требует следующие peer-зависимости:

```json
{
  "peerDependencies": {
    "@inertiajs/core": "^2.0.17",
    "@inertiajs/react": "^2.0.17",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-slot": "^1.2.3",
    "@tanstack/react-table": "^8.21.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.525.0",
    "react": "^19.1.0",
    "tailwind-merge": "^3.3.1"
  }
}
```

Установите их, если они еще не установлены:

```bash
pnpm add @inertiajs/core @inertiajs/react @radix-ui/react-checkbox @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slot @tanstack/react-table class-variance-authority clsx lucide-react react tailwind-merge
```

## Настройка Tailwind CSS

Библиотека использует Tailwind CSS для стилизации. Убедитесь, что Tailwind настроен в вашем проекте:

```bash
pnpm add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Настройте `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@wandry/inertia-form/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

## Настройка TypeScript

Для TypeScript проектов убедитесь, что у вас настроен `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "ESNext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

## Первая форма

Создайте простую форму:

```tsx
import { Form, TextField, SubmitButton } from "@wandry/inertia-form";

export function MyFirstForm() {
  return (
    <Form action="/submit" method="post" defaultValues={{ name: "" }}>
      <TextField name="name" label="Имя" placeholder="Введите ваше имя" />
      <SubmitButton>Отправить</SubmitButton>
    </Form>
  );
}
```

## Настройка с Laravel + Inertia

Если вы используете Laravel с Inertia.js, убедитесь что:

1. **Inertia.js установлен и настроен** в Laravel проекте
2. **React компоненты** настроены для обработки форм
3. **Валидация** настроена на серверной стороне

Пример Laravel контроллера:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class FormController extends Controller
{
    public function show()
    {
        return Inertia::render('FormPage');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Обработка данных...

        return redirect()->back()->with('success', 'Форма отправлена!');
    }
}
```

## Следующие шаги

- [Основные концепции](./concepts.md) - Изучите основные принципы работы
- [Компоненты](./components/form.md) - Ознакомьтесь с доступными компонентами
- [Примеры](./examples/simple-form.md) - Посмотрите готовые примеры
