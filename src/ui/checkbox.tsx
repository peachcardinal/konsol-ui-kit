import React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils";
import { Icon } from "./Icon";

const checkboxVariants = cva(
  "group peer cursor-pointer border border-border focus:border-primary focus:shadow-focus disabled:cursor-not-allowed shrink-0 rounded-[4px] flex items-center justify-center",
  {
    variants: {
      size: {
        md: "h-4 w-4 rounded-[4px]",
        lg: "h-6 w-6 rounded-md",
      },
      state: {
        checked:
          "bg-primary border-primary focus:border-primary focus:hover:border-primary-hover hover:bg-primary-hover hover:border-primary-hover disabled:hover:bg-primary disabled:hover:border-primary active:bg-primary-active active:hover:!border-primary-active",
        unchecked:
          "bg-muted focus:hover:border-primary-hover hover:border-primary-hover disabled:hover:border-border active:hover:!border-primary-active",
        indeterminate:
          "bg-white border-primary focus:border-primary focus:hover:border-primary-hover hover:border-primary-hover disabled:hover:border-primary active:hover:!border-primary-active",
      },
      isDisabled: {
        true: "opacity-40",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      state: "unchecked",
      isDisabled: false,
    },
  }
);

const indicatorVariants = cva(
  "rounded-[2px] bg-primary shrink-0 group-hover:bg-primary-hover group-disabled:group-hover:bg-primary group-active:bg-primary-active",
  {
    variants: {
      size: {
        md: "w-2 h-2",
        lg: "w-3 h-3",
      },
    },
  }
);

const CheckboxComponent = ({
  className,
  checkboxClassName,
  size = "md",
  label,
  disabled,
  checked,
  id,
  onCheckedChange,
  "data-testid": dataTestId,
  ref: refProp,
  ...props
}) => {
  const iconSize = size === "md" ? 16 : 24;
  const checkboxId = React.useId();
  const finalId = id || checkboxId;
  const isDisabled = disabled || false;

  const [internalChecked, setInternalChecked] = React.useState(
    checked === true || checked === "indeterminate" ? checked : false
  );

  const isControlled = checked !== undefined;
  const checkedValue = isControlled ? checked : internalChecked;

  const getState = () => {
    if (checkedValue === true) return "checked";
    if (checkedValue === "indeterminate") return "indeterminate";
    return "unchecked";
  };

  const handleCheckedChange = (newChecked) => {
    if (isControlled && onCheckedChange) {
      onCheckedChange(newChecked);
    } else if (!isControlled) {
      setInternalChecked(newChecked);
    }
  };

  const checkboxElement = (
    <CheckboxPrimitive.Root
      ref={refProp}
      id={finalId}
      className={cn(
        checkboxVariants({ size, state: getState(), isDisabled }),
        checkboxClassName || (!label ? className : undefined)
      )}
      disabled={isDisabled}
      checked={checkedValue}
      onCheckedChange={handleCheckedChange}
      data-testid={dataTestId}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex h-full w-full items-center justify-center">
        {checkedValue === "indeterminate" && (
          <div className={indicatorVariants({ size })} />
        )}
        {checkedValue === true && (
          <Icon icon="DoneIcon" size={iconSize} className="text-white" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (label) {
    return (
      <div className={cn("items-top flex flex-row space-x-2", className)}>
        <div className={cn(size === "md" && "pt-0.5")}>{checkboxElement}</div>
        <label
          htmlFor={finalId}
          className={cn(
            "font-graphik m-0 cursor-pointer text-[14px] leading-[20px] font-normal",
            isDisabled && "cursor-not-allowed opacity-40",
            size === "lg" && "pt-0.5"
          )}
        >
          {label}
        </label>
      </div>
    );
  }

  return checkboxElement;
};

export const Checkbox = React.forwardRef((props, ref) => (
  <CheckboxComponent {...props} ref={ref} />
));
Checkbox.displayName = "Checkbox";
