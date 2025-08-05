import React, { HTMLAttributes } from "react";

import { Checkbox } from "../../ui/checkbox";

import Field from "./Field";
import { WithSharedProps } from "./type";

type CheckboxFieldProps = WithSharedProps<
  {
    name: string;
  } & HTMLAttributes<HTMLSelectElement>
>;

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  name,
  label,
  ...attrs
}) => {
  return (
    <Field
      name={name}
      label={label}
      classes={attrs.classes}
      controller={(field) => (
        <Checkbox
          checked={field.value as boolean}
          onCheckedChange={(value) => field.onChange(value)}
        />
      )}
    />
  );
};

export default CheckboxField;
