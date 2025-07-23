import React, { HTMLAttributes } from "react";

import { VisitOptions } from "@inertiajs/core";
import { InertiaFormProps, useForm } from "@inertiajs/react";

import { cn } from "../../lib/utils";

type FormOptions = Omit<VisitOptions, "data">;
type FormData = Record<string, any>;
type FormAttrs = Omit<
  HTMLAttributes<HTMLFormElement>,
  "defaultValue" | "onSubmit"
>;

type FormProps = React.PropsWithChildren<{
  action: string;
  id?: string;
  method?: "get" | "post" | "put" | "patch" | "delete";
  defaultValues?: FormData;
  options?: FormOptions;
  isEditable?: boolean;
  className?: string;
  onSubmit?: (value: any) => void;
}> &
  FormAttrs;

type FormProviderProps = React.PropsWithChildren<FormContextValues>;

type FormContextValues = {
  form: InertiaFormProps<FormData>;
  reset?: () => void;
};

export const FormContext = React.createContext<FormContextValues | null>(null);

function Form({
  id,
  action,
  children,
  defaultValues,
  options,
  className,
  method = "post",
  ...attrs
}: FormProps) {
  const form = useForm(defaultValues);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const handler = form[method];
    handler(action, options);
  };

  const reset = () => {
    form.reset();
    const handler = form[method];
    handler(action, options);
  };

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className={cn("space-y-4", className)}
      {...attrs}
    >
      <FormProvider form={form} reset={reset}>
        {children}
      </FormProvider>
    </form>
  );
}

const FormProvider: React.FC<FormProviderProps> = ({
  form,
  children,
  reset,
}) => {
  return (
    <FormContext.Provider value={{ form, reset }}>
      {children}
    </FormContext.Provider>
  );
};

export default Form;
