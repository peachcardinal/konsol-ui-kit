/**
 * Table — заголовок (с опциональной сортировкой) и строки.
 *
 * Table: size = "default" | "compact", striped = false.
 * TableHeader: columns, sortKey, sortOrder, onSort, headerCheckbox.
 * TableCell type: "checkbox" | "item" | "empty" — тип контента ячейки.
 */
import { useRef } from "react";
import { Icon } from "../../Icon";
import { Checkbox } from "../../checkbox";
import "./Table.css";

export function Table({
  children,
  className = "",
  size = "default",
  striped = false,
}) {
  const scrollRef = useRef(null);

  const sizeClass = size === "compact" ? " table--compact" : "";
  const stripedClass = striped ? " table--striped" : "";

  return (
    <div className="table-wrapper">
      <div ref={scrollRef} className="table-scroll">
        <div className="table-scroll__content">
          <table className={`table${sizeClass}${stripedClass} ${className}`.trim()}>{children}</table>
        </div>
      </div>
    </div>
  );
}

export function TableHeader({ columns, sortKey, sortOrder, onSort, headerCheckbox }) {
  return (
    <thead>
      <tr>
        {columns.map(({ key, label, sortable, type }) => {
          const columnType = type || "item";

          if (columnType === "checkbox") {
            return (
              <th key={key} className="table-header-cell--checkbox">
                <div className="table-header table-header--checkbox">
                  <div className="table-header__wrapper table-header__wrapper--checkbox">
                    {headerCheckbox && (
                      <label className="table-header-checkbox-label">
                        <Checkbox
                          id="table-header-select-all"
                          checked={headerCheckbox.indeterminate ? "indeterminate" : headerCheckbox.checked}
                          onCheckedChange={headerCheckbox.onChange}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </th>
            );
          }

          const isEmpty = columnType === "empty";
          const isActive = sortable && sortKey === key;
          const iconName = isActive
            ? sortOrder === "asc"
              ? "ArrowUpIcon"
              : "ArrowDownIcon"
            : "SortIcon";
          const thClass = isEmpty ? "table-header-cell--empty" : `table-header-cell--${key}`;
          return (
            <th key={key} className={thClass}>
              <div
                className={`table-header${sortable ? " table-header--sortable" : ""}`}
                role={sortable ? "button" : undefined}
                tabIndex={sortable ? 0 : undefined}
                onClick={sortable && onSort ? () => onSort(key) : undefined}
                onKeyDown={
                  sortable && onSort
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onSort(key);
                        }
                      }
                    : undefined
                }
                aria-sort={sortable && isActive ? (sortOrder === "asc" ? "ascending" : "descending") : undefined}
              >
                <div
                  className={`table-header__wrapper${
                    isEmpty ? " table-header__wrapper--empty" : ""
                  }`}
                >
                  {sortable && !isEmpty && (
                    <span className="table-header__sorting-icon" aria-hidden>
                      <Icon icon={iconName} />
                    </span>
                  )}
                  {!isEmpty && (
                    <div className="table-item-header-item">
                      <span className="header-item-name">{label}</span>
                    </div>
                  )}
                </div>
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

export function TableRow({ selected, recentlyChanged, children, className = "" }) {
  const classes = [
    "table-row",
    selected ? "table-row--selected" : "",
    recentlyChanged ? "table-row--recently-changed" : "",
    className,
  ].filter(Boolean).join(" ");
  return <tr className={classes}>{children}</tr>;
}

export function TableCell({ type = "item", muted, columnKey, children, className = "" }) {
  const typeClass = type === "checkbox" ? "table-cell--checkbox" : type === "empty" ? "table-cell--empty" : "table-cell--item";
  const columnClass = columnKey ? `table-cell--${columnKey}` : "";
  const classes = [
    typeClass,
    columnClass,
    muted ? "table-cell--muted" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <td className={classes || undefined}>{children}</td>;
}

export default Table;
