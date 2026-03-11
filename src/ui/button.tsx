import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { Icon } from "./Icon";
import { Spinner } from "./Spinner";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "outline-none font-cofo box-border cursor-pointer flex items-center justify-center whitespace-nowrap disabled:border disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:pointer-events-none transition-colors duration-200",
  {
    variants: {
      variant: {
        primary:
          "border-0 bg-primary hover:bg-primary-hover focus:bg-primary-hover text-white active:bg-primary-active disabled:text-muted-foreground",
        default:
          "bg-default-background hover:bg-border active:border active:border-solid text-default active:text-secondary active:border-border focus:border focus:border-solid focus:border-border border-0 disabled:border-0",
        dashed:
          "bg-white text-secondary-foreground border border-dashed border-border active:border-solid active:text-primary-active active:border-primary-active hover:border-primary-hover hover:text-primary-hover",
        text: "disabled:bg-transparent text-default border-none bg-transparent hover:bg-default-background focus:bg-default-background",
        link: "disabled:bg-transparent disabled:text-primary-hover disabled:border-0 border-0 disabled:opacity-50 bg-transparent text-primary hover:text-primary-hover active:text-primary-active",
        sber: "bg-[#1FA037] text-white border-0 rounded-lg hover:bg-[#148F2B] hover:border-[#148F2B] active:bg-[#20762B]",
        tbank: "bg-[#FEDD2D] text-black border-0 hover:bg-[#FFCD33] active:bg-[#FAB619]",
        telegram: "bg-[#0088CC] text-white border-0 hover:bg-[#009EED] active:bg-[#0078B4]",
        max: "bg-[#2A4AFA] text-white border-0 hover:bg-[#0476F0] active:bg-[#1B37D6]",
      },
      size: {
        sm: "h-6 rounded-[6px] px-2 text-[14px]",
        md: "h-8 rounded-[8px] px-3 text-[14px]",
        lg: "h-10 rounded-[10px] px-4 text-[16px]",
        custom: "",
      },
      iconOnly: {
        true: "p-0 flex items-center justify-center box-border",
        false: "",
      },
      isActive: {
        true: "",
        false: "",
      },
      isLoading: {
        true: "opacity-64 cursor-not-allowed",
        false: "",
      },
      iconPosition: {
        start: "",
        end: "",
      },
    },
    compoundVariants: [
      {
        isLoading: true,
        variant: "primary",
        className: "disabled:!bg-primary disabled:!text-white disabled:!border-0",
      },
      {
        isLoading: true,
        variant: "default",
        className:
          "disabled:!bg-default-background disabled:!text-default disabled:!border-border",
      },
      {
        isLoading: true,
        variant: "dashed",
        className:
          "disabled:!bg-white disabled:!text-secondary-foreground disabled:!border-border disabled:!border-dashed",
      },
      {
        isLoading: true,
        variant: "text",
        className: "disabled:!bg-transparent disabled:!text-default",
      },
      {
        isLoading: true,
        variant: "link",
        className: "disabled:!bg-transparent disabled:!text-primary disabled:!border-0",
      },
      {
        isLoading: true,
        variant: "sber",
        className: "disabled:!bg-[#1FA037] disabled:!text-white",
      },
      {
        isLoading: true,
        variant: "tbank",
        className: "disabled:!bg-[#FEDD2D] disabled:!text-black",
      },
      {
        isLoading: true,
        variant: "telegram",
        className: "disabled:!bg-[#251D350A] disabled:!text-white",
      },
      {
        isLoading: true,
        variant: "max",
        className: "disabled:!bg-[#251D350A] disabled:!text-white",
      },
      { iconOnly: true, size: "sm", className: "w-6 p-0" },
      { iconOnly: true, size: "md", className: "w-8 p-0" },
      { iconOnly: true, size: "lg", className: "w-10 p-0" },
      {
        isActive: true,
        variant: "primary",
        className: "bg-primary-active",
      },
      {
        isActive: true,
        variant: "default",
        className: "border border-solid text-secondary border-border",
      },
      {
        isActive: true,
        variant: "dashed",
        className: "border-solid text-primary-active border-primary-active",
      },
      {
        isActive: true,
        variant: "link",
        className: "text-primary-active",
      },
      { iconPosition: "start", className: "gap-[6px]" },
      { iconPosition: "end", className: "gap-[6px]" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      iconOnly: false,
      isActive: false,
      isLoading: false,
      iconPosition: "start",
    },
  }
);

type ButtonVariant =
  | "primary"
  | "default"
  | "dashed"
  | "text"
  | "link"
  | "sber"
  | "tbank"
  | "telegram"
  | "max";

type ButtonSize = "sm" | "md" | "lg" | "custom";

type IconPosition = "start" | "end";

type IconName = string;

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  iconOnly?: boolean;
  isActive?: boolean;
  iconPosition?: IconPosition;
  icon?: IconName;
  iconProps?: { size?: number; className?: string; style?: React.CSSProperties };
  isLoading?: boolean;
  "data-testid"?: string;
};

function Button(
  {
    className,
    variant = "primary",
    size = "md",
    asChild = false,
    iconOnly = false,
    isActive = false,
    iconPosition = "start",
    icon,
    children,
    iconProps,
    isLoading = false,
    "data-testid": dataTestId,
    disabled = false,
    onClick,
    ...props
  }: ButtonProps,
  ref: React.Ref<HTMLButtonElement>
) {
  const Comp = asChild ? Slot : "button";

  const getSpinnerColor = () => {
    if (
      variant === "primary" ||
      variant === "sber" ||
      variant === "telegram"
    ) {
      return "text-white";
    }
    if (variant === "link") {
      return "text-primary";
    }
    return "text-default";
  };

  const renderSpinner = () => (
    <Spinner
      size={16}
      className={cn(
        "absolute left-[50%] -translate-x-1/2",
        getSpinnerColor()
      )}
    />
  );

  const renderIcon = () => {
    if (!icon) return null;
    return isLoading ? (
      renderSpinner()
    ) : (
      <Icon icon={icon} {...iconProps} />
    );
  };

  const content = (
    <>
      {iconPosition === "start" && renderIcon()}
      {isLoading ? <div className="invisible">{children}</div> : children}
      {isLoading && !icon && renderSpinner()}
      {iconPosition === "end" && renderIcon()}
    </>
  );

  return (
    <Comp
      {...props}
      className={cn(
        "relative",
        buttonVariants({
          variant,
          size,
          iconOnly,
          isActive,
          isLoading,
          iconPosition,
        }),
        className
      )}
      disabled={isLoading || disabled}
      aria-disabled={isLoading || disabled}
      ref={ref as any}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        if (isLoading || disabled) return;
        onClick?.(e);
      }}
      data-testid={dataTestId}
    >
      {iconOnly ? renderIcon() : content}
    </Comp>
  );
}

const ButtonWithRef = React.forwardRef<HTMLButtonElement, ButtonProps>(Button);

export { ButtonWithRef as Button, buttonVariants };

