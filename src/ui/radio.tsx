import React from "react";
import * as RadioGroupPrimitives from "@radix-ui/react-radio-group";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils";
import { Typography } from "./Typography";

const radioVariants = cva(
  "peer relative inline-flex shrink-0 items-center justify-center rounded-full border transition-colors focus:outline-none focus:shadow-focus disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border cursor-pointer",
  {
    variants: {
      size: {
        md: "h-4 w-4",
        lg: "h-6 w-6",
      },
      isChecked: {
        true:
          "bg-primary active:bg-primary-active border-primary hover:border-primary-hover active:border-primary-active after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:transform after:rounded-full after:bg-white after:content-[''] disabled:hover:border-primary",
        false:
          "bg-default-background active:bg-background border-border hover:border-primary-hover focus:border-primary-active focus:shadow-focus active:border-primary-active",
      },
      dotSize: {
        md: "after:h-2 after:w-2",
        lg: "after:h-3 after:w-3",
      },
    },
    defaultVariants: {
      size: "md",
      isChecked: false,
      dotSize: "md",
    },
    compoundVariants: [
      { isChecked: true, size: "md", dotSize: "md" },
      { isChecked: true, size: "lg", dotSize: "lg" },
    ],
  }
);

export const Radio = React.forwardRef(
  (
    {
      className,
      size,
      label,
      checked,
      disabled,
      value,
      id,
      name,
      onValueChange,
      onClick,
      onFocus,
      onBlur,
      "data-testid": dataTestId,
      ...props
    },
    ref
  ) => {
    const isChecked = checked || false;
    const isDisabled = disabled || false;
    const generatedId = React.useId();
    const controlId = id || `${generatedId}-radio`;

    return (
      <label
        htmlFor={controlId}
        className={cn(
          "select-none",
          isDisabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"
        )}
      >
        <div className="flex items-center gap-2.5">
          <RadioGroupPrimitives.Item
            className={cn(
              radioVariants({
                size,
                isChecked,
                dotSize: size,
              }),
              className
            )}
            checked={checked}
            disabled={isDisabled}
            value={value}
            id={controlId}
            ref={ref}
            data-testid={dataTestId}
            onClick={onClick}
            onFocus={onFocus}
            onBlur={onBlur}
            onValueChange={onValueChange}
            {...props}
          />
          {label && (
          <span className="font-graphik text-[14px] leading-[20px] font-normal">
            {label}
          </span>
        )}
        </div>
      </label>
    );
  }
);
Radio.displayName = "Radio";

export const RadioGroup = React.forwardRef(
  ({ className, label, error, size = "md", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <Typography
            variant="p3"
            weight="medium"
            className={cn({
              "mb-1.5 text-[14px]": size === "md",
              "mb-2.5 text-[16px]": size === "lg",
            })}
          >
            {label}
          </Typography>
        )}
        <RadioGroupPrimitives.Root
          className={cn("grid gap-1.5", className)}
          ref={ref}
          {...props}
        />
        {error && (
          <Typography variant="p2" className="mt-1" textColor="destructive">
            {error}
          </Typography>
        )}
      </div>
    );
  }
);
RadioGroup.displayName = "RadioGroup";
