import React, { HTMLAttributes } from "react";

import { VisitOptions } from "@inertiajs/core";
import { InertiaFormProps, useForm } from "@inertiajs/react";

import { cn } from "../../lib/utils";
import { autoAdapter, ValidationAdapter } from "../validator/adapters";

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
  validationSchema?: any;
  validator?: ValidationAdapter;
  sharedProps?: Record<string, any>;
  preventFormAction?: boolean;
  transform?: (data: FormData) => FormData;
  onSubmit?: (value: any) => void;
}> &
  FormAttrs;

type FormProviderProps = React.PropsWithChildren<FormContextValues>;

type FormContextValues = {
  form: InertiaFormProps<FormData>;
  sharedProps?: Record<string, any>;
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
  validationSchema,
  validator,
  sharedProps,
  transform,
  onSubmit,
  preventFormAction = false,
  method = "post",
  ...attrs
}: FormProps) {
  const form = useForm(defaultValues);

  const normalizedTransform = transform ?? ((data: FormData) => data);

  const validate = async (data: FormData): Promise<boolean> => {
    const adapter = validator ?? autoAdapter(validationSchema);

    if (!adapter) return true;

    const result = await adapter.validate(data);

    if (!result.success && result.errors) {
      form.setError(result.errors);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const isValid = await validate(form.data);

    if (!isValid) return;

    const payload = normalizedTransform(form.data);

    onSubmit?.(payload);

    if (preventFormAction) return;

    form.transform(normalizedTransform);
    form.submit(method, action, options);
    // const handler = form[method];
    // handler(action, options);
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
      <FormProvider form={form} reset={reset} sharedProps={sharedProps}>
        {children}
      </FormProvider>
    </form>
  );
}

const FormProvider: React.FC<FormProviderProps> = ({
  form,
  children,
  sharedProps,
  reset,
}) => {
  return (
    <FormContext.Provider value={{ form, sharedProps, reset }}>
      {children}
    </FormContext.Provider>
  );
};

export default Form;
