import React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "../../lib/utils";
import { Icon } from "../Icon";
import { Typography } from "../Typography";

const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center px-3 py-1.5",
      "hover:bg-muted/50 transition-colors",
      className
    )}
    {...props}
  >
    <Icon icon="ArrowUpIcon" size={16} className="text-muted-foreground" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = "SelectScrollUpButton";

const SelectScrollDownButton = React.forwardRef(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollDownButton
      ref={ref}
      className={cn(
        "flex cursor-default items-center justify-center px-3 py-1.5",
        "hover:bg-muted/50 transition-colors",
        className
      )}
      {...props}
    >
      <Icon
        icon="ArrowDownIcon"
        size={16}
        className="text-muted-foreground"
      />
    </SelectPrimitive.ScrollDownButton>
  )
);
SelectScrollDownButton.displayName = "SelectScrollDownButton";

const SelectItem = React.forwardRef(
  (
    {
      className,
      children,
      selected,
      size = "md",
      ...props
    },
    ref
  ) => (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "font-graphik relative flex w-full cursor-pointer items-center px-3 transition-colors outline-none select-none",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "data-[state=checked]:bg-primary-10 data-[state=checked]:font-medium data-[state=checked]:hover:bg-[#F3E5FF]",
        "box-border",
        !selected && "hover:bg-muted",
        selected && "bg-primary-10 font-medium hover:bg-[#F3E5FF]",
        size === "md" &&
          "!h-8 !max-h-8 !min-h-8 rounded-lg text-[14px]",
        size === "lg" &&
          "!h-10 !max-h-10 !min-h-10 rounded-xl text-[16px]",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText asChild>
        <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {children}
        </span>
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
);
SelectItem.displayName = "SelectItem";

const SelectTrigger = React.forwardRef(
  (
    {
      className,
      children,
      size = "md",
      label,
      error,
      caption,
      fullWidth = true,
      transparent = false,
      tag,
      multiple,
      selectedValues,
      onValueRemove,
      disabled,
      "data-testid": dataTestId,
      showErrorMessage = true,
      clearable = false,
      onClear,
      inlineSelect = false,
      ...props
    },
    ref
  ) => {
    const isMultiple =
      multiple || (selectedValues && selectedValues.length > 0);
    const containerRef = React.useRef(null);
    const [visibleCount, setVisibleCount] = React.useState(2);

    React.useLayoutEffect(() => {
      if (!isMultiple || !selectedValues?.length || !containerRef.current)
        return;
      const calculateVisibleCount = () => {
        const container = containerRef.current;
        if (!container) return;
        const containerWidth = container.offsetWidth;
        const tagWidth = tag ? 60 : 0;
        const arrowWidth = 20;
        const errorIconWidth = error ? 20 : 0;
        const padding = 16;
        const counterWidth = 30;
        const availableWidth =
          containerWidth -
          tagWidth -
          arrowWidth -
          errorIconWidth -
          padding -
          counterWidth;
        let currentCount = 0;
        let totalWidth = 0;
        const basePadding = 12;
        const closeIconWidth = 20;
        const gapBetweenElements = 4;
        const charWidth = 7;
        for (let i = 0; i < selectedValues.length; i++) {
          const value = selectedValues[i];
          const textWidth = value.length * charWidth;
          const elementWidth =
            basePadding + textWidth + closeIconWidth + gapBetweenElements;
          if (totalWidth + elementWidth <= availableWidth) {
            totalWidth += elementWidth;
            currentCount = i + 1;
          } else break;
        }
        setVisibleCount(Math.max(1, currentCount));
      };
      calculateVisibleCount();
      const resizeObserver = new ResizeObserver(calculateVisibleCount);
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }, [selectedValues, tag, error, isMultiple]);

    return (
      <div className="w-full">
        {label && (
          <Typography
            variant="p3"
            weight="medium"
            className={cn("mb-1.5", {
              "text-[14px]": size === "md",
              "text-[16px]": size === "lg",
            })}
          >
            {label}
          </Typography>
        )}
        <div
          className={cn("relative flex items-center", fullWidth && "w-full")}
        >
          <SelectPrimitive.Trigger
            ref={ref}
            className={cn(
              "font-graphik flex items-center",
              !transparent && [
                "flex cursor-pointer py-1.5 focus:outline-none disabled:cursor-not-allowed",
                "focus:shadow-focus border focus:border",
                "enabled:hover:border",
                "data-[state=open]:border-primary data-[state=open]:shadow-focus",
                "data-[placeholder]:text-muted-foreground",
                "bg-background border-border placeholder:text-muted-foreground enabled:hover:border-hover-input-primary focus:border-primary disabled:bg-input-disabled-background",
                error !== undefined &&
                  error !== null &&
                  "border-destructive focus:border-destructive focus:shadow-error enabled:hover:border-destructive data-[state=open]:border-destructive data-[state=open]:shadow-error",
                {
                  "h-8 rounded-lg px-2.5 text-[14px]": size === "md",
                  "h-10 rounded-xl px-3 text-[16px]": size === "lg",
                  "w-full": fullWidth,
                },
              ],
              transparent && [
                "cursor-pointer border-0 bg-transparent hover:bg-transparent focus:border-0 focus:shadow-none",
                "data-[state=open]:border-0 data-[state=open]:shadow-none",
                "data-[value]:border-0 data-[value]:shadow-none",
                "data-[placeholder]:border-0 data-[placeholder]:shadow-none",
                "text-left outline-none",
              ],
              className
            )}
            {...props}
            data-testid={dataTestId}
          >
            <div
              ref={containerRef}
              className={`flex min-w-0 flex-1 items-center justify-start gap-2 ${inlineSelect ? "" : "pr-2"}`}
            >
              {isMultiple && selectedValues?.length ? (
                <div className="flex flex-1 items-center gap-1 overflow-hidden">
                  {selectedValues.slice(0, visibleCount).map((value) => (
                    <div
                      key={value}
                      className="flex flex-shrink-0 items-center gap-1 rounded bg-[#EFEFF1] px-1.5 py-0.5 text-sm"
                    >
                      <Typography variant="p2">{value}</Typography>
                      <div
                        onPointerDown={(e) => {
                          if (disabled) return;
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          if (disabled) return;
                          e.preventDefault();
                          e.stopPropagation();
                          onValueRemove?.(value);
                        }}
                        onMouseDown={(e) => {
                          if (disabled) return;
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className={cn(
                          "flex cursor-pointer items-center rounded p-0.5 hover:bg-gray-200",
                          disabled && "cursor-not-allowed opacity-50"
                        )}
                      >
                        <Icon
                          icon="CloseIcon"
                          size={12}
                          className="!text-secondary"
                        />
                      </div>
                    </div>
                  ))}
                  {selectedValues.length > visibleCount && (
                    <div className="flex flex-shrink-0 items-center gap-1 rounded bg-[#EFEFF1] px-2 py-0.5 text-sm">
                      <Typography variant="p2">
                        +{selectedValues.length - visibleCount}
                      </Typography>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 truncate text-left">{children}</div>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {tag && (
                <div
                  className={cn(
                    "rounded px-1.5 py-0.5",
                    typeof tag === "string" ? "bg-[#EFEFF1]" : tag.className
                  )}
                >
                  <Typography variant="p2">
                    {typeof tag === "string" ? tag : tag.text}
                  </Typography>
                </div>
              )}
              {clearable && (
                <div
                  onPointerDown={(e) => {
                    if (disabled) return;
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    if (disabled) return;
                    e.preventDefault();
                    e.stopPropagation();
                    onClear?.();
                  }}
                  onMouseDown={(e) => {
                    if (disabled) return;
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onKeyDown={(e) => {
                    if (disabled) return;
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      onClear?.();
                    }
                  }}
                  className={cn(
                    "flex cursor-pointer items-center justify-center rounded-full p-[2px] hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
                    disabled && "cursor-not-allowed opacity-50"
                  )}
                  role="button"
                  tabIndex={0}
                  aria-label="Очистить значение"
                >
                  <Icon
                    icon="CloseIcon"
                    size={16}
                    className="text-muted-foreground"
                  />
                </div>
              )}
              {error && (
                <Icon
                  icon="ErrorFillIcon"
                  className="!text-destructive"
                  size={16}
                />
              )}
              <SelectPrimitive.Icon asChild>
                <Icon
                  icon="ArrowDownIcon"
                  className={cn("text-muted-foreground", transparent && "pl-1")}
                  size={16}
                />
              </SelectPrimitive.Icon>
            </div>
          </SelectPrimitive.Trigger>
        </div>
        {caption && !error && (
          <Typography variant="p1" className="mt-1.5" textColor="secondary">
            {caption}
          </Typography>
        )}
        {error && showErrorMessage && (
          <Typography
            variant="p1"
            className="mt-1.5"
            textColor="destructive"
          >
            {error}
          </Typography>
        )}
      </div>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

const SelectGroup = SelectPrimitive.Group;

const SelectValue = React.forwardRef(
  ({ className, children, placeholder, ...props }, ref) => (
    <SelectPrimitive.Value
      ref={ref}
      placeholder={placeholder}
      className={cn("block w-full text-left", className)}
      {...props}
    >
      {children}
    </SelectPrimitive.Value>
  )
);

const SelectContent = React.forwardRef(
  (
    {
      className,
      children,
      selectedValues = [],
      value,
      isMultiple = false,
      size = "md",
      ...props
    },
    ref
  ) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          "bg-popover text-popover-foreground border-border relative z-[9999] max-h-80 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.1)]",
          "data-[side=bottom]:mt-1 data-[side=top]:mb-1",
          className
        )}
        position="popper"
        sideOffset={4}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className="box-border flex w-full min-w-[var(--radix-select-trigger-width)] flex-col gap-0.5 p-1">
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return child;
            if (child.type?.displayName === "SelectItem") {
              const isSelected = isMultiple
                ? selectedValues.includes(child.props.value)
                : value === child.props.value;
              return React.cloneElement(child, {
                selected: isSelected,
                size: size || "md",
              });
            }
            return child;
          })}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
);
SelectContent.displayName = "SelectContent";

const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("font-graphik text-secondary px-2 py-1.5 text-[12px]", className)}
    {...props}
  />
));
SelectLabel.displayName = "SelectLabel";

const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("hidden", className)}
    {...props}
  />
));
SelectSeparator.displayName = "SelectSeparator";

const Select = SelectPrimitive.Root;

const MultiSelect = React.forwardRef(
  (
    {
      children,
      selectedValues = [],
      onValuesChange,
      disabled,
      open,
      onOpenChange,
      dir,
      size = "md",
      ...props
    },
    _ref
  ) => {
    const handleValueChange = (newValue) => {
      const newSelected = selectedValues.includes(newValue)
        ? selectedValues.filter((v) => v !== newValue)
        : [...selectedValues, newValue];
      onValuesChange?.(newSelected);
    };

    const handleValueRemove = (valueToRemove) => {
      if (disabled) return;
      const filteredValues = selectedValues.filter((v) => v !== valueToRemove);
      onValuesChange?.(filteredValues);
    };

    return (
      <SelectPrimitive.Root
        {...props}
        disabled={disabled}
        key={selectedValues.slice().sort().join("|")}
        value={undefined}
        defaultValue={undefined}
        onValueChange={handleValueChange}
        open={open}
        onOpenChange={onOpenChange}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;
          if (child.type?.displayName === "SelectTrigger") {
            return React.cloneElement(child, {
              ...child.props,
              multiple: true,
              selectedValues,
              onValueRemove: handleValueRemove,
              disabled,
              size,
            });
          }
          if (child.type?.displayName === "SelectContent") {
            return React.cloneElement(child, {
              ...child.props,
              selectedValues,
              value: undefined,
              isMultiple: true,
              size,
            });
          }
          return child;
        })}
      </SelectPrimitive.Root>
    );
  }
);
MultiSelect.displayName = "MultiSelect";

export {
  MultiSelect,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
