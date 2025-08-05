import React, { HTMLAttributes } from "react";
import Field from "./Field";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { WithSharedProps } from "./type";

type Option = {
  value: string;
  title: string;
};

type SelectFieldProps = WithSharedProps<
  {
    labelClassName?: string;
    name: string;
    options: Option[];
  } & HTMLAttributes<HTMLSelectElement>
>;

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  options,
  placeholder,
  className,
  ...attrs
}) => {
  return (
    <Field
      classes={attrs.classes}
      name={name}
      label={label}
      controller={(field) => {
        return (
          <Select
            value={field.value as string}
            onValueChange={field.onChange}
            disabled={field.disabled}
          >
            <SelectTrigger className={className}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      }}
    />
  );
};

export default SelectField;
