import React from "react";
import { cn } from "../lib/utils";

const Card = React.forwardRef(
  (
    {
      className,
      bordered = false,
      radius = "md",
      variant = "default",
      padding = "md",
      overflow = false,
      direction = "col",
      justify = "start",
      align = "start",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex transition-colors",
          bordered && "border border-solid border-border",
          direction === "row" && "flex-row",
          direction === "col" && "flex-col",
          justify === "start" && "justify-start",
          justify === "end" && "justify-end",
          justify === "center" && "justify-center",
          justify === "between" && "justify-between",
          justify === "around" && "justify-around",
          justify === "evenly" && "justify-evenly",
          align === "start" && "items-start",
          align === "end" && "items-end",
          align === "center" && "items-center",
          align === "baseline" && "items-baseline",
          align === "stretch" && "items-stretch",
          radius === "none" && "rounded-none",
          radius === "xs" && "rounded-xs",
          radius === "sm" && "rounded-sm",
          radius === "md" && "rounded-md",
          radius === "lg" && "rounded-lg",
          radius === "xl" && "rounded-xl",
          radius === "2xl" && "rounded-2xl",
          radius === "3xl" && "rounded-3xl",
          radius === "4xl" && "rounded-4xl",
          variant === "default" && "bg-white",
          variant === "gray" && "bg-card-fill-tertiary",
          variant === "muted" && "bg-muted text-muted-foreground font-medium",
          padding === "none" && "p-0",
          padding === "2xxs" && "p-1",
          padding === "xxs" && "p-2",
          padding === "xs" && "p-3",
          padding === "sm" && "p-4",
          padding === "md" && "p-5",
          padding === "lg" && "p-6",
          padding === "xl" && "p-8",
          overflow && "overflow-hidden",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export { Card };
