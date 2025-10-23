import React from "react";

import { type FieldValue, useField } from "../../hooks/useField";

type FieldControllerProps<TValue = FieldValue> = {
  onChange: (value: TValue) => void;
  value: TValue;
  error?: string;
  disabled?: boolean;
};

type FieldClasses = {
  root?: string;
  label?: string;
  description?: string;
  errorMessage?: string;
};

type FieldController<TValue = FieldValue> = (
  field: FieldControllerProps<TValue>
) => React.ReactElement;

type FieldProps<TValue = FieldValue> = {
  id?: string;
  name: string;
  controller: FieldController<TValue>;
  label?: string | React.ReactElement;
  description?: string | React.ReactElement;
  defaultValue?: FieldValue;
  classes?: FieldClasses;
  orientation?: "vertical" | "horizontal" | "responsive";
};

const fieldVariants = {
  vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
  horizontal: [
    "flex-row items-center",
    "[&>[data-slot=field-label]]:flex-auto",
    "has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
  ],
  responsive: [
    "flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto",
    "@md/field-group:[&>[data-slot=field-label]]:flex-auto",
    "@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
  ],
};

const isLabelString = (label: string | React.ReactElement): label is string =>
  typeof label === "string";

function Field<TValue>({
  name,
  controller,
  defaultValue,
  classes,
  label,
  description,
  orientation = "vertical",
}: FieldProps<TValue>) {
  const { error, value, onChange } = useField(name, { defaultValue });

  const Label =
    label && isLabelString(label) ? (
      <FieldLabel className={classes?.label} children={label} />
    ) : (
      label
    );

  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={[
        "group/field flex w-full gap-3 data-[invalid=true]:text-destructive",
        fieldVariants[orientation],
        classes?.root,
      ].join(" ")}
    >
      {Label}
      {controller({ onChange, error, value })}
      {description && (
        <FieldDescription
          className={classes?.description}
          children={description}
        />
      )}
      {error && (
        <FieldError className={classes?.errorMessage} children={error} />
      )}
    </div>
  );
}

function FieldLabel(props: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="field-label"
      className={[
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4",
        "has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10",
        props.className,
      ].join(" ")}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={[
        "text-muted-foreground text-sm leading-normal font-normal group-has-[[data-orientation=horizontal]]/field:text-balance",
        "last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

function FieldError({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="alert"
      data-slot="field-error"
      className={["text-destructive text-sm font-normal", className].join(" ")}
      {...props}
    />
  );
}

export default Field;
