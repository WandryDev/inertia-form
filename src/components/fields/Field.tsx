import React from "react";
import { Label } from "../../ui/label";

import { useFormContext } from "../../hooks";

type FieldValue = any;

type FieldControllerProps<TValue = FieldValue> = {
  onChange: (value: TValue) => void;
  value: TValue;
  disabled?: boolean;
};

type FieldController<TValue = FieldValue> = (
  field: FieldControllerProps<TValue>
) => React.ReactElement;

type FieldProps<TValue = FieldValue> = {
  name: string;
  controller: FieldController<TValue>;
  id?: string;
  label?: string;
  labelClassName?: string;
};

function Field<TValue>({
  id,
  name,
  label,
  controller,
  labelClassName,
}: FieldProps<TValue>) {
  const { form, setValue, getValues } = useFormContext();

  const error = form.errors[name];
  const value = getValues(name);

  const onChange = (value: FieldValue) => {
    setValue(name, value);
  };

  return (
    <div className="grid w-full items-center gap-1.5 relative">
      {label && (
        <Label htmlFor={id} className={labelClassName}>
          {label}
        </Label>
      )}
      {controller({ onChange, value })}

      {error && (
        <span className="text-red-500 text-[12px] absolute -bottom-5">
          {error}
        </span>
      )}
    </div>
  );
}

export default Field;
