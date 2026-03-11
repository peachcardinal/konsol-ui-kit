import React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Icon } from "../Icon";

const segmentsVariants = cva(
  "inline-flex items-center justify-center text-secondary-foreground bg-default-background p-0.5 gap-0 font-cofo",
  {
    variants: {
      size: {
        default: "h-8 rounded-[8px]",
        lg: "h-10 rounded-[10px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const segmentItemVariants = cva(
  "cursor-pointer gap-[6px] font-cofo inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none border-0 disabled:pointer-events-none relative",
  {
    variants: {
      variant: {
        default: [
          "bg-transparent",
          "hover:bg-default-background hover:text-secondary",
          "data-[state=on]:bg-white",
          "data-[state=on]:hover:bg-white",
          "data-[state=on]:hover:text-secondary",
          "disabled:bg-default-background disabled:text-gray-400",
        ].join(" "),
        single:
          "bg-white border-0 hover:bg-default-background hover:text-secondary disabled:bg-white disabled:text-secondary disabled:bg-transparent",
        singleActive:
          "bg-transparent border-0 hover:bg-default-background hover:text-secondary disabled:bg-none disabled:text-secondary disabled:bg-transparent",
      },
      size: {
        default: "h-7 px-3 text-sm rounded-[6px]",
        lg: "h-9 px-3 text-base rounded-[8px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export const SegmentItem = React.forwardRef(
  (
    {
      className,
      icon,
      iconPosition = "start",
      size = "default",
      children,
      "data-testid": dataTestId,
      ...props
    },
    ref
  ) => {
    const renderIcon = () => {
      if (!icon) return null;
      if (React.isValidElement(icon)) return icon;
      return <Icon icon={icon} />;
    };

    const content = (
      <>
        {iconPosition === "start" && renderIcon()}
        {children}
        {iconPosition === "end" && renderIcon()}
      </>
    );

    return (
      <ToggleGroupPrimitive.Item
        ref={ref}
        className={cn(segmentItemVariants({ size }), className)}
        data-testid={dataTestId}
        {...props}
      >
        {content}
      </ToggleGroupPrimitive.Item>
    );
  }
);
SegmentItem.displayName = "SegmentItem";

export const Segments = React.forwardRef(
  (
    {
      className,
      size = "default",
      children,
      onValueChange,
      value,
      defaultValue,
      "data-testid": dataTestId,
      ...props
    },
    ref
  ) => {
    const [currentValue, setCurrentValue] = React.useState(
      value ?? defaultValue ?? ""
    );

    const handleValueChange = (newValue) => {
      if (newValue && newValue !== currentValue) {
        setCurrentValue(newValue);
        onValueChange?.(newValue);
      }
    };

    React.useEffect(() => {
      if (value !== undefined) setCurrentValue(value);
    }, [value]);

    return (
      <ToggleGroupPrimitive.Root
        ref={ref}
        type="single"
        className={cn(segmentsVariants({ size }), className)}
        value={currentValue}
        onValueChange={handleValueChange}
        data-testid={dataTestId}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === SegmentItem) {
            return React.cloneElement(child, { size });
          }
          return child;
        })}
      </ToggleGroupPrimitive.Root>
    );
  }
);
Segments.displayName = "Segments";

export const SingleSegment = React.forwardRef(
  (
    {
      className,
      size = "default",
      icon,
      iconPosition = "start",
      children,
      onClick,
      disabled,
      active: externalActive,
      "data-testid": dataTestId,
      ...props
    },
    ref
  ) => {
    const [internalActive, setInternalActive] = React.useState(false);
    const isActive =
      externalActive !== undefined ? externalActive : internalActive;

    const handleClick = () => {
      if (externalActive !== undefined) {
        onClick?.();
      } else {
        setInternalActive((prev) => !prev);
        onClick?.();
      }
    };

    const renderIcon = () => {
      if (!icon) return null;
      if (React.isValidElement(icon)) return icon;
      return <Icon icon={icon} />;
    };

    const content = (
      <>
        {iconPosition === "start" && renderIcon()}
        {children && (
          <span
            className={cn(
              icon && iconPosition === "start" && "ml-2",
              icon && iconPosition === "end" && "mr-2"
            )}
          >
            {children}
          </span>
        )}
        {iconPosition === "end" && renderIcon()}
      </>
    );

    return (
      <button
        ref={ref}
        className={cn(
          segmentItemVariants({
            size,
            variant: isActive ? "singleActive" : "single",
          }),
          className
        )}
        onClick={handleClick}
        disabled={disabled}
        data-testid={dataTestId}
        {...props}
      >
        {content}
      </button>
    );
  }
);
SingleSegment.displayName = "SingleSegment";
