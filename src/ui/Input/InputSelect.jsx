/**
 * InputSelect — поле выбора (триггер селекта). Figma *Select Input* (415:57).
 * Status: Default | Error; Size: Default | Large; State: Default, Hovered, Filled, Focused, Disabled; Type: Basic | Multiple.
 * Отображает placeholder или выбранное значение и иконку arrow_down справа. Родитель отвечает за открытие меню (*Select Menu*).
 */
import { Icon } from "../Icon";
import "./Input.css";

export function InputSelect({
  placeholder = "Select",
  value,
  /** Для mode="multiple" — массив выбранных строк (отображаем через запятую или можно передать label). */
  options = [],
  /** Режим: один вариант (строка value) или несколько (массив value). */
  mode = "basic",
  disabled,
  status = "default",
  size = "default",
  caption,
  /** Клик по полю (открыть меню). */
  onClick,
  /** Текст/метка выбранного значения для Basic; для Multiple — массив меток или value. */
  valueLabel,
  className = "",
  id,
  "aria-haspopup": ariaHaspopup = "listbox",
  "aria-expanded": ariaExpanded,
  ...rest
}) {
  const isMultiple = mode === "multiple";
  const hasValue = isMultiple
    ? Array.isArray(value) && value.length > 0
    : value != null && value !== "";

  const displayText = () => {
    if (isMultiple && Array.isArray(value)) {
      if (valueLabel && Array.isArray(valueLabel)) return valueLabel.join(", ");
      const labels = value.map((v) => {
        const opt = options.find((o) => (typeof o === "object" ? o.value === v : o === v));
        return typeof opt === "object" && opt?.label != null ? opt.label : String(v);
      });
      return labels.join(", ");
    }
    if (valueLabel != null) return valueLabel;
    const opt = options.find((o) => (typeof o === "object" ? o.value === value : o === value));
    return typeof opt === "object" && opt?.label != null ? opt.label : (value != null ? String(value) : "");
  };

  const statusClass = status === "error" ? "input-wrap--error" : "";
  const disabledClass = disabled ? "input-wrap--disabled" : "";
  const filledClass = hasValue && !disabled ? "input-wrap--filled" : "";
  const sizeClass = size === "large" ? "input-wrap--large" : "";
  const multipleClass = isMultiple ? "input-select--multiple" : "";

  const wrapClasses = [
    "input-wrap",
    "input-select",
    multipleClass,
    statusClass,
    disabledClass,
    filledClass,
    sizeClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="input-select-root">
      <button
        type="button"
        id={id}
        className={wrapClasses}
        onClick={onClick}
        disabled={disabled}
        aria-haspopup={ariaHaspopup}
        aria-expanded={ariaExpanded}
        aria-label={rest["aria-label"] ?? (placeholder || "Выбор")}
        {...rest}
      >
        <span className="input-select__content input-content">
          <span className={`input-select__text ${!hasValue ? "input-select__text--placeholder" : ""}`}>
            {hasValue ? displayText() : placeholder}
          </span>
          <span
            className={`input-select__arrow input-icon input-icon--right${ariaExpanded ? " input-select__arrow--open" : ""}`}
            aria-hidden
          >
            <Icon name="arrow_down" />
          </span>
          {status === "error" && (
            <span className="input-select__icon-error" aria-hidden>
              <Icon name="error_fill" />
            </span>
          )}
        </span>
      </button>
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

export default InputSelect;
