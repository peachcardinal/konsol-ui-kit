import React, { createContext, useContext } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "../../lib/utils";
import { Typography } from "../Typography";

const DropdownContext = createContext({
  onClose: undefined,
  selectedValue: undefined,
  onValueChange: undefined,
});

export const Dropdown = React.forwardRef(
  (
    {
      closeOnItemClick = true,
      value,
      onValueChange,
      open,
      onOpenChange,
      defaultOpen,
      children,
      ...props
    },
    _ref
  ) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false);
    const isControlled = open !== undefined;
    const effectiveOpen = isControlled ? open : internalOpen;
    const setEffectiveOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

    const handleClose = React.useCallback(() => {
      setEffectiveOpen(false);
    }, [setEffectiveOpen]);

    const handleValueChange = React.useCallback(
      (newValue) => onValueChange?.(newValue),
      [onValueChange]
    );

    const contextValue = React.useMemo(
      () => ({
        onClose: closeOnItemClick ? handleClose : undefined,
        closeOnItemClick,
        selectedValue: value,
        onValueChange: handleValueChange,
      }),
      [closeOnItemClick, handleClose, value, handleValueChange]
    );

    const rootProps = {
      ...props,
      onOpenChange: (v) => {
        if (onOpenChange) onOpenChange(v);
        else setInternalOpen(v);
      },
    };
    if (isControlled) {
      rootProps.open = effectiveOpen;
    } else {
      rootProps.defaultOpen = defaultOpen ?? false;
    }

    return (
      <DropdownContext.Provider value={contextValue}>
        <PopoverPrimitive.Root {...rootProps}>
          {children}
        </PopoverPrimitive.Root>
      </DropdownContext.Provider>
    );
  }
);
Dropdown.displayName = "Dropdown";

export const DropdownTrigger = React.forwardRef(
  ({ className, asChild = false, ...props }, ref) => (
    <PopoverPrimitive.Trigger
      ref={ref}
      asChild={asChild}
      className={cn("font-graphik cursor-pointer outline-none", className)}
      {...props}
    />
  )
);
DropdownTrigger.displayName = "DropdownTrigger";

export const DropdownContent = React.forwardRef(
  (
    {
      className,
      children,
      align = "start",
      side = "bottom",
      minWidth = 200,
      sideOffset = 4,
      style,
      ...props
    },
    ref
  ) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={cn(
          "font-graphik bg-popover text-popover-foreground relative z-50 flex max-h-96 flex-col gap-0.5 overflow-hidden rounded-xl border border-border p-1 shadow-[0_2px_10px_rgba(0,0,0,0.1)]",
          className
        )}
        style={{ minWidth, ...style }}
        {...props}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
);
DropdownContent.displayName = "DropdownContent";

export const DropdownItem = React.forwardRef(
  (
    {
      className,
      children,
      disabled = false,
      asChild,
      danger = false,
      onClick,
      value,
      ...props
    },
    ref
  ) => {
    const { onClose, onValueChange, closeOnItemClick } = useContext(DropdownContext);

    const handleClick = (event) => {
      if (disabled) return;
      onClick?.(event);
      if (value !== undefined) onValueChange?.(value);
      if (closeOnItemClick) onClose?.();
    };

    const itemProps = asChild ? {} : props;

    const itemContent = (
      <div
        ref={ref}
        role="menuitem"
        className={cn(
          "font-graphik relative flex max-h-8 w-full cursor-pointer items-center rounded-md px-3 py-2.5 text-[14px] leading-5 transition-colors outline-none select-none",
          danger ? "text-destructive" : "text-foreground",
          !disabled &&
            (danger
              ? "hover:bg-destructive focus:bg-destructive active:bg-destructive hover:text-white focus:text-white active:text-white"
              : "hover:bg-muted active:bg-hover-background/70"),
          disabled &&
            (danger
              ? "pointer-events-none cursor-not-allowed opacity-50 text-destructive"
              : "pointer-events-none cursor-not-allowed opacity-50"),
          className
        )}
        onClick={handleClick}
        {...itemProps}
      >
        {children}
      </div>
    );

    const content = closeOnItemClick ? (
      <PopoverPrimitive.Close asChild>
        {itemContent}
      </PopoverPrimitive.Close>
    ) : (
      itemContent
    );

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...children.props,
        className: cn(
          "font-graphik relative flex w-full cursor-pointer items-center rounded-sm px-4 py-2.5 text-[14px] leading-5 outline-none select-none transition-colors",
          danger ? "text-destructive" : "text-foreground",
          !disabled &&
            (danger
              ? "hover:bg-destructive hover:text-white focus:bg-destructive focus:text-white active:bg-destructive active:text-white"
              : "hover:bg-hover-background active:bg-hover-background/70"),
          disabled &&
            (danger
              ? "pointer-events-none opacity-50 cursor-not-allowed text-destructive"
              : "pointer-events-none opacity-50 cursor-not-allowed"),
          children.props.className
        ),
        onClick: handleClick,
        role: "menuitem",
      });
    }

    return content;
  }
);
DropdownItem.displayName = "DropdownItem";

export const DropdownLabel = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      className={cn("px-4 py-2 text-sm font-semibold", className)}
      {...props}
    >
      <Typography variant="p3" weight="medium" textColor="secondary">
        {children}
      </Typography>
    </div>
  )
);
DropdownLabel.displayName = "DropdownLabel";

export const DropdownSeparator = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
);
DropdownSeparator.displayName = "DropdownSeparator";
