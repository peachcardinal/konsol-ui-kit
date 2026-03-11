import React, { useEffect, useImperativeHandle, useRef } from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../Icon";
import { Typography } from "../Typography";

function useAutoResize(
  autoResize,
  maxHeight,
  placeholder,
  value
) {
  const textareaRef = useRef(null);
  const minHeightRef = useRef(0);
  const isResizingRef = useRef(false);
  const lastHeightRef = useRef(0);

  useEffect(() => {
    if (!autoResize || !textareaRef.current) return;
    const textarea = textareaRef.current;

    const calculateMinHeight = () => {
      if (placeholder) {
        const originalValue = textarea.value;
        textarea.value = placeholder;
        textarea.style.height = "auto";
        minHeightRef.current = textarea.scrollHeight;
        textarea.value = originalValue;
      }
    };

    if (minHeightRef.current === 0) calculateMinHeight();

    const adjustHeight = () => {
      if (isResizingRef.current) return;
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const targetHeight = Math.max(scrollHeight, minHeightRef.current);

      if (maxHeight) {
        const maxHeightValue =
          typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
        textarea.style.maxHeight = maxHeightValue;
        const maxPx =
          typeof maxHeight === "number"
            ? maxHeight
            : Number.parseInt(String(maxHeight), 10);
        if (targetHeight > maxPx) {
          textarea.style.height = maxHeightValue;
          textarea.style.setProperty("overflow-y", "auto", "important");
        } else {
          textarea.style.height = `${targetHeight}px`;
          textarea.style.setProperty("overflow-y", "hidden", "important");
        }
      } else {
        textarea.style.height = `${targetHeight}px`;
        textarea.style.setProperty("overflow-y", "hidden", "important");
      }
      lastHeightRef.current = textarea.clientHeight;
    };

    const handleWindowResize = () => {
      calculateMinHeight();
      adjustHeight();
    };

    const handleMouseDown = () => {
      isResizingRef.current = true;
    };

    const handleMouseUp = () => {
      if (isResizingRef.current) {
        isResizingRef.current = false;
        const currentHeight = textarea.clientHeight;
        if (currentHeight !== lastHeightRef.current) {
          minHeightRef.current = currentHeight;
        }
        lastHeightRef.current = currentHeight;
        adjustHeight();
      }
    };

    adjustHeight();
    textarea.addEventListener("input", adjustHeight);
    textarea.addEventListener("paste", adjustHeight);
    textarea.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("resize", handleWindowResize);

    return () => {
      textarea.removeEventListener("input", adjustHeight);
      textarea.removeEventListener("paste", adjustHeight);
      textarea.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [autoResize, maxHeight, placeholder, value]);

  return textareaRef;
}

export const Textarea = React.forwardRef(
  (
    {
      className,
      variant = "default",
      fullWidth = true,
      label,
      error,
      caption,
      autoResize = false,
      maxHeight = 140,
      showErrorMessage = true,
      "data-testid": dataTestId,
      disabled,
      size = "md",
      ...props
    },
    ref
  ) => {
    const autoResizeRef = useAutoResize(
      autoResize,
      maxHeight,
      props.placeholder,
      props.value
    );
    useImperativeHandle(ref, () => autoResizeRef.current, [autoResizeRef]);

    return (
      <div className="w-full">
        {label && (
          <Typography variant="p2" weight="medium" className="mb-1.5">
            {label}
          </Typography>
        )}
        <div
          className={cn(
            "bg-background relative flex rounded-lg border border-solid pr-1 pb-1",
            {
              "disabled:hover:border-border disabled:focus-within:border-border border-input hover:border-hover-input-primary focus-within:border-primary focus-within:shadow-focus disabled:focus-within:shadow-none disabled:hover:border-none":
                variant === "default" &&
                (!error || error === "") &&
                !disabled,
              "border-primary hover:border-hover-input-primary focus-within:border-primary":
                variant === "primary" && (!error || error === ""),
              "border-destructive hover:border-destructive focus-within:border-destructive focus-within:shadow-error":
                error !== undefined && error !== null && error !== "",
              "border-positive focus-within:border-positive hover:border-positive":
                variant === "success" && (!error || error === ""),
              "rounded-lg": size === "md",
              "rounded-xl": size === "lg",
              "bg-muted text-muted-foreground cursor-not-allowed border-border":
                disabled,
              "w-full": fullWidth,
            }
          )}
        >
          <textarea
            className={cn(
              "font-graphik placeholder:text-muted-foreground box-border flex flex-1 border-0 bg-transparent transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              {
                "pr-8.5": error && error !== "",
                "max-h-35 min-h-20 resize-y": !autoResize,
                "overflow-hidden resize-y": autoResize,
                "pl-2.5 pr-1.5 pt-2 pb-1 text-[14px]": size === "md",
                "pl-3 pr-2 pt-2.5 pb-1.5 text-[16px]": size === "lg",
              },
              className,
              disabled && "cursor-not-allowed"
            )}
            ref={autoResizeRef}
            data-testid={dataTestId}
            disabled={disabled}
            {...props}
          />
          {error && error !== "" && showErrorMessage && (
            <div
              className={cn("absolute", {
                "top-2 right-1.5": size === "md",
                "top-2.5 right-2": size === "lg",
              })}
            >
              <Icon
                icon="ErrorFillIcon"
                className="text-destructive"
                size={16}
              />
            </div>
          )}
        </div>
        {caption && !error && (
          <Typography variant="p1" className="mt-1.5" textColor="secondary">
            {caption}
          </Typography>
        )}
        {error && (
          <Typography variant="p1" className="mt-1.5" textColor="destructive">
            {error}
          </Typography>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
