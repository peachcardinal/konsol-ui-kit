import React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "../lib/utils";
import { Button } from "./button";

export function Accordion(props) {
  return (
    <AccordionPrimitive.Root data-slot="accordion" {...props} />
  );
}

export function AccordionItem({ className, ...props }) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-border last:border-b-0", className)}
      {...props}
    />
  );
}

export function AccordionTrigger({
  className,
  children,
  buttonProps = {},
  visibleButton = true,
  ...props
}) {
  const { className: buttonClassName, ...buttonPropsBase } = buttonProps;

  return (
    <AccordionPrimitive.Header className="flex w-full">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "border-border bg-transparent",
          "flex flex-1 items-center justify-between gap-4 rounded-md border-0",
          "py-4 text-left font-medium transition-all outline-none",
          "[&[data-state=open]>.handle]:rotate-180",
          className,
          visibleButton && "cursor-pointer"
        )}
        {...props}
      >
        {children}

        {visibleButton && (
          <Button
            variant="text"
            iconOnly
            size="sm"
            icon="ArrowDownIcon"
            type="button"
            className={cn(
              "handle shrink-0 transition-transform duration-200",
              buttonClassName
            )}
            {...buttonPropsBase}
          />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden data-[state=closed]:duration-200 data-[state=open]:duration-200"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
