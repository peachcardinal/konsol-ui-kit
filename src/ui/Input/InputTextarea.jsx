/**
 * InputTextarea — многострочное поле. Figma *Input* / Textarea (389-12330).
 * Status: default | error; Size: default | large; State: default/hover/focus/typing/filled/disabled.
 * Ограничение по высоте (по умолчанию 140px): при превышении — скролл. При error — иконка error_fill справа сверху.
 * Ручка ресайза: опция resizable — растягивание за правый нижний угол.
 */
import { useState, useRef, useLayoutEffect, useCallback } from "react";
import { Icon } from "../Icon";
import "./Input.css";

const MIN_HEIGHT = 40;

export function InputTextarea({
  placeholder,
  value,
  defaultValue,
  onChange,
  disabled,
  status = "default",
  size = "default",
  caption,
  maxHeight = 140,
  rows = 3,
  resizable = true,
  className = "",
  ...rest
}) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const [userHeight, setUserHeight] = useState(null);
  const isControlled = value != null;
  const currentValue = isControlled ? value : internalValue;
  const hasValue = currentValue != null && currentValue !== "";

  const contentRef = useRef(null);
  const textareaRef = useRef(null);
  const resizeStartRef = useRef({ y: 0, height: 0 });

  const statusClass = status === "error" ? "input-wrap--error" : "";
  const disabledClass = disabled ? "input-wrap--disabled" : "";
  const filledClass = hasValue && !disabled ? "input-wrap--filled" : "";
  const sizeClass = size === "large" ? "input-wrap--large" : "";
  const textareaClass = "input-wrap--textarea";

  const wrapClasses = [
    "input-wrap",
    textareaClass,
    statusClass,
    disabledClass,
    filledClass,
    sizeClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleChange = (e) => {
    if (!isControlled && !disabled) setInternalValue(e.target.value);
    if (onChange) onChange(e);
  };

  // Авто-рост по контенту; скролл только у __content (textarea overflow: hidden)
  const syncTextareaHeight = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const sh = ta.scrollHeight;
    ta.style.height = `${Math.max(MIN_HEIGHT, sh)}px`;
  }, []);

  useLayoutEffect(() => {
    syncTextareaHeight();
  }, [currentValue, syncTextareaHeight]);

  const onResizeMouseDown = (e) => {
    if (!resizable || disabled) return;
    e.preventDefault();
    const content = contentRef.current;
    if (!content) return;
    const rect = content.getBoundingClientRect();
    resizeStartRef.current = { y: e.clientY, height: rect.height };
    const onMove = (moveEvent) => {
      const dy = moveEvent.clientY - resizeStartRef.current.y;
      const newH = Math.round(resizeStartRef.current.height + dy);
      const clamped = Math.min(maxHeight || 9999, Math.max(MIN_HEIGHT, newH));
      setUserHeight(clamped);
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const contentStyle = {
    maxHeight: maxHeight ? `${maxHeight}px` : undefined,
    height: userHeight != null ? `${userHeight}px` : undefined,
  };

  const hasErrorIcon = status === "error";

  return (
    <div className="input-textarea-root">
      <div className={wrapClasses}>
        {hasErrorIcon && (
          <span className="input-textarea__icon-error" aria-hidden>
            <Icon name="error_fill" />
          </span>
        )}
        <div ref={contentRef} className="input-textarea__content" style={contentStyle}>
          <textarea
            ref={textareaRef}
            placeholder={placeholder}
            value={currentValue}
            onChange={handleChange}
            disabled={disabled}
            rows={rows}
            {...rest}
            style={{ maxHeight: maxHeight ? `${maxHeight}px` : undefined, ...rest.style }}
          />
        </div>
        <span
          className="input-textarea__resize-handle"
          aria-hidden
          title="Resize"
          onMouseDown={onResizeMouseDown}
          style={{ pointerEvents: resizable && !disabled ? "auto" : "none" }}
        >
          <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.5 6.5L6.5 3.5" stroke="currentColor" strokeOpacity="0.15" strokeLinecap="round" />
            <path d="M0.5 6.5L6.5 0.5" stroke="currentColor" strokeOpacity="0.15" strokeLinecap="round" />
          </svg>
        </span>
      </div>
      {caption && (
        <div className={`input-basic__caption${status === "error" ? " input-basic__caption--error" : ""}`}>
          {caption}
        </div>
      )}
    </div>
  );
}

export default InputTextarea;
