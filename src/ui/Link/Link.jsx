import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";
import { Icon } from "../Icon";

const Link = React.forwardRef(
  (
    {
      className,
      href = "#",
      children,
      target = "_self",
      onClick,
      onKeyDown,
      disabled = false,
      tabIndex: tabIndexProp,
      asChild = false,
      "data-cy": dataCy,
      "data-testid": dataTestId,
      icon,
      iconPosition = "left",
      iconSize,
      iconClassName,
      ...props
    },
    ref
  ) => {
    const handleClick = (event) => {
      if (disabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      onClick?.(event);
    };

    const handleKeyDown = (event) => {
      if (disabled && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      onKeyDown?.(event);
    };

    const commonClassName = cn(
      "inline-flex items-center whitespace-break-spaces no-underline font-graphik border-0 bg-transparent text-primary hover:text-primary-hover active:text-primary-active",
      "data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 data-[disabled=true]:text-primary-hover",
      className
    );

    if (!icon) {
      const content = children;
      if (asChild) {
        return (
          <Slot
            ref={ref}
            className={commonClassName}
            data-cy={dataCy}
            data-testid={dataTestId}
            aria-disabled={disabled || undefined}
            data-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : tabIndexProp}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            {...props}
          >
            {content}
          </Slot>
        );
      }
      return (
        <a
          ref={ref}
          {...props}
          href={disabled ? undefined : href}
          target={target}
          rel="noopener noreferrer"
          className={commonClassName}
          aria-disabled={disabled || undefined}
          data-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : tabIndexProp}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          data-cy={dataCy}
          data-testid={dataTestId}
        >
          {content}
        </a>
      );
    }

    const iconNode = (
      <Icon
        icon={icon}
        size={iconSize}
        className={cn("shrink-0", iconClassName)}
      />
    );

    const content = (
      <span className="inline-flex items-center gap-2">
        {iconPosition === "left" && iconNode}
        <span className="inline-flex min-w-0">{children}</span>
        {iconPosition === "right" && iconNode}
      </span>
    );

    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={commonClassName}
          data-cy={dataCy}
          data-testid={dataTestId}
          aria-disabled={disabled || undefined}
          data-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : tabIndexProp}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {content}
        </Slot>
      );
    }

    return (
      <a
        ref={ref}
        {...props}
        href={disabled ? undefined : href}
        target={target}
        rel="noopener noreferrer"
        aria-disabled={disabled || undefined}
        data-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : tabIndexProp}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(commonClassName, "gap-2", className)}
        data-cy={dataCy}
        data-testid={dataTestId}
      >
        {content}
      </a>
    );
  }
);
Link.displayName = "Link";

export { Link };
