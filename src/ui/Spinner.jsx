import React from "react";
import { Icon } from "./Icon";
import { cn } from "../lib/utils";

const spinnerShowVariants = {
  true: "flex",
  false: "hidden",
};

export function Spinner({
  size = 16,
  show = true,
  children,
  className,
  ...props
}) {
  return (
    <span
      className={cn(
        "flex-col items-center justify-center",
        spinnerShowVariants[show ? "true" : "false"],
        className
      )}
      {...props}
    >
      <Icon
        icon="ProgressActivityIcon"
        size={size}
        className={cn("text-primary animate-spin", className)}
      />
      {children}
    </span>
  );
}
