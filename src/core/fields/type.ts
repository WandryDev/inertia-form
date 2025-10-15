import { FieldClasses } from "./Field";

export type WithSharedProps<T> = {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  classes?: FieldClasses;
} & T;
