import React from "react";
import { Label } from "../../ui/label";

import { type FieldValue, useField } from "../../hooks/useField";
import clsx from "clsx";

type FieldControllerProps<TValue = FieldValue> = {
  onChange: (value: TValue) => void;
  value: TValue;
  disabled?: boolean;
};

type FieldController<TValue = FieldValue> = (
  field: FieldControllerProps<TValue>
) => React.ReactElement;

type FieldClasses = {
  label?: string;
  container?: string;
  error?: string;
};

type FieldProps<TValue = FieldValue> = {
  name: string;
  controller: FieldController<TValue>;
  id?: string;
  label?: string;
  classes?: FieldClasses;
  defaultValue?: FieldValue;
};

function Field<TValue>({
  id,
  name,
  label,
  controller,
  defaultValue,
  classes,
}: FieldProps<TValue>) {
  const { error, value, onChange } = useField(name, { defaultValue });

  return (
    <div
      className={clsx(
        "grid w-full items-center gap-1.5 relative",
        classes?.container
      )}
      data-testid="field-group"
    >
      {label && (
        <Label htmlFor={id} className={classes?.label}>
          {label}
        </Label>
      )}
      {controller({ onChange, value })}

      {error && (
        <span
          className={clsx("text-sm text-red-600", classes?.error)}
          data-testid="field-error"
        >
          {error}
        </span>
      )}
    </div>
  );
}

export default Field;
