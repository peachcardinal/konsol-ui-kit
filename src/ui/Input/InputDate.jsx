/**
 * InputDate — поле ввода даты (одиночное или диапазон).
 * Соответствует Figma *DatePicker* (415-795):
 * Status: default | error; Size: default | large; State: default/hover/focus/filled/disabled; Range: false | true.
 * Логика как у InputTime: нативный input type="date" без календаря (календарь — позже).
 */
import { useState } from "react";
import { Icon } from "../Icon";
import "./Input.css";

function useDateValue(value, defaultValue) {
  const [internal, setInternal] = useState(defaultValue ?? "");
  const isControlled = value != null;
  const current = isControlled ? value : internal;
  const setValue = (next) => {
    if (!isControlled) setInternal(next ?? "");
    return next;
  };
  return [current ?? "", setValue, isControlled];
}

export function InputDate({
  value,
  defaultValue,
  valueStart,
  valueEnd,
  defaultValueStart,
  defaultValueEnd,
  onChange,
  onStartChange,
  onEndChange,
  disabled,
  status = "default",
  size = "default",
  range = false,
  caption,
  className = "",
  ...rest
}) {
  const [singleVal, setSingleVal, singleControlled] = useDateValue(value, defaultValue);
  const [startVal, setStartVal, startControlled] = useDateValue(valueStart, defaultValueStart);
  const [endVal, setEndVal, endControlled] = useDateValue(valueEnd, defaultValueEnd);

  const hasValue = range
    ? (startVal != null && startVal !== "") || (endVal != null && endVal !== "")
    : singleVal != null && singleVal !== "";

  const statusClass = status === "error" ? "input-wrap--error" : "";
  const disabledClass = disabled ? "input-wrap--disabled" : "";
  const filledClass = hasValue && !disabled ? "input-wrap--filled" : "";
  const sizeClass = size === "large" ? "input-wrap--large" : "";
  const rangeClass = range ? "input-wrap--range" : "";

  const wrapClasses = [
    "input-wrap",
    "input-date",
    statusClass,
    disabledClass,
    filledClass,
    sizeClass,
    rangeClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleSingleChange = (e) => {
    const v = e.target.value;
    if (!singleControlled && !disabled) setSingleVal(v);
    if (onChange) onChange(e);
  };

  const handleStartChange = (e) => {
    const v = e.target.value;
    if (!startControlled && !disabled) setStartVal(v);
    if (onStartChange) onStartChange(e);
    if (onChange) onChange(e, "start");
  };

  const handleEndChange = (e) => {
    const v = e.target.value;
    if (!endControlled && !disabled) setEndVal(v);
    if (onEndChange) onEndChange(e);
    if (onChange) onChange(e, "end");
  };

  const commonInputProps = {
    type: "date",
    disabled,
    ...rest,
  };

  const rightIconName = status === "error" ? "error_fill" : "calendar";

  return (
    <div className="input-date-root">
      <div className={wrapClasses}>
        <div className="input-content">
          {range ? (
            <>
              <input
                {...commonInputProps}
                value={startVal}
                onChange={handleStartChange}
                aria-label={rest["aria-label"] || "Дата начала"}
              />
              <span className="input-date__sep" aria-hidden>
                <Icon name="arrow_next" />
              </span>
              <input
                {...commonInputProps}
                value={endVal}
                onChange={handleEndChange}
                aria-label={rest["aria-label"] ? `${rest["aria-label"]} (конец)` : "Дата окончания"}
              />
              <span className="input-date__icon-right" aria-hidden>
                <Icon name={rightIconName} />
              </span>
            </>
          ) : (
            <>
              <input
                {...commonInputProps}
                value={singleVal}
                onChange={handleSingleChange}
              />
              <span className="input-date__icon-right" aria-hidden>
                <Icon name={rightIconName} />
              </span>
            </>
          )}
        </div>
      </div>
      {caption && (
        <div
          className={`input-basic__caption${status === "error" ? " input-basic__caption--error" : ""}`}
        >
          {caption}
        </div>
      )}
    </div>
  );
}

export default InputDate;
export { parseDisplayDateToISO, formatISODateToDisplay } from "./dateFormat";
