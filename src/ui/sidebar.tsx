/**
 * Sidebar — боковая панель по умолчанию (как на проде).
 * Структура: верх (company + balance), навигация (children), футер (user).
 */
import { Icon } from "./Icon";
import "./sidebar.css";

const DEFAULT_COMPANY_NAME = "ООО «Самый лучший»";
const DEFAULT_COMPANY_LOGO = "/company-avatar.png";
const DEFAULT_BALANCE_LABEL = "Баланс:";
const DEFAULT_BALANCE_VALUE = "12 002 450 ₽";
const DEFAULT_USER_NAME = "Замятина Анастасия";
const DEFAULT_USER_INITIALS = "ЗА";

function DefaultCompanyBlock({ companyName, companyLogoSrc }) {
  return (
    <button type="button" className="sidebar-company" aria-expanded="false" aria-haspopup="listbox">
      <span className="sidebar-company__logo" aria-hidden>
        <img src={companyLogoSrc} alt="" width={32} height={32} />
      </span>
      <span className="sidebar-company__name text-base-primary-strong">{companyName}</span>
      <span className="sidebar-company__chevron">
        <Icon name="unfold" aria-hidden />
      </span>
    </button>
  );
}

function DefaultBalanceBlock({ balanceLabel, balanceValue }) {
  return (
    <div className="sidebar-balance">
      <div className="sidebar-balance__row">
        <span className="sidebar-balance__label">{balanceLabel}</span>
        <span className="sidebar-balance__value">{balanceValue}</span>
      </div>
    </div>
  );
}

function DefaultFooterBlock({ userName, userInitials }) {
  return (
    <button type="button" className="sidebar-footer-user">
      <span className="sidebar-footer-user__avatar" aria-hidden>
        {userInitials}
      </span>
      <span className="sidebar-footer-user__name text-base-primary-strong">{userName}</span>
      <Icon name="unfold" className="sidebar-footer-user__arrow" aria-hidden />
    </button>
  );
}

export function Sidebar({
  companyBlock,
  balanceBlock,
  footer,
  companyName = DEFAULT_COMPANY_NAME,
  companyLogoSrc = DEFAULT_COMPANY_LOGO,
  balanceLabel = DEFAULT_BALANCE_LABEL,
  balanceValue = DEFAULT_BALANCE_VALUE,
  userName = DEFAULT_USER_NAME,
  userInitials = DEFAULT_USER_INITIALS,
  children,
}) {
  const topCompany = companyBlock ?? (
    <DefaultCompanyBlock companyName={companyName} companyLogoSrc={companyLogoSrc} />
  );
  const topBalance = balanceBlock ?? (
    <DefaultBalanceBlock balanceLabel={balanceLabel} balanceValue={balanceValue} />
  );
  const footerContent =
    footer === undefined ? (
      <DefaultFooterBlock userName={userName} userInitials={userInitials} />
    ) : (
      footer
    );

  return (
    <aside className="sidebar" data-te="sidebar">
      <div className="sidebar__top">
        <div className="sidebar__company">{topCompany}</div>
        <div className="sidebar__balance">{topBalance}</div>
      </div>
      <nav className="sidebar__nav" aria-label="Основная навигация">
        {children}
      </nav>
      {footer !== null && <div className="sidebar__footer">{footerContent}</div>}
    </aside>
  );
}

export default Sidebar;
