/**
 * InputBasic — базовый текстовый инпут без иконки поиска.
 * Соответствует Figma *Input* / Basic (515-39978):
 * Status: default | error; Size: default | large; State: default/hover/focus/typing/filled/disabled.
 */
import { useState } from "react";
import { Icon } from "../Icon";
import "./Input.css";

export function InputBasic({
  type = "text",
  placeholder,
  value,
  defaultValue,
  onChange,
  disabled,
  status = "default",
  size = "default",
  iconLeft,
  iconRight,
  suffix,
  caption,
  className = "",
  ...rest
}) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const isControlled = value != null;
  const currentValue = isControlled ? value : internalValue;
  const hasValue = currentValue != null && currentValue !== "";

  const statusClass = status === "error" ? "input-wrap--error" : "";
  const disabledClass = disabled ? "input-wrap--disabled" : "";
  const filledClass = hasValue && !disabled ? "input-wrap--filled" : "";
  const sizeClass = size === "large" ? "input-wrap--large" : "";

  const wrapClasses = ["input-wrap", statusClass, disabledClass, filledClass, sizeClass, className]
    .filter(Boolean)
    .join(" ");

  const effectiveIconRight = status === "error" && !iconRight ? "error_fill" : iconRight;

  const handleChange = (event) => {
    if (!isControlled && !disabled) {
      setInternalValue(event.target.value);
    }
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <div className="input-basic">
      <div className={wrapClasses}>
        <div className="input-content">
          {iconLeft && (
            <span className="input-icon input-icon--left" aria-hidden>
              <Icon name={iconLeft} />
            </span>
          )}
          <input
            type={type}
            placeholder={placeholder}
            value={currentValue}
            onChange={handleChange}
            disabled={disabled}
            {...rest}
          />
          {suffix && <span className="input-suffix">{suffix}</span>}
          {effectiveIconRight && (
            <span className="input-icon input-icon--right" aria-hidden>
              <Icon name={effectiveIconRight} />
            </span>
          )}
        </div>
      </div>
      {caption && (
        <div className={`input-basic__caption${status === "error" ? " input-basic__caption--error" : ""}`}>
          {caption}
        </div>
      )}
    </div>
  );
}

export default InputBasic;

