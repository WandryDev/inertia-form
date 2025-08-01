import React, { HTMLAttributes, HTMLInputTypeAttribute } from "react";
import Field from "./Field";
import { Input } from "../../ui/input";

import { WithSharedProps } from "./type";

type TextFieldProps = WithSharedProps<
  {
    labelClassName?: string;
    name: string;
    type?: HTMLInputTypeAttribute;
  } & HTMLAttributes<HTMLInputElement>
>;

const TextField: React.FC<TextFieldProps> = ({ name, ...attrs }) => {
  return (
    <Field
      name={name}
      label={attrs.label}
      labelClassName={attrs.labelClassName}
      controller={(field) => (
        <Input
          {...field}
          {...attrs}
          value={field.value as string}
          name={name}
          onChange={(e) => field.onChange(e.target.value)}
        />
      )}
    />
  );
};

export default TextField;
