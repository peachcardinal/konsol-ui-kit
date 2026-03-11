import React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { Icon } from "../Icon";
import { cn, getAvatarColorByUserId } from "../../lib/utils";

const sizeClasses = {
  small: "h-6 w-6",
  default: "h-8 w-8",
  large: "h-10 w-10",
  extra: "h-12 w-12",
};

const squareRadiusClasses = {
  small: "rounded-[6px]",
  default: "rounded-[8px]",
  large: "rounded-[10px]",
  extra: "rounded-[12px]",
};

const fallbackTextClasses = {
  small: "text-[12px]",
  default: "text-[12px]",
  large: "text-[16px]",
  extra: "text-[16px]",
};

const fallbackBgClasses = {
  purple: "bg-[var(--color-avatar-purple-bg)]",
  cyan: "bg-[var(--color-avatar-cyan-bg)]",
  blue: "bg-[var(--color-avatar-blue-bg)]",
  volcano: "bg-[var(--color-avatar-volcano-bg)]",
  magenta: "bg-[var(--color-avatar-magenta-bg)]",
};

const fallbackTextColorClasses = {
  purple: "text-[var(--color-avatar-purple-fg)]",
  cyan: "text-[var(--color-avatar-cyan-fg)]",
  blue: "text-[var(--color-avatar-blue-fg)]",
  volcano: "text-[var(--color-avatar-volcano-fg)]",
  magenta: "text-[var(--color-avatar-magenta-fg)]",
};

const badgePositions = {
  small: "-top-2 -right-0.5",
  default: "-top-1.5 -right-0.5",
  large: "-top-1.5 -right-0.5",
  extra: "-top-1 -right-1",
};

const Avatar = React.forwardRef(
  (
    {
      className,
      "data-testid": dataTestId,
      size = "default",
      shape = "circle",
      badge = false,
      children,
      ...props
    },
    ref
  ) => {
    const shapeClass =
      shape === "circle" ? "rounded-full" : squareRadiusClasses[size];
    const badgeSize = { small: 8, default: 10, large: 12, extra: 16 }[size];

    return (
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex shrink-0",
          sizeClasses[size],
          shapeClass,
          className
        )}
        data-testid={dataTestId}
        {...props}
      >
        {children}
        {badge && (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none select-none absolute",
              badgePositions[size]
            )}
          >
            <Icon
              icon="ErrorFillIcon"
              className="text-destructive"
              size={badgeSize}
            />
          </span>
        )}
      </AvatarPrimitive.Root>
    );
  }
);
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
      ref={ref}
      className={cn(
        "aspect-square h-full w-full rounded-[inherit] border border-default-background",
        className
      )}
      {...props}
    />
  )
);
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef(
  (
    {
      className,
      size = "default",
      colorVariant,
      userId,
      autoColor = true,
      children,
      ...props
    },
    ref
  ) => {
    const derivedVariant = React.useMemo(() => {
      if (colorVariant) return colorVariant;
      if (!autoColor) return undefined;
      return getAvatarColorByUserId(userId);
    }, [autoColor, colorVariant, userId]);

    const bgClass = derivedVariant
      ? fallbackBgClasses[derivedVariant]
      : "bg-muted";
    const textClass = derivedVariant
      ? fallbackTextColorClasses[derivedVariant]
      : "text-foreground";

    return (
      <AvatarPrimitive.Fallback
        ref={ref}
        className={cn(
          "flex h-full w-full items-center justify-center rounded-[inherit] font-cofo font-normal",
          bgClass,
          textClass,
          fallbackTextClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </AvatarPrimitive.Fallback>
    );
  }
);
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
