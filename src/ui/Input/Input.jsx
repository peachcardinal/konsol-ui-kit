import React from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../Icon";
import { Button } from "../button";
import { Typography } from "../Typography";

export const inputSizeOptions = ["md", "lg"];

const Input = React.forwardRef(
  (
    {
      className,
      type,
      size = "md",
      icon,
      label,
      error,
      caption,
      iconName,
      iconPosition = "left",
      fullWidthContainer = true,
      fullWidth = true,
      disabled = false,
      containerClassName,
      inlineSelect,
      prefixContainer,
      autoFocus,
      suffix,
      showErrorMessage = true,
      onClear,
      value,
      "data-testid": dataTestId,
      ...props
    },
    ref
  ) => {
    const hasValue =
      value !== undefined && value !== null && value.toString().length > 0;
    const showClearIcon = onClear && hasValue && !disabled;

    return (
      <div className={cn(fullWidthContainer && "w-full")}>
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
          className={cn(
            "group relative flex items-center rounded-lg border border-solid",
            fullWidth && "w-full",
            {
              "bg-background border-border hover:border-hover-input-primary focus-within:border-primary focus-within:shadow-focus disabled:hover:border-border disabled:focus-within:border-border disabled:focus-within:shadow-none disabled:hover:border-none":
                !disabled,
              "bg-background border-border": disabled,
              "bg-background border-destructive hover:border-destructive focus-within:border-destructive focus-within:shadow-error":
                error !== undefined && error !== null && !disabled,
              "h-8": size === "md",
              "h-10 rounded-xl": size === "lg",
              "bg-muted cursor-not-allowed": disabled,
            },
            containerClassName
          )}
        >
          {prefixContainer && (
            <div className="flex items-center pl-1">{prefixContainer}</div>
          )}
          {icon && !iconName && iconPosition === "left" && (
            <div
              className={cn(
                "group-focus-within:text-foreground text-muted-foreground flex items-center pl-2 transition-colors",
                error &&
                  "!group-focus-within:!text-destructive !text-destructive"
              )}
            >
              {icon}
            </div>
          )}
          {iconName && !icon && iconPosition === "left" && (
            <div className="flex items-center pl-2">
              <Icon
                icon={iconName}
                className={cn(
                  "group-focus-within:text-foreground text-muted-foreground transition-colors",
                  error &&
                    "!group-focus-within:!text-destructive !text-destructive"
                )}
              />
            </div>
          )}
          <input
            type={type}
            className={cn(
              "font-graphik flex-1 border-0 bg-transparent py-1 focus:outline-none disabled:cursor-not-allowed",
              "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
              {
                "w-full": fullWidth,
                "placeholder:text-muted-foreground": true,
                "text-[14px]": size === "md",
                "text-[16px]": size === "lg",
                "px-2.5": size === "md" || size === "lg",
                "pl-2":
                  (icon || iconName) &&
                  iconPosition === "left" &&
                  (size === "md" || size === "lg"),
                "text-muted-foreground": disabled,
              },
              className
            )}
            ref={ref}
            value={value}
            disabled={disabled}
            autoFocus={autoFocus}
            data-testid={dataTestId}
            {...props}
          />

          {(inlineSelect ||
            icon ||
            iconName ||
            error ||
            suffix ||
            showClearIcon) && (
            <div className="flex items-center gap-1.5 pr-2">
              {suffix && (
                <div className="font-graphik flex items-center text-[16px]">
                  {suffix}
                </div>
              )}
              {inlineSelect && (
                <div
                  className={cn(
                    "relative inline-block max-w-[110px] overflow-hidden"
                  )}
                >
                  <div className="[&_*]:font-cofo [&_*]:max-w-[110px] [&_*]:overflow-hidden [&_*]:text-ellipsis [&_*]:whitespace-nowrap [&_button]:w-auto [&_button]:min-w-0 [&_button]:px-0 [&_button]:py-0 [&_div[data-radix-popper-content-wrapper]]:!w-auto [&_div[data-radix-select-content]]:!w-auto [&_div[data-radix-select-content]]:!min-w-[120px] [&_span:not([data-radix-select-icon])]:max-w-[85px] [&_svg]:text-default [&_svg]:flex-shrink-0">
                    {inlineSelect}
                  </div>
                </div>
              )}
              {icon && !iconName && iconPosition === "right" && (
                <div
                  className={cn(
                    "group-focus-within:text-foreground text-muted-foreground flex items-center transition-colors",
                    error &&
                      "!group-focus-within:!text-destructive !text-destructive"
                  )}
                >
                  {icon}
                </div>
              )}
              {iconName && !icon && iconPosition === "right" && (
                <Icon
                  icon={iconName}
                  className={cn(
                    "group-focus-within:text-foreground text-muted-foreground transition-colors",
                    error &&
                      "!group-focus-within:!text-destructive !text-destructive"
                  )}
                />
              )}
              {showClearIcon && (
                <div
                  onClick={onClear}
                  className={cn(
                    "flex cursor-pointer items-center justify-center",
                    disabled && "cursor-not-allowed opacity-50"
                  )}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onClear?.();
                  }}
                >
                  <Icon
                    icon="CloseIcon"
                    size={16}
                    className="text-muted-foreground"
                  />
                </div>
              )}
              {error !== undefined && error !== null && (
                <Icon
                  icon="ErrorFillIcon"
                  size={16}
                  className="!text-destructive"
                />
              )}
            </div>
          )}
        </div>
        {caption && !error && (
          <Typography variant="p1" className="mt-1.5" textColor="secondary">
            {caption}
          </Typography>
        )}
        {error && showErrorMessage && (
          <Typography variant="p1" className="mt-1.5" textColor="destructive">
            {error}
          </Typography>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

const InputPassword = React.forwardRef((props, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const inputRef = React.useRef(null);
  const { size = "md", ...restProps } = props;

  const setInputRef = React.useCallback(
    (node) => {
      inputRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  const focusInputAtEnd = React.useCallback(() => {
    if (inputRef.current) {
      const length = inputRef.current.value.length;
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.setSelectionRange(length, length);
      });
    }
  }, []);

  return (
    <Input
      {...restProps}
      ref={setInputRef}
      type={showPassword ? "text" : "password"}
      size={size}
      iconPosition="right"
      icon={
        <Button
          variant="text"
          iconOnly
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowPassword(!showPassword);
            focusInputAtEnd();
          }}
          icon={showPassword ? "VisibilityOnIcon" : "VisibilityOffIcon"}
          className="!text-muted-foreground"
        />
      }
    />
  );
});
InputPassword.displayName = "InputPassword";

const InputSearch = React.forwardRef((props, ref) => {
  const {
    type = "button",
    className,
    size = "md",
    disabled,
    phoneInputSearch = false,
    ...restProps
  } = props;

  return (
    <Input
      {...restProps}
      ref={ref}
      size={size}
      disabled={disabled}
      className="pl-1.5"
      containerClassName={cn(
        "group",
        className,
        type === "border" && [
          "rounded-none",
          "border-0 border-b border-b-border",
          "hover:border-t-0 hover:border-l-0 hover:border-r-0",
          phoneInputSearch
            ? "hover:border-border focus-within:border-border px-3"
            : "hover:border-b-hover-input-primary focus-within:border-b-primary",
          "focus-within:border-t-0 focus-within:border-l-0 focus-within:border-r-0",
          "focus-within:shadow-none",
        ]
      )}
      iconPosition="left"
      icon={
        <Icon
          icon="SearchIcon"
          className="text-muted-foreground group-focus-within:text-foreground text-[16px] transition-colors"
        />
      }
    />
  );
});
InputSearch.displayName = "InputSearch";

const InputTitle = React.forwardRef((props, ref) => {
  const { size = "md", className, disabled, ...restProps } = props;

  return (
    <div className="w-full">
      <Input
        {...restProps}
        ref={ref}
        size={size === "md" ? "lg" : "lg"}
        disabled={disabled}
        className={cn("font-bold", {
          "text-[18px]": size === "md",
          "text-[24px]": size === "lg",
        })}
        containerClassName={cn("h-10", {
          "h-11": size === "lg",
        })}
      />
    </div>
  );
});
InputTitle.displayName = "InputTitle";

const InputLink = React.forwardRef((props, ref) => {
  const { size = "md", className, ...restProps } = props;

  const prefixElement = (
    <div
      className={cn(
        "bg-default-background text-muted-foreground flex items-center",
        size === "md" ? "h-6 rounded-sm px-2" : "h-8 rounded-md px-2"
      )}
    >
      <Typography variant="p2" className="whitespace-nowrap">
        https://
      </Typography>
    </div>
  );

  return (
    <Input
      {...restProps}
      ref={ref}
      size={size}
      className={cn("pl-2", className)}
      prefixContainer={prefixElement}
    />
  );
});
InputLink.displayName = "InputLink";

export { Input, InputLink, InputPassword, InputSearch, InputTitle };
