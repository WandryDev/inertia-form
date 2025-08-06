import { useEffect, useState, useRef } from "react";
import get from "lodash.get";
import isEqual from "lodash.isequal";
import { useFormContext } from "./useFormContext";

type WatchOptions<T> = {
  defaultValue?: T;
  exact?: boolean; // для точного совпадения пути
};

type DefaultWatchValue = Record<string, any> | undefined;

export function useWatch<T = DefaultWatchValue>(): T;
export function useWatch<T = DefaultWatchValue>(
  name: string,
  options?: WatchOptions<T>
): T;
export function useWatch<T = DefaultWatchValue>(
  names: string[],
  options?: WatchOptions<T>
): T;

export function useWatch<T = DefaultWatchValue>(
  name?: string | string[],
  options: WatchOptions<T> = {}
): T {
  const { form } = useFormContext();
  const { defaultValue, exact = false } = options;

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

    if (!isEqual(prevValueRef.current, newValue)) {
      setValue(newValue);
      prevValueRef.current = newValue;
    }
  }, [form.data, name, defaultValue]);

  return value;
}
