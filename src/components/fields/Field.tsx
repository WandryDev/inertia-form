import React from "react";
import { Label } from "../../ui/label";

import { type FieldValue, useField } from "../../hooks/useField";

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
  defaultValue?: FieldValue;
};

function Field<TValue>({
  id,
  name,
  label,
  controller,
  labelClassName,
  defaultValue,
}: FieldProps<TValue>) {
  const { error, value, onChange } = useField(name, { defaultValue });

  return (
    <div
      className="grid w-full items-center gap-1.5 relative"
      data-testid="field-group"
    >
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
