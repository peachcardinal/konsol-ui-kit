import React, { useRef, useState, useEffect } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "../../lib/utils";
import { Button } from "../button";

const widthClasses = {
  sm: "md:w-[400px]",
  md: "md:w-[600px]",
  lg: "md:w-[800px]",
};

const ModalOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-[rgba(37,29,53,0.48)]",
      className
    )}
    {...props}
  />
));
ModalOverlay.displayName = "ModalOverlay";

export const Modal = DialogPrimitive.Root;
export const ModalTrigger = DialogPrimitive.Trigger;
export const ModalClose = DialogPrimitive.Close;
export const ModalPortal = DialogPrimitive.Portal;

export const ModalContent = React.forwardRef(
  (
    {
      className,
      children,
      showClose = true,
      footer,
      disabledPadding = false,
      classNameFooter,
      hideOverlay = false,
      fullScreen = false,
      width = "sm",
      onOpenAutoFocus,
      ...props
    },
    ref
  ) => {
    const contentRef = useRef(null);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
      const el = contentRef.current;
      if (!el) return;
      const handleScroll = () => setIsScrolled(el.scrollTop > 0);
      el.addEventListener("scroll", handleScroll);
      return () => el.removeEventListener("scroll", handleScroll);
    }, []);

    return (
      <ModalPortal>
        {!hideOverlay && <ModalOverlay />}
        <DialogPrimitive.Content
          ref={ref}
          onOpenAutoFocus={(e) => {
            e?.preventDefault?.();
            onOpenAutoFocus?.(e);
          }}
          className={cn(
            "fixed z-[51] box-border w-full gap-4 duration-200",
            "right-0 bottom-0 left-0 rounded-t-xl md:[right:unset] md:[bottom:unset]",
            "md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl",
            "max-h-[100vh] overflow-hidden bg-white p-4 md:max-h-[calc(100vh-40px)] md:p-6",
            widthClasses[width],
            { "p-0 md:p-0": disabledPadding },
            { "w-full md:h-full md:max-h-full md:w-full": fullScreen },
            className
          )}
          {...props}
        >
          <div
            className={cn(
              "relative flex h-full max-h-[calc(100vh-32px)] flex-col md:max-h-[calc(100vh-40px-48px)]",
              { "max-h-[100vh] md:max-h-[calc(100vh-40px)]": disabledPadding },
              { "h-full w-full md:h-full md:max-h-[calc(100vh-48px)] md:w-full": fullScreen }
            )}
          >
            <div
              className="no-scrollbar flex flex-col overflow-y-auto"
              ref={contentRef}
            >
              {children}
            </div>
            {footer && (
              <div
                className={cn(
                  "bottom-0 z-[1] flex pt-4 md:pt-6",
                  { "shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]": isScrolled },
                  { "p-4 md:p-6": disabledPadding },
                  { "-mx-4 px-4 md:-mx-6 md:px-6": !disabledPadding },
                  classNameFooter
                )}
              >
                {footer}
              </div>
            )}
            {showClose && (
              <DialogPrimitive.Close
                tabIndex={-1}
                className={cn(
                  "absolute top-2 right-2 border-0 bg-transparent p-0 outline-none",
                  { "top-[-8px] right-[-8px]": !disabledPadding }
                )}
                asChild
              >
                <Button
                  variant="text"
                  className="text-secondary"
                  iconOnly
                  icon="CloseIcon"
                />
              </DialogPrimitive.Close>
            )}
          </div>
        </DialogPrimitive.Content>
      </ModalPortal>
    );
  }
);
ModalContent.displayName = "ModalContent";

export const ModalTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "font-graphik m-0 mb-2 pr-3 text-[28px] leading-[32px] font-bold md:mb-4",
      className
    )}
    {...props}
  />
));
ModalTitle.displayName = "ModalTitle";

export const ModalDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn(className)} {...props} />
));
ModalDescription.displayName = "ModalDescription";
