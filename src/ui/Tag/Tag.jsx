import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Icon } from "../Icon";

const tagVariants = cva(
  "font-cofo flex flex-shrink-0 items-center justify-center w-fit rounded-md font-medium border-0 h-6 px-2 text-[12px] leading-[16px] min-w-max",
  {
    variants: {
      color: {
        default: "bg-default-background text-default",
        magenta: "bg-[var(--magenta-1)] text-[var(--magenta-8)]",
        blue: "bg-[var(--blue-1)] text-[var(--blue-8)]",
        cyan: "bg-[var(--cyan-1)] text-[var(--cyan-8)]",
        geekblue: "bg-[var(--geekblue-1)] text-[var(--geekblue-8)]",
        gold: "bg-[var(--gold-1)] text-[var(--gold-8)]",
        green: "bg-[var(--green-1)] text-[var(--green-8)]",
        lime: "bg-[var(--lime-1)] text-[var(--lime-8)]",
        orange: "bg-[var(--orange-1)] text-[var(--orange-8)]",
        purple: "bg-[var(--color-primary-bg)] text-[var(--color-primary-text)]",
        red: "bg-[var(--red-1)] text-[var(--red-8)]",
        volcano: "bg-[var(--volcano-1)] text-[var(--volcano-8)]",
        gray: "bg-[var(--grey-1)] text-[var(--grey-8)]",
      },
      iconOnly: {
        true: "w-6 h-6 p-0 flex items-center justify-center",
        false: "",
      },
      iconPosition: {
        start: "gap-1",
        end: "gap-1",
      },
    },
    defaultVariants: {
      color: "default",
      iconOnly: false,
      iconPosition: "start",
    },
  }
);

export const Tag = React.forwardRef(
  (
    {
      color = "default",
      preset,
      disabled = false,
      iconOnly = false,
      iconPosition = "start",
      icon,
      iconProps,
      children,
      className,
      "data-testid": dataTestId,
      ...props
    },
    ref
  ) => {
    const effectiveColor = preset ?? color;

    const renderIcon = () => {
      if (!icon) return null;
      return <Icon icon={icon} size={12} {...iconProps} />;
    };

    const content = (
      <>
        {iconPosition === "start" && renderIcon()}
        {children}
        {iconPosition === "end" && renderIcon()}
      </>
    );

    return (
      <div
        ref={ref}
        className={cn(
          tagVariants({
            color: effectiveColor,
            iconOnly,
            iconPosition,
          }),
          disabled && "bg-muted border-0 opacity-60",
          className
        )}
        data-testid={dataTestId}
        {...props}
      >
        {iconOnly ? renderIcon() : content}
      </div>
    );
  }
);
Tag.displayName = "Tag";
