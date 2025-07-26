import { useFormContext } from "./useFormContext";

export type FieldValue = any;

type UseFieldOptions = {
  defaultValue?: FieldValue;
};

export const useField = (name: string, options: UseFieldOptions = {}) => {
  const { form, setValue, getValues } = useFormContext();

  const error = form.errors[name];
  const value = getValues(name, options.defaultValue);

  const onChange = (value: FieldValue) => {
    setValue(name, value);
  };

  return {
    error,
    value,
    onChange,
  };
};
