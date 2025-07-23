import React, { HTMLAttributes, HTMLInputTypeAttribute } from "react";
import Field from "./Field";
import { Input } from "../../ui/input";

import { WithSharedProps } from "./type";

type HiddenFieldProps = WithSharedProps<
  {
    labelClassName?: string;
    name: string;
    type?: HTMLInputTypeAttribute;
  } & HTMLAttributes<HTMLInputElement>
>;

const HiddenField: React.FC<HiddenFieldProps> = ({ name, ...attrs }) => {
  return (
    <Field
      name={name}
      label={attrs.label}
      labelClassName={attrs.labelClassName}
      controller={(field) => (
        <Input
          {...field}
          {...attrs}
          type="hidden"
          value={field.value as string}
          name={name}
          onChange={(e) => {
            const value = e.target.value;

            field.onChange(value);
          }}
        />
      )}
    />
  );
};

export default HiddenField;
