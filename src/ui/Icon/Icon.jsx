/**
 * Иконка из единого каталога (Storybook names: PascalCase + Icon).
 * Заменяет IconAdapter и components/Icon.
 * Поддерживает icon (Storybook) и name (snake_case, маппится на Storybook).
 */

import { icons } from "./icons.jsx";

const ICON_SIZES = [8, 10, 12, 14, 16, 20, 24, 48, 96];

/** Маппинг snake_case → Storybook (для обратной совместимости с components/Icon) */
const nameToIcon = {
  search: "SearchIcon",
  close: "CloseIcon",
  error_fill: "ErrorFillIcon",
  arrow_down: "ArrowDownIcon",
  arrow_up: "ArrowUpIcon",
  arrow_left: "ArrowLeftIcon",
  arrow_right: "ArrowRightIcon",
  arrow_next: "ArrowNextIcon",
  unfold: "UnfoldIcon",
  filter: "FilterIcon",
  add: "AddIcon",
  more_vert: "MoreVertIcon",
  folder: "FolderIcon",
  time: "TimeIcon",
  calendar: "CalendarIcon",
  edit: "EditIcon",
  upload: "UploadIcon",
  download: "DownloadIcon",
  settings: "SettingsIcon",
  fullscreen: "FullScreenIcon",
  work: "WorkIcon",
  check_circle_fill: "CheckCircleFillIcon",
  info_fill: "InfoFillIcon",
  cancel_fill: "CancelFillIcon",
  progress_activity: "ProgressActivityIcon",
  sorting: "SortIcon",
};

/**
 * @param {Object} props
 * @param {string} [props.icon] - Имя иконки Storybook (например "CloseIcon", "SearchIcon")
 * @param {string} [props.name] - snake_case (deprecated, маппится на icon)
 * @param {number} [props.size=16] - Размер (8 | 10 | 12 | 14 | 16 | 20 | 24 | 48 | 96)
 * @param {string} [props.className]
 * @param {React.CSSProperties} [props.style]
 */
export function Icon({ icon: iconProp, name, size = 16, className = "", style = {} }) {
  const resolved =
    iconProp != null
      ? (icons[iconProp] ? iconProp : nameToIcon[iconProp])
      : (name ? nameToIcon[name] : null);
  const SvgIcon = resolved ? icons[resolved] : null;
  if (!SvgIcon) return null;

  const s = ICON_SIZES.includes(size) ? size : 16;

  return (
    <span
      role="img"
      aria-hidden
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: s,
        height: s,
        fontSize: s,
        ...style,
      }}
    >
      <SvgIcon width={s} height={s} style={{ flexShrink: 0 }} />
    </span>
  );
}

export { icons };
export default Icon;
