import React from "react";

import { type FieldValue, useField } from "../../hooks/useField";

type FieldControllerProps<TValue = FieldValue> = {
  onChange: (value: TValue) => void;
  value: TValue;
  error?: string;
  disabled?: boolean;
};

type FieldController<TValue = FieldValue> = (
  field: FieldControllerProps<TValue>
) => React.ReactElement;

type FieldProps<TValue = FieldValue> = {
  id?: string;
  name: string;
  controller: FieldController<TValue>;
  defaultValue?: FieldValue;
};

function Field<TValue>({ name, controller, defaultValue }: FieldProps<TValue>) {
  const { error, value, onChange } = useField(name, { defaultValue });

  return <>{controller({ onChange, error, value })}</>;
}

export default Field;
