import React, { useRef } from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils";
import { Spinner } from "./Spinner";

const switchVariants = cva(
  "peer inline-flex shrink-0 items-center justify-start rounded-full border-none border-transparent transition-colors duration-200 focus:outline-none focus:shadow-focus p-0.5 data-[state=checked]:justify-end cursor-pointer disabled:cursor-not-allowed",
  {
    variants: {
      size: {
        md: "w-7 h-4 rounded-full",
        lg: "w-11 h-6 rounded-full",
      },
      isChecked: {
        true: "bg-primary",
        false: "bg-switch-background",
      },
      isLoading: {
        true: "opacity-64",
        false: "",
      },
      isDisabled: {
        true: "opacity-40",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      isChecked: false,
      isLoading: false,
      isDisabled: false,
    },
    compoundVariants: [
      { isChecked: true, isDisabled: false, class: "hover:bg-primary-hover" },
      {
        isChecked: false,
        isDisabled: false,
        class: "hover:bg-default-background",
      },
    ],
  }
);

const thumbVariants = cva(
  "pointer-events-none block rounded-full border-0 bg-background shadow-lg transition-all duration-200 ease-in-out",
  {
    variants: {
      size: {
        md: "w-3 h-3",
        lg: "w-5 h-5",
      },
    },
    defaultVariants: { size: "md" },
  }
);

const Switch = React.forwardRef(
  (
    {
      className,
      size,
      label,
      loading,
      checked,
      disabled,
      "data-testid": dataTestId,
      onCheckedChange,
      ...props
    },
    ref
  ) => {
    const isChecked = checked ?? false;
    const isDisabled = disabled ?? false;
    const eventRef = useRef(undefined);

    const handleClick = (e) => {
      eventRef.current = e;
    };

    const handleCheckedChange = (newChecked) => {
      if (onCheckedChange) {
        onCheckedChange(newChecked, eventRef.current);
        eventRef.current = undefined;
      }
    };

    return (
      <div className="flex items-center gap-2.5">
        <SwitchPrimitives.Root
          className={cn(
            switchVariants({
              size,
              isChecked,
              isLoading: !!loading,
              isDisabled,
            }),
            className
          )}
          checked={checked}
          disabled={isDisabled}
          ref={ref}
          data-testid={dataTestId}
          onCheckedChange={handleCheckedChange}
          onClick={handleClick}
          {...props}
        >
          <SwitchPrimitives.Thumb
            className={cn(
              thumbVariants({ size }),
              loading && "flex items-center justify-center"
            )}
          >
            {loading && (
              <Spinner
                size={size === "lg" ? 16 : 8}
                className={
                  checked ? "text-primary" : "text-switch-background"
                }
              />
            )}
          </SwitchPrimitives.Thumb>
        </SwitchPrimitives.Root>
        {label && (
          <label
            className={cn(
              "font-graphik font-medium text-[14px] leading-[20px]",
              isDisabled && "opacity-40 cursor-not-allowed"
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Switch.displayName = "Switch";

export { Switch, switchVariants, thumbVariants };
