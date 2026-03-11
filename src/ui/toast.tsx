/**
 * *Toast* — компонент из Figma (node-id 421:14564).
 * Type: Normal | Warning | Success | Error | Loading.
 * Контейнер ToastContainer: по центру экрана, max-width 500px, отступ сверху 20px.
 *
 * ToastAuto — тост с встроенной анимацией появления/исчезновения: показывается на duration мс,
 * затем плавно улетает вверх с уходом в opacity 0, после чего вызывается onDone.
 */
import { useState, useEffect } from "react";
import { Icon } from "./Icon";
import "./toast.css";

const EXIT_DURATION_MS = 280;

const TYPE_ICON = {
  normal: "info_fill",
  warning: "error_fill",
  success: "check_circle_fill",
  error: "cancel_fill",
  loading: "progress_activity",
};

export function Toast({ type = "normal", message, className = "" }) {
  const normalizedType = type.toLowerCase();
  const iconName = TYPE_ICON[normalizedType] || TYPE_ICON.normal;
  const typeMod = ["normal", "success", "warning", "error", "loading"].includes(normalizedType)
    ? `toast--${normalizedType}`
    : "toast--normal";
  const classes = ["toast", typeMod, className].filter(Boolean).join(" ");

  return (
    <div className={classes} role="status" aria-live="polite">
      <span className="toast__icon" aria-hidden>
        <Icon name={iconName} />
      </span>
      <span className="toast__message">{message}</span>
    </div>
  );
}

/**
 * Контейнер для тостов: фиксированно по центру сверху.
 * visible — анимация появления, exiting — анимация исчезновения перед размонтированием.
 */
export function ToastContainer({ children, visible = true, exiting = false }) {
  const classes = [
    "toast-container",
    visible ? "toast-container--visible" : "",
    exiting ? "toast-container--exiting" : "",
  ].filter(Boolean).join(" ");
  return <div className={classes}>{children}</div>;
}

/**
 * Тост с встроенной анимацией: появление сверху (opacity 0 → 1), показ duration мс,
 * затем исчезновение вверх с opacity → 0. После завершения вызывается onDone (размонтировать/очистить тост).
 * В любом сценарии использования анимация отрабатывает автоматически.
 */
export function ToastAuto({
  message,
  type = "success",
  duration = 3000,
  onDone,
}) {
  const [phase, setPhase] = useState("visible"); // 'visible' | 'exiting'

  useEffect(() => {
    let callDoneId = null;
    const startExitId = setTimeout(() => {
      setPhase("exiting");
      callDoneId = setTimeout(() => onDone?.(), EXIT_DURATION_MS);
    }, duration);
    return () => {
      clearTimeout(startExitId);
      if (callDoneId != null) clearTimeout(callDoneId);
    };
  }, [duration, onDone]);

  return (
    <ToastContainer visible={phase === "visible"} exiting={phase === "exiting"}>
      <Toast type={type} message={message} />
    </ToastContainer>
  );
}

export default Toast;
