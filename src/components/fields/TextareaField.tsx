import React, { HTMLAttributes } from "react";
import Field from "./Field";
import { Textarea } from "../../ui/textarea";

import { WithSharedProps } from "./type";

type TextareaFieldProps = WithSharedProps<
  {
    labelClassName?: string;
    name: string;
    rows?: number;
  } & HTMLAttributes<HTMLTextAreaElement>
>;

const TextareaField: React.FC<TextareaFieldProps> = ({
  name,
  rows = 3,
  ...attrs
}) => {
  return (
    <Field
      name={name}
      label={attrs.label}
      labelClassName={attrs.labelClassName}
      controller={(field) => (
        <Textarea
          {...field}
          {...attrs}
          rows={rows}
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

export default TextareaField;
