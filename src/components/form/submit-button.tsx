import React from "react";
import { Loader2 } from "lucide-react";

import { Button, ButtonProps } from "../../ui/button";
import { useFormContext } from "../../hooks/useFormContext";

type SubmitButtonProps = Omit<ButtonProps, "type">;

const SubmitButton: React.FC<SubmitButtonProps> = ({
  children = "Зберегти",
  ...props
}) => {
  const { form } = useFormContext();

  return (
    <Button type="submit" disabled={form.processing} {...props}>
      {form.processing && <Loader2 className="animate-spin" />}
      {children}
    </Button>
  );
};

export default SubmitButton;
