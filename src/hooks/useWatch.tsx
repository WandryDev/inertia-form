import { useEffect, useState, useRef } from "react";
import get from "lodash.get";
import isEqual from "lodash.isequal";
import { useFormContext } from "./useFormContext";

interface WatchOptions {
  defaultValue?: any;
  exact?: boolean; // для точного совпадения пути
}

// Перегрузки для разных типов параметров
export function useWatch(): Record<string, any>;
export function useWatch(name: string, options?: WatchOptions): any;
export function useWatch(
  names: string[],
  options?: WatchOptions
): Record<string, any>;

export function useWatch(
  name?: string | string[],
  options: WatchOptions = {}
): any {
  const { form } = useFormContext();
  const { defaultValue, exact = false } = options;

  // Инициализируем значение
  const [value, setValue] = useState(() => {
    if (!name) {
      return form.data || {};
    }

    if (Array.isArray(name)) {
      return name.reduce((acc, fieldName) => {
        acc[fieldName] = get(form.data, fieldName, defaultValue);
        return acc;
      }, {} as Record<string, any>);
    }

    return get(form.data, name, defaultValue);
  });

  const prevValueRef = useRef(value);

  useEffect(() => {
    let newValue;

    if (!name) {
      newValue = form.data || {};
    } else if (Array.isArray(name)) {
      newValue = name.reduce((acc, fieldName) => {
        acc[fieldName] = get(form.data, fieldName, defaultValue);
        return acc;
      }, {} as Record<string, any>);
    } else {
      newValue = get(form.data, name, defaultValue);
    }

    // Сравниваем значения
    if (!isEqual(prevValueRef.current, newValue)) {
      setValue(newValue);
      prevValueRef.current = newValue;
    }
  }, [form.data, name, defaultValue]);

  return value;
}
