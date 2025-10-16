import React, { HTMLAttributes } from "react";

import { Method, VisitOptions } from "@inertiajs/core";
import { InertiaFormProps, useForm } from "@inertiajs/react";

import { autoAdapter, ValidationAdapter } from "../validator/adapters";

type FormOptions = Omit<VisitOptions, "data">;
type FormData = Record<string, any>;
type FormAttrs = Omit<
  HTMLAttributes<HTMLFormElement>,
  "defaultValue" | "onSubmit"
>;

type WayfinderFormAction = {
  url: string;
  method: Method;
};

type FormProps = React.PropsWithChildren<{
  action: string | WayfinderFormAction;
  id?: string;
  method?: "get" | "post" | "put" | "patch" | "delete";
  defaultValues?: FormData;
  options?: FormOptions;
  className?: string;
  validationSchema?: any;
  validator?: ValidationAdapter;
  sharedProps?: Record<string, any>;
  preventFormAction?: boolean;
  onSubmit?: (value: any) => void;
  useWayfinder?: boolean;
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
  onSubmit,
  useWayfinder = false,
  preventFormAction = false,
  method = "post",
  ...attrs
}: FormProps) {
  const form = useForm(defaultValues);

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

    onSubmit?.(form.data);

    if (preventFormAction) return;

    if (useWayfinder) {
      form.submit(action as WayfinderFormAction, options);
    } else {
      const handler = form[method];
      handler(action as string, options);
    }
  };

  const reset = () => {
    form.setData(defaultValues || {});
  };

  return (
    <form id={id} onSubmit={handleSubmit} className={className} {...attrs}>
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
