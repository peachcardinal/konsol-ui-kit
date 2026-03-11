/**
 * InputLabel — метка поля ввода.
 * Figma: Input Label (node-id 388:11598), страница Form ✅.
 * Размеры: default (base primary strong, геп снизу 6), large (lg primary strong, геп снизу 10).
 * Опционально: иконка 16×16 справа от текста с гепом 4.
 */
import { Icon } from "./Icon";
import "./input-label.css";

export function InputLabel({ label, htmlFor, icon, size = "default", className = "" }) {
  const sizeClass = size === "large" ? "input-label--large" : "";
  const classes = ["input-label", sizeClass, className].filter(Boolean).join(" ");
  return (
    <label className={classes} htmlFor={htmlFor}>
      <span className="input-label__text">{label}</span>
      {icon && (
        <span className="input-label__icon" aria-hidden>
          <Icon name={icon} />
        </span>
      )}
    </label>
  );
}

export default InputLabel;
