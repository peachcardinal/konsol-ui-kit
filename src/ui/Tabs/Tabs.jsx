import React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Icon } from "../Icon";

const tabsListVariants = cva(
  "inline-flex items-center rounded-md bg-transparent w-full overflow-x-auto no-scrollbar",
  {
    variants: {
      size: { sm: "h-8", md: "h-10", lg: "h-12" },
      variant: { default: "gap-1" },
    },
    defaultVariants: { size: "md", variant: "default" },
  }
);

const tabsTriggerVariants = cva(
  "cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-full font-medium select-none transition-colors border border-transparent font-cofo",
  {
    variants: {
      size: {
        sm: "px-2 py-1 text-xs",
        md: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-base",
      },
      variant: { default: "rounded-full border border-transparent" },
    },
    defaultVariants: { size: "md", variant: "default" },
  }
);

export const Tabs = TabsPrimitive.Root;

export const TabsList = React.forwardRef(
  ({ size = "md", variant = "default", className, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn(tabsListVariants({ size, variant }), className)}
      {...props}
    />
  )
);
TabsList.displayName = "TabsList";

export const TabsTrigger = React.forwardRef(
  (
    {
      size = "md",
      variant = "default",
      className,
      icon,
      iconPosition = "start",
      children,
      disabled,
      "data-testid": dataTestId,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      tabsTriggerVariants({ size, variant }),
      variant === "default"
        ? "bg-white border-border-tabs"
        : "bg-transparent text-gray-600 rounded-md w-full",
      variant === "default"
        ? "data-[state=inactive]:hover:border-border data-[state=inactive]:active:bg-default-background data-[state=inactive]:active:text-secondary"
        : "data-[state=inactive]:hover:bg-gray-50 data-[state=inactive]:hover:rounded-md data-[state=inactive]:hover:shadow-none h-full",
      "focus-visible:outline-none focus-visible:border-2",
      variant === "default"
        ? "data-[state=active]:bg-default-background data-[state=active]:border-transparent data-[state=active]:hover:bg-switch-background data-[state=active]:active:bg-switch-background data-[state=active]:active:text-secondary"
        : "data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=active]:rounded-md data-[state=active]:hover:rounded-md data-[state=active]:hover:shadow-sm data-[state=active]:w-full",
      "disabled:pointer-events-none disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none",
      className
    );

    const renderIcon = () => {
      if (!icon) return null;
      if (React.isValidElement(icon)) return icon;
      return <Icon icon={icon} />;
    };

    return (
      <TabsPrimitive.Trigger
        ref={ref}
        className={classes}
        disabled={disabled}
        data-testid={dataTestId}
        {...props}
      >
        {iconPosition === "start" && renderIcon()}
        {children && (
          <span
            className={cn(
              icon && iconPosition === "start" && "ml-1.5",
              icon && iconPosition === "end" && "mr-1.5"
            )}
          >
            {children}
          </span>
        )}
        {iconPosition === "end" && renderIcon()}
      </TabsPrimitive.Trigger>
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Content
      ref={ref}
      className={cn("mt-2", className)}
      {...props}
    />
  )
);
TabsContent.displayName = "TabsContent";
