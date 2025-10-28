import { useContext } from "react";

import { FormContext } from "../core/form/form";

export const useFormContext = () => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("Field must be used inside Form component");
  }

  return context;
};
