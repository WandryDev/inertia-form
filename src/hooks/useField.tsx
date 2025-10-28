import { useFormContext } from "./useFormContext";

export type FieldValue = any;

type UseFieldOptions = {
  defaultValue?: FieldValue;
  errorName?: string;
};

export function useField<T = any>(name: string, options: UseFieldOptions = {}) {
  const { form, setValue, getValues } = useFormContext();

  const error = form.errors[options.errorName ?? name];
  const value: T = getValues(name, options.defaultValue);

  const onChange = (value: FieldValue) => {
    setValue(name, value);
  };

  return {
    error,
    value,
    onChange,
  };
}
