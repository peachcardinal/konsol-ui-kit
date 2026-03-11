import React from "react";
import {
  Dialog,
  DialogPortal,
  DialogTrigger,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "./Dialog";

export function DialogBase({
  open,
  onOpenChange,
  width = "md",
  hideFooter = false,
  trigger,
  children,
  classNames = {},
}) {
  const content = hideFooter
    ? React.Children.map(children, (child) =>
        child?.type?.displayName === "DialogBaseFooter" ? null : child
      )
    : children;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogPortal>
        <DialogOverlay />
        <DialogContent width={width} padding="md">
          {content}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

DialogBase.Title = function DialogBaseTitle({ className, children, ...props }) {
  return <DialogTitle className={className} {...props}>{children}</DialogTitle>;
};

DialogBase.Content = function DialogBaseContent({ children, ...props }) {
  return <>{children}</>;
};

DialogBase.Footer = function DialogBaseFooter({ children, ...props }) {
  return <DialogFooter {...props}>{children}</DialogFooter>;
};

DialogBase.Close = DialogClose;
