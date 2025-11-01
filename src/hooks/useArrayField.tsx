import { useCallback } from "react";
import isUndefined from "../logic/isUndefined";
import { useFormContext } from "./useFormContext";
import isObject from "../logic/isObject";

export type FieldValue = any;

type UseFieldOptions = {
  defaultValue?: FieldValue;
  errorName?: string;
};

export function useArrayField<T = any>(
  name: string,
  options: UseFieldOptions = {}
) {
  const { form, setValue, getValues } = useFormContext();

  const error = form.errors[options.errorName ?? name];
  const value: T[] = getValues(name, options.defaultValue);

  const isFirst = (index: number) => index === 0;

  const getInitialValue = useCallback(
    (currentIndex: number, itemDefaultValue?: T) => {
      if (!isUndefined(itemDefaultValue)) {
        return itemDefaultValue;
      }

      const prevValue = isFirst(currentIndex)
        ? value[0]
        : value[currentIndex - 1];

      if (isObject(prevValue)) return {} as T;
      if (Array.isArray(prevValue)) return [] as unknown as T;

      return undefined;
    },
    [value]
  );

  const append = (defaultValue?: T) => {
    const currentIndex = value.length;
    const initialValue = getInitialValue(currentIndex, defaultValue);
    setValue(name, [...(value as T[]), initialValue]);
  };

  const remove = (index: number) => {
    if (isFirst(index)) return;

    const newValue = (value as T[]).filter((_, i) => i !== index);
    setValue(name, newValue);
  };

  const move = (from: number, to: number) => {
    const newValue = [...(value as T[])];
    const [movedItem] = newValue.splice(from, 1);
    newValue.splice(to, 0, movedItem);
    setValue(name, newValue);
  };

  const canAppend = () => true;

  const canRemove = (index: number) => !isFirst(index);

  const canMove = (from: number, to: number) => !isFirst(from) && !isFirst(to);

  return {
    error,
    value,
    append,
    remove,
    move,
    canAppend,
    canRemove,
    canMove,
  };
}
