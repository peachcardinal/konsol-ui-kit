import React from "react";
import { cn } from "../lib/utils";
import { Icon } from "./Icon";
import { Typography } from "./Typography";
import { Button } from "./button";

const VARIANT_STYLES = {
  error: {
    stripe: "bg-destructive",
    bg: "bg-red-50",
    icon: "text-destructive",
    iconName: "CancelFillIcon",
  },
  info: {
    stripe: "bg-primary",
    bg: "bg-primary-10",
    icon: "text-primary",
    iconName: "InfoFillIcon",
  },
  success: {
    stripe: "bg-positive",
    bg: "bg-[#F6FFED]",
    icon: "text-positive",
    iconName: "CheckCircleFillIcon",
  },
  warning: {
    stripe: "bg-yellow-500",
    bg: "bg-amber-50",
    icon: "text-yellow-500",
    iconName: "InfoFillIcon",
  },
};

export const Alert = React.forwardRef(
  (
    {
      variant,
      title,
      description,
      body,
      action,
      fullWidth,
      closable,
      onClose,
      className,
      "data-testid": dataTestId,
      ...props
    },
    ref
  ) => {
    const styles = VARIANT_STYLES[variant] ?? VARIANT_STYLES.info;

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "flex min-h-12 w-full rounded-lg p-1",
          styles.bg,
          className
        )}
        data-testid={dataTestId}
        {...props}
      >
        <div className="flex items-center">
          <div className={cn("h-full w-1 rounded-lg", styles.stripe)} />
        </div>
        <div className="flex w-full flex-col gap-1">
          <div className="flex w-full flex-1 items-center justify-between p-2">
            <div className="flex w-full flex-col md:flex-row items-start justify-between gap-2">
              <div className="flex w-full flex-row items-start gap-2">
                <div className="flex h-5 w-4 items-center justify-center shrink-0">
                  <Icon icon={styles.iconName} className={cn(styles.icon)} />
                </div>
                <div className="flex w-full flex-col gap-1 min-w-0">
                  <div className="flex w-full gap-2">
                    <div className="flex w-full flex-col gap-0.5">
                      <Typography
                        weight={description ? "medium" : undefined}
                        variant="p2"
                      >
                        {title}
                      </Typography>
                      {description && (
                        <Typography variant="p2">{description}</Typography>
                      )}
                    </div>
                    {(action || closable) && (
                      <div className="flex flex-row items-start gap-1 shrink-0">
                        {action && (
                          <div className="hidden gap-1 md:flex">{action}</div>
                        )}
                        {closable && (
                          <Button
                            type="button"
                            variant="text"
                            icon="CloseIcon"
                            size="sm"
                            iconOnly
                            aria-label="Закрыть уведомление"
                            tabIndex={0}
                            data-testid="button-close-alert"
                            onClick={onClose}
                          />
                        )}
                      </div>
                    )}
                  </div>
                  {body && (
                    <div className="w-full hidden md:flex">{body}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {body && (
            <div className="w-full flex md:hidden p-2 pt-0">{body}</div>
          )}
          {action && (
            <div className="flex flex-row items-center justify-end p-2 md:hidden">
              <div
                className={cn("flex flex-row items-center gap-1", {
                  "w-full": fullWidth,
                })}
              >
                {action}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);
Alert.displayName = "Alert";
