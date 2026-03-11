import React from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Button } from "../button";
import { Typography } from "../Typography";

const widthClasses = { sm: "md:w-[400px]", md: "md:w-[600px]", lg: "md:w-[800px]", full: "w-full md:h-full md:max-h-full md:w-full" };

const containerVariants = cva(
  [
    "flex flex-col fixed box-border duration-200",
    "right-0 bottom-0 left-0 rounded-t-3xl md:rounded-2xl",
    "md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:[right:unset] md:[bottom:unset]",
    "bg-white max-h-[calc(100vh-20px)] md:max-h-[calc(100vh-40px)] shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
  ],
  {
    variants: {
      width: {
        sm: widthClasses.sm,
        md: widthClasses.md,
        lg: widthClasses.lg,
        full: widthClasses.full,
      },
      padding: { none: "p-0", md: "p-4 md:p-6" },
      overflow: { false: "", true: "overflow-hidden" },
    },
    defaultVariants: { width: "sm", padding: "md", overflow: false },
  }
);

const Dialog = RadixDialog.Root;
const DialogPortal = RadixDialog.Portal;

const DialogTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <RadixDialog.Trigger ref={ref} asChild className={cn(className)} {...props} />
));
DialogTrigger.displayName = "DialogTrigger";

const DialogOverlay = React.forwardRef(({ className, style, ...props }, ref) => (
  <RadixDialog.Overlay
    ref={ref}
    style={{ zIndex: style?.zIndex ?? 50, ...style }}
    className={cn(
      "fixed inset-0 z-50 bg-[rgba(37,29,53,0.48)]",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef(
  (
    {
      className,
      children,
      width = "sm",
      padding = "md",
      overflow = false,
      disableAutoFocus = true,
      disableOutsideClick = false,
      onOpenAutoFocus,
      onInteractOutside,
      style,
      "data-testid": dataTestId,
      ...props
    },
    ref
  ) => (
    <RadixDialog.Content
      ref={ref}
      data-testid={dataTestId ?? "dialog-content"}
      style={{ zIndex: 51, ...style }}
      onOpenAutoFocus={(e) => {
        if (disableAutoFocus) e.preventDefault();
        else onOpenAutoFocus?.(e);
      }}
      onInteractOutside={(e) => {
        if (disableOutsideClick) e.preventDefault();
        else onInteractOutside?.(e);
      }}
      className={cn(
        containerVariants({ width, padding, overflow }),
        className
      )}
      {...props}
    >
      {children}
    </RadixDialog.Content>
  )
);
DialogContent.displayName = "DialogContent";

const DialogTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <RadixDialog.Title asChild>
    <Typography
      ref={ref}
      as="h2"
      variant="p4"
      weight="bold"
      className={cn("m-0", className)}
      {...props}
    >
      {children}
    </Typography>
  </RadixDialog.Title>
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = RadixDialog.Description;

const DialogClose = React.forwardRef(({ className, asChild, ...props }, ref) => (
  <RadixDialog.Close asChild ref={ref} {...props}>
    {asChild ? (
      props.children
    ) : (
      <Button
        variant="default"
        iconOnly
        icon="CloseIcon"
        size="sm"
        className={cn("shrink-0 rounded-lg", className)}
      />
    )}
  </RadixDialog.Close>
));
DialogClose.displayName = "DialogClose";

const DialogHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5 pb-4", className)}
    {...props}
  />
));
DialogHeader.displayName = "DialogHeader";

const DialogFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex pt-4 border-t border-border", className)}
    {...props}
  />
));
DialogFooter.displayName = "DialogFooter";

export {
  Dialog,
  DialogPortal,
  DialogTrigger,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogFooter,
};
