/**
 * SideModal — базовый шаблон модалки‑панели внизу справа.
 *
 * Фиксирует:
 * - позиционирование: fixed bottom-right 12px, ширина 400;
 * - шапку: заголовок + iconOnly close 24x24, выравнивание по верху;
 * - Content Wrapper: паддинги 0 24 16 24, вертикальный gap 16;
 * - футер: паддинг 16 24 24, одна или несколько кнопок.
 *
 * Используй как оболочку для модалок‑панелей по макету «Изменить стоимость заданий».
 */
import { Button } from "../../ui/button";
import "./SideModal.css";

export function SideModal({ title, onClose, footer, children, ariaLabelledById = "side-modal-title" }) {
  const titleId = ariaLabelledById;

  return (
    <div className="side-modal" role="dialog" aria-labelledby={titleId}>
      <div className="side-modal__container">
        <header className="side-modal__header">
          <h1 id={titleId} className="side-modal__title text-heading-1">
            {title}
          </h1>
          <Button
            variant="default"
            size="sm"
            iconOnly
            icon="CloseIcon"
            onClick={onClose}
            aria-label="Закрыть"
            className="shrink-0 size-6 min-w-6 min-h-6"
          />
        </header>

        <div className="side-modal__scroll">
          <div className="side-modal__content">{children}</div>
        </div>

        {footer && <footer className="side-modal__footer">{footer}</footer>}
      </div>
    </div>
  );
}

export default SideModal;

