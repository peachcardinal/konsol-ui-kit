/**
 * ActionsPanel — панель действий над контентом.
 * Лежит вне сетки, сверху контента. Отступы: слева/справа/снизу 12px.
 * Используй для панелей с сводкой выбора и кнопками действий (Отправить, Завершить и т.д.).
 */
import { Icon } from "./Icon";
import "./actions-panel.css";

export function ActionsPanelSummary({ text, sum, onClose, className = "" }) {
  return (
    <div className={`actions-panel-summary ${className}`.trim()}>
      <span className="actions-panel-summary__text">{text}</span>
      {sum != null && (
        <span className="actions-panel-summary__sum text-base-primary-normal">{sum}</span>
      )}
      {onClose && (
        <button
          type="button"
          className="actions-panel-summary__close"
          onClick={onClose}
          aria-label="Снять выбор"
        >
          <Icon name="close" />
        </button>
      )}
    </div>
  );
}

export function ActionsPanel({
  summary,
  rightSlot,
  children,
  className = "",
}) {
  return (
    <div className={`actions-panel ${className}`.trim()}>
      <div className="actions-panel__left">
        {summary && (
          <ActionsPanelSummary
            text={summary.text}
            sum={summary.sum}
            onClose={summary.onClose}
          />
        )}
        {children}
      </div>
      {rightSlot && <div className="actions-panel__right">{rightSlot}</div>}
    </div>
  );
}

export default ActionsPanel;
