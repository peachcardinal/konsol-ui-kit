/**
 * InputTime — поле ввода времени (одиночное или диапазон).
 * Соответствует Figma *Input* / Time (5273-5118):
 * Status: default | error; Size: default | large; State: default/hover/focus/selected/filled/disabled; Range: false | true.
 */
import { useState } from "react";
import { Icon } from "../Icon";
import "./Input.css";

function useTimeValue(value, defaultValue) {
  const [internal, setInternal] = useState(defaultValue ?? "");
  const isControlled = value != null;
  const current = isControlled ? value : internal;
  const setValue = (next) => {
    if (!isControlled) setInternal(next ?? "");
    return next;
  };
  return [current ?? "", setValue, isControlled];
}

export function InputTime({
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
  placeholder,
  ...rest
}) {
  const [singleVal, setSingleVal, singleControlled] = useTimeValue(value, defaultValue);
  const [startVal, setStartVal, startControlled] = useTimeValue(valueStart, defaultValueStart);
  const [endVal, setEndVal, endControlled] = useTimeValue(valueEnd, defaultValueEnd);

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
    "input-time",
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
    type: "time",
    disabled,
    ...rest,
  };

  const rightIconName = status === "error" ? "error_fill" : "time";

  /* При пустом значении показываем 00:00 (placeholder не поддерживается у type="time") */
  const displayVal = (v) => (v === "" || v == null ? "00:00" : v);

  return (
    <div className="input-time-root">
      <div className={wrapClasses}>
        <div className="input-content">
          {range ? (
            <>
              <input
                {...commonInputProps}
                value={displayVal(startVal)}
                onChange={handleStartChange}
                aria-label={rest["aria-label"] || "Время начала"}
              />
              <span className="input-time__sep" aria-hidden>
                <Icon name="arrow_next" />
              </span>
              <input
                {...commonInputProps}
                value={displayVal(endVal)}
                onChange={handleEndChange}
                aria-label={rest["aria-label"] ? `${rest["aria-label"]} (конец)` : "Время окончания"}
              />
              <span className="input-time__icon-right" aria-hidden>
                <Icon name={rightIconName} />
              </span>
            </>
          ) : (
            <>
              <input
                {...commonInputProps}
                value={displayVal(singleVal)}
                onChange={handleSingleChange}
              />
              <span className="input-time__icon-right" aria-hidden>
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

export default InputTime;
