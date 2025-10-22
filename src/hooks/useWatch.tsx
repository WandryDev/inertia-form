import { useEffect, useState, useRef } from "react";
import get from "../logic/get";
import { isDeepStrictEqual } from "node:util";

import { useFormContext } from "./useFormContext";

type WatchOptions<T> = {
  defaultValue?: T;
};

type DefaultWatchValue = Record<string, any> | undefined;

export function useWatch<T = DefaultWatchValue>(): T;
export function useWatch<T = DefaultWatchValue>(
  name: string,
  options?: WatchOptions<T>
): T;

export function useWatch<T = DefaultWatchValue>(
  name?: string,
  options: WatchOptions<T> = {}
): T {
  const { form } = useFormContext();

  const [value, setValue] = useState(() => {
    console.log("form data", form.data);
    console.log("name", name);
    console.log("options", options);
    if (!name) {
      return form.data || {};
    }

    return get(form.data, name, options.defaultValue);
  });

  const prevValueRef = useRef(value);

  useEffect(() => {
    const newValue = !name
      ? form.data ?? {}
      : get(form.data, name, options.defaultValue);

    if (!isDeepStrictEqual(prevValueRef.current, newValue)) {
      setValue(newValue);
      prevValueRef.current = newValue;
    }
  }, [form.data, name, options.defaultValue]);

  return value;
}
