import React, { HTMLAttributes, useCallback } from "react";
import { clsx } from "clsx";

import { Method, VisitOptions } from "@inertiajs/core";
import { InertiaFormProps, useForm } from "@inertiajs/react";

import { autoAdapter, ValidationAdapter } from "../validator/adapters";
import cloneDeep from "../../logic/cloneObject";
import set from "../../logic/set";
import get from "../../logic/get";

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
  resetOnSuccess?: string[] | boolean;
  resetOnError?: string[] | boolean;
  transform?: (data: FormData) => FormData;
  onSubmit?: (value: any) => void;
}> &
  FormAttrs;

type FormProviderProps = React.PropsWithChildren<FormContextValues>;

type FormContextValues = {
  form: InertiaFormProps<FormData>;
  sharedProps?: Record<string, any>;
  processing: boolean;
  setValue: (name: string, value: any) => void;
  getValues: (name?: string, defaultValue?: any) => any;
  resetAndClearErrors: (fields?: string[]) => void;
  reset: (fields?: string[]) => void;
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
  resetOnSuccess = false,
  resetOnError = false,
  preventFormAction = false,
  method = "post",
  ...attrs
}: FormProps) {
  const form = useForm(defaultValues);

  const normalizedTransform = transform ?? ((data: FormData) => data);

  form.transform(normalizedTransform);

  const getValues = (name?: string, defaultValue?: any) => {
    if (!name) {
      return form.data;
    }

    return get(form.data, name, defaultValue);
  };

  const setValue = (name: string, value: any) => {
    return form.setData((data: any = {}) => {
      const clonedData = cloneDeep(data);
      set(clonedData, name, value);

      return clonedData;
    });
  };

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

  const resetFormFields = (fields: string[] = []) => {
    fields.forEach((field) => {
      const defaultValue = get(defaultValues || {}, field, undefined);
      setValue(field, defaultValue);
    });
  };

  const reset = (fields: string[] = []) => {
    if (fields.length === 0) {
      return form.setData(cloneDeep(defaultValues || {}));
    }

    return resetFormFields(fields);
  };

  const resetAndClearErrors = (fields: string[] = []) => {
    form.clearErrors(...fields);
    reset(fields);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const isValid = await validate(form.data);

      if (!isValid) return;

      const payload = normalizedTransform(form.data);

      onSubmit?.(payload);

      if (preventFormAction) return;

      form.setData(payload);

      const handler = form[method];
      handler(action as string, {
        ...options,
        onSuccess: (...args) => {
          options?.onSuccess?.(...args);

          if (resetOnSuccess === true) {
            return reset();
          }

          if (Array.isArray(resetOnSuccess) && resetOnSuccess.length > 0) {
            return reset(resetOnSuccess);
          }
        },
        onError: (...args) => {
          options?.onError?.(...args);

          if (resetOnError === true) {
            return reset();
          }

          if (Array.isArray(resetOnError) && resetOnError.length > 0) {
            return reset(resetOnError);
          }
        },
      });
    },
    [form.data]
  );

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className={clsx("space-y-2", className)}
      {...attrs}
    >
      <FormProvider
        processing={form.processing}
        sharedProps={sharedProps}
        form={form}
        reset={reset}
        setValue={setValue}
        getValues={getValues}
        resetAndClearErrors={resetAndClearErrors}
      >
        {children}
      </FormProvider>
    </form>
  );
}

const FormProvider: React.FC<FormProviderProps> = ({
  form,
  children,
  sharedProps,
  processing,
  reset,
  setValue,
  getValues,
  resetAndClearErrors,
}) => {
  return (
    <FormContext.Provider
      value={{
        form,
        sharedProps,
        processing,
        reset,
        setValue,
        getValues,
        resetAndClearErrors,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export default Form;
