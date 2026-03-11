/**
 * Nav Button — пункт бокового меню (Menu ✅).
 */
import "./nav-button.css";

export function NavButton({ active, sub, children, className = "", ...rest }) {
  const classes = ["nav-btn", active ? "nav-btn--active" : "", sub ? "nav-btn--sub" : "", className].filter(Boolean).join(" ");
  return (
    <button type="button" className={classes} {...rest}>
      <span className="nav-btn__label">{children}</span>
    </button>
  );
}

export default NavButton;
