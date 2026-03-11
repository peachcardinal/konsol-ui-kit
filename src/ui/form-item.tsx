/**
 * FormItem — блок поля формы: InputLabel + любой Input (или другой контрол).
 * Figma: Form Item (node-id 515:43856), страница Form ✅.
 * Состав: сверху Input Label, снизу — произвольный контрол (Input Basic/Search/Select/Date/Time/Textarea и т.д.),
 * опционально caption/ошибка под полем.
 */
import { InputLabel } from "./input-label";
import "./form-item.css";

export function FormItem({
  label,
  htmlFor,
  icon,
  size = "default",
  children,
  caption,
  status = "default",
  className = "",
}) {
  const captionClass =
    status === "error" ? "form-item__caption form-item__caption--error" : "form-item__caption";
  return (
    <div className={`form-item ${className}`.trim()}>
      <InputLabel label={label} htmlFor={htmlFor} icon={icon} size={size} />
      <div className="form-item__control">{children}</div>
      {caption != null && caption !== "" && <div className={captionClass}>{caption}</div>}
    </div>
  );
}

export default FormItem;
