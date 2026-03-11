/**
 * Полноэкранная модалка «Изменить задания» — редактирование заданий из таблицы.
 * Открывается по кнопке с иконкой карандаша в ActionsPanel.
 */
import { useState, useCallback, useMemo } from "react";
import { Button } from "../button";
import { Checkbox } from "../checkbox";
import { Table, TableHeader, TableRow, TableCell } from "../table";
import { InputBasic, InputDate, InputTime, parseDisplayDateToISO } from "../Input";
import { Textarea } from "../Textarea";
import { Icon } from "../Icon";
import { Tag } from "../Tag";
import { ChangeCostModal } from "../ChangeCostModal/ChangeCostModal";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Select";
import "./EditAssignmentsModal.css";

const EDIT_MODAL_COLUMNS = [
  { key: "check", label: "", sortable: false, type: "checkbox" },
  { key: "num", label: "№", sortable: true, type: "item" },
  { key: "status", label: "Статус", sortable: true, type: "item" },
  { key: "executor", label: "Исполнитель", sortable: true, type: "item" },
  { key: "period", label: "Период", sortable: true, type: "item" },
  { key: "service", label: "Услуга", sortable: true, type: "item" },
  { key: "price", label: "Цена", sortable: true, type: "item" },
  { key: "unit", label: "Единица", sortable: true, type: "item" },
  { key: "quantity", label: "Кол-во", sortable: true, type: "item" },
  { key: "title", label: "Название", sortable: true, type: "item" },
  { key: "cost", label: "Стоимость", sortable: true, type: "item" },
];

/** Отбивка тысяч пробелом: 10500 → "10 500", 1000000 → "1 000 000" */
function formatThousands(digitsOnly) {
  const s = String(digitsOnly).replace(/\D/g, "");
  if (!s) return "";
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const SERVICE_OPTIONS = ["Курьерские услуги", "Доставка документов", "Курьерская доставка", "Экспресс-доставка"];
const UNIT_OPTIONS = [
  "Минута",
  "Кв.м.",
  "Пог. м.",
  "Услуга",
  "Штука",
  "Час",
  "День",
  "Куб. м.",
  "Кг.",
  "Км.",
  "Печатный знак",
  "Комплект",
  "Коробка",
  "Рейс",
  "Страница",
  "А.Л.",
  "ам.",
];

const STATUS_PRESET = {
  Черновик: "gray",
  Предложено: "orange",
  Отменено: "red",
  "Исполнитель отказался": "red",
  Отказался: "red",
  "В работе": "blue",
  Выполнено: "green",
  "Не выполнено": "red",
  Принято: "blue",
  "Принято автоматически": "blue",
};
function getStatusPreset(status) {
  return STATUS_PRESET[status] || "gray";
}

/** Преобразует задание из таблицы в строку для редактирования */
function taskToEditRow(task) {
  const [periodFromRaw = "", periodToRaw = ""] = (task.period || "").split(/\s*—\s*/);
  const periodFrom = parseDisplayDateToISO(periodFromRaw.trim());
  const periodTo = parseDisplayDateToISO(periodToRaw.trim());
  const [timeFrom = "", timeTo = ""] = (task.periodTime || "").split(/\s*→\s*/);
  const quantity = task.quantity != null ? String(task.quantity) : "1";
  const rawSum = task.sum ?? "0 ₽";
  const costDigits = String(rawSum).replace(/\D/g, "") || "";
  const rawPrice = task.price ?? task.sum ?? "0 ₽";
  const priceDigits = String(rawPrice).replace(/\D/g, "") || "";
  return {
    id: task.id,
    num: task.num ?? "",
    executor: task.executor ?? "",
    phone: task.phone ?? "",
    periodFrom,
    periodTo,
    timeFrom: timeFrom.trim(),
    timeTo: timeTo.trim(),
    service: task.service ?? "",
    price: priceDigits,
    unit: task.unit ?? "Услуга",
    quantity,
    cost: costDigits,
    title: task.title ?? "",
    status: task.status ?? "",
    _original: task,
  };
}

const modalInputClassName = "edit-modal__input";

/** Ошибка периода: только начало заполнено (показать после blur) или конец раньше начала */
function getPeriodError(row) {
  const from = (row.periodFrom || "").trim();
  const to = (row.periodTo || "").trim();
  if (from && !to) return "only_start";
  if (from && to && to < from) return "end_before_start";
  return null;
}

const PERIOD_ERROR_MESSAGES = {
  only_start: "Укажите дату окончания",
  end_before_start: "Дата окончания не может быть раньше даты начала",
};

export function EditAssignmentsModal({ tasks, onClose, onSave }) {
  const [rows, setRows] = useState(() => tasks.map(taskToEditRow));
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [changedCells, setChangedCells] = useState(new Set());
  /** Ошибки валидации периода по row.id: "only_start" | "end_before_start" | null */
  const [periodErrors, setPeriodErrors] = useState({});
  const [changeCostModalOpen, setChangeCostModalOpen] = useState(false);

  const originalRowsMap = useMemo(() => {
    const map = new Map();
    tasks.forEach((task) => {
      const row = taskToEditRow(task);
      map.set(task.id, row);
    });
    return map;
  }, [tasks]);

  /** Уникальные исполнители из списка заданий (для селекта в колонке Исполнитель) */
  const executorOptions = useMemo(() => {
    const seen = new Set();
    return tasks
      .filter((t) => {
        const key = `${t.executor ?? ""}|${t.phone ?? ""}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((t) => ({ executor: t.executor ?? "", phone: t.phone ?? "" }));
  }, [tasks]);

  const totalCount = rows.length;
  const changeCount = changedCells.size; // кол-во изменений — по ячейкам
  const changedRowIds = useMemo(() => {
    const ids = new Set();
    changedCells.forEach((key) => {
      const [id] = key.split(":");
      if (id) ids.add(id);
    });
    return ids;
  }, [changedCells]);
  const changedCount = changedRowIds.size; // Изменено заданий — по строкам

  const updateRow = useCallback((id, field, value) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const next = { ...r, [field]: value };
        return next;
      })
    );
    setChangedCells((prev) => {
      const next = new Set(prev);
      const key = `${id}:${field}`;
      const originalRow = originalRowsMap.get(id);
      const originalValue = originalRow ? originalRow[field] ?? "" : "";
      const normalize = (v) => (v == null ? "" : String(v));
      if (normalize(value) === normalize(originalValue)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, [originalRowsMap]);

  const isCellChanged = (id, field) => changedCells.has(`${id}:${field}`);
  const isAnyChanged = (id, fields) => fields.some((f) => isCellChanged(id, f));

  /** Колонки, которые нельзя редактировать в зависимости от статуса: Черновик — только Стоимость; Предложено — Стоимость, Название, Исполнитель */
  const getDisabledFieldsForStatus = useCallback((status) => {
    if (status === "Черновик") return ["cost"];
    if (status === "Предложено") return ["cost", "title", "executor"];
    return ["cost"];
  }, []);
  const canEditField = useCallback(
    (row, field) => !getDisabledFieldsForStatus(row.status || "").includes(field),
    [getDisabledFieldsForStatus]
  );

  /** Валидация периода: при blur — выставить ошибку (в т.ч. «только начало»); при change — обновить ошибку по актуальным датам */
  const validatePeriodBlur = useCallback((rowId) => {
    const row = rows.find((r) => r.id === rowId);
    if (!row) return;
    setPeriodErrors((prev) => ({ ...prev, [rowId]: getPeriodError(row) }));
  }, [rows]);

  const handlePeriodStartChange = useCallback(
    (rowId, e) => {
      const value = e.target.value;
      updateRow(rowId, "periodFrom", value);
      const row = rows.find((r) => r.id === rowId);
      if (row) setPeriodErrors((prev) => ({ ...prev, [rowId]: getPeriodError({ ...row, periodFrom: value }) }));
    },
    [rows, updateRow]
  );

  const handlePeriodEndChange = useCallback(
    (rowId, e) => {
      const value = e.target.value;
      updateRow(rowId, "periodTo", value);
      const row = rows.find((r) => r.id === rowId);
      if (row) setPeriodErrors((prev) => ({ ...prev, [rowId]: getPeriodError({ ...row, periodTo: value }) }));
    },
    [rows, updateRow]
  );

  /** Стоимость = Цена × Количество (только для отображения) */
  const computedCost = (row) =>
    Number(String(row.price || "").replace(/\D/g, "") || 0) *
    Number(String(row.quantity || "").replace(/\D/g, "") || 1);
  const isCostEffectivelyChanged = (row) => {
    const orig = originalRowsMap.get(row.id);
    if (!orig) return false;
    return computedCost(row) !== computedCost(orig);
  };

  const toggleRow = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
    setChangeCostModalOpen(next.size > 0);
  };

  const toggleSelectAll = () => {
    const next = new Set();
    if (selectedIds.size !== rows.length) {
      rows.forEach((r) => next.add(r.id));
    }
    setSelectedIds(next);
    setChangeCostModalOpen(next.size > 0);
  };

  const allSelected = rows.length > 0 && selectedIds.size === rows.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < rows.length;

  return (
    <div className="edit-assignments-modal" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
      <div className="edit-modal__backdrop" onClick={onClose} aria-hidden />
      <div className="edit-modal__container">
        <header className="edit-modal__header">
          <h1 id="edit-modal-title" className="edit-modal__title text-heading-1">
            Изменить задания
          </h1>
          <div className="edit-modal__header-actions">
            <Button
              variant="primary"
              disabled={changeCount === 0}
              onClick={() => onSave?.(rows, changedRowIds) ?? onClose()}
            >
              Изменить и выйти
            </Button>
            <Button variant="default">Изменить через Excel</Button>
            <Button variant="default" size="md" iconOnly icon="CloseIcon" onClick={onClose} aria-label="Закрыть" className="shrink-0" />
          </div>
        </header>

        <div className="edit-modal__scroll">
        <div className="edit-modal__summary">
          <div className="edit-modal__summary-card">
            <span className="edit-modal__summary-label text-sm-primary-normal">Всего заданий</span>
            <span className="edit-modal__summary-value text-xl-primary-strong">{totalCount}</span>
          </div>
          <div className="edit-modal__summary-card">
            <span className="edit-modal__summary-label text-sm-primary-normal">Изменено заданий</span>
            <span className="edit-modal__summary-value text-xl-primary-strong">{changedCount}</span>
          </div>
          <div className="edit-modal__summary-card">
            <span className="edit-modal__summary-label text-sm-primary-normal">Кол-во изменений</span>
            <span className="edit-modal__summary-value text-xl-primary-strong">{changeCount}</span>
          </div>
        </div>

        <section className="edit-modal__table-section">
          <Table size="default">
            <TableHeader
              columns={EDIT_MODAL_COLUMNS}
              sortKey={null}
              sortOrder="asc"
              onSort={() => {}}
              headerCheckbox={{
                checked: allSelected,
                indeterminate: someSelected,
                onChange: toggleSelectAll,
              }}
            />
            <tbody>
              {rows.map((row) => (
                <TableRow key={row.id} selected={selectedIds.has(row.id)}>
                  <TableCell type="checkbox">
                    <label className="checkbox-wrap">
                      <Checkbox
                        checked={selectedIds.has(row.id)}
                        onCheckedChange={() => toggleRow(row.id)}
                      />
                    </label>
                  </TableCell>
                  <TableCell type="item" columnKey="num" muted>
                    {row.num}
                  </TableCell>
                  <TableCell type="item" columnKey="status">
                    <Tag preset={getStatusPreset(row.status)}>{row.status || "—"}</Tag>
                  </TableCell>
                  <TableCell
                    type="item"
                    columnKey="executor"
                    className={isAnyChanged(row.id, ["executor", "phone"]) ? "edit-modal__cell--changed" : ""}
                  >
                    <div className="edit-modal__executor-wrap">
                      <Select
                        value={row.executor || row.phone ? `${row.executor}|${row.phone}` : ""}
                        onValueChange={(val) => {
                          const [executor = "", phone = ""] = (val || "").split("|");
                          setRows((prev) =>
                            prev.map((r) => (r.id !== row.id ? r : { ...r, executor, phone }))
                          );
                          setChangedCells((prev) => {
                            const next = new Set(prev);
                            const orig = originalRowsMap.get(row.id);
                            if (!orig || orig.executor !== executor) next.add(`${row.id}:executor`);
                            if (!orig || orig.phone !== phone) next.add(`${row.id}:phone`);
                            if (orig && orig.executor === executor) next.delete(`${row.id}:executor`);
                            if (orig && orig.phone === phone) next.delete(`${row.id}:phone`);
                            return next;
                          });
                        }}
                        disabled={!canEditField(row, "executor")}
                      >
                        <SelectTrigger size="md" className={modalInputClassName} aria-label="Исполнитель">
                          <SelectValue placeholder="Выберите" />
                        </SelectTrigger>
                        <SelectContent className="edit-modal__dropdown-content edit-modal__dropdown-content--executor" sideOffset={4}>
                          {(() => {
                            const currentKey = `${row.executor}|${row.phone}`;
                            const hasCurrent = executorOptions.some((o) => `${o.executor}|${o.phone}` === currentKey);
                            const opts = hasCurrent ? executorOptions : [{ executor: row.executor, phone: row.phone }, ...executorOptions];
                            return opts.map((opt) => (
                            <SelectPrimitive.Item
                              key={`${opt.executor}|${opt.phone}`}
                              value={`${opt.executor}|${opt.phone}`}
                              className="edit-modal__select-item--executor"
                            >
                              <SelectPrimitive.ItemText>{opt.executor || "—"}</SelectPrimitive.ItemText>
                              <span className="edit-modal__executor-option-phone text-sm-primary-normal">{opt.phone || ""}</span>
                            </SelectPrimitive.Item>
                            ));
                          })()}
                        </SelectContent>
                      </Select>
                      {row.phone ? (
                        <span className="edit-modal__executor-caption text-sm-primary-normal">{row.phone}</span>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell
                    type="item"
                    columnKey="period"
                    className={
                      isAnyChanged(row.id, ["periodFrom", "periodTo", "timeFrom", "timeTo"])
                        ? "edit-modal__cell--changed"
                        : ""
                    }
                  >
                    <div className="edit-modal__cell-stack edit-modal__cell-period">
                      <div className="edit-modal__cell-period-row">
                        <InputDate
                          range
                          valueStart={row.periodFrom}
                          valueEnd={row.periodTo}
                          onStartChange={(e) => handlePeriodStartChange(row.id, e)}
                          onEndChange={(e) => handlePeriodEndChange(row.id, e)}
                          onBlur={() => validatePeriodBlur(row.id)}
                          status={periodErrors[row.id] ? "error" : "default"}
                          caption={periodErrors[row.id] ? PERIOD_ERROR_MESSAGES[periodErrors[row.id]] : undefined}
                          className={modalInputClassName}
                          aria-label="Период"
                          disabled={!canEditField(row, "period")}
                        />
                      </div>
                      <div className="edit-modal__cell-period-row">
                        <InputTime
                          range
                          valueStart={row.timeFrom}
                          valueEnd={row.timeTo}
                          onStartChange={(e) => updateRow(row.id, "timeFrom", e.target.value)}
                          onEndChange={(e) => updateRow(row.id, "timeTo", e.target.value)}
                          aria-label="Период времени"
                          disabled={!canEditField(row, "period")}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell
                    type="item"
                    columnKey="service"
                    className={isCellChanged(row.id, "service") ? "edit-modal__cell--changed" : ""}
                  >
                    <div className="edit-modal__select-wrap">
                      <Select
                        value={row.service || ""}
                        onValueChange={(val) => updateRow(row.id, "service", val)}
                        disabled={!canEditField(row, "service")}
                      >
                        <SelectTrigger size="md" className={modalInputClassName} aria-label="Услуга">
                          <SelectValue placeholder="Выберите" />
                        </SelectTrigger>
                        <SelectContent className="edit-modal__dropdown-content" sideOffset={4}>
                          {SERVICE_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell
                    type="item"
                    columnKey="price"
                    className={isCellChanged(row.id, "price") ? "edit-modal__cell--changed" : ""}
                  >
                    <InputBasic
                      className={modalInputClassName}
                      value={formatThousands(row.price)}
                      onChange={(e) =>
                        updateRow(row.id, "price", e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="0"
                      suffix="₽"
                      disabled={!canEditField(row, "price")}
                    />
                  </TableCell>
                  <TableCell
                    type="item"
                    columnKey="unit"
                    className={isCellChanged(row.id, "unit") ? "edit-modal__cell--changed" : ""}
                  >
                    <div className="edit-modal__select-wrap">
                      <Select
                        value={row.unit || ""}
                        onValueChange={(val) => updateRow(row.id, "unit", val)}
                        disabled={!canEditField(row, "unit")}
                      >
                        <SelectTrigger size="md" className={modalInputClassName} aria-label="Единица">
                          <SelectValue placeholder="Выберите" />
                        </SelectTrigger>
                        <SelectContent className="edit-modal__dropdown-content" sideOffset={4}>
                          {UNIT_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell
                    type="item"
                    columnKey="quantity"
                    className={isCellChanged(row.id, "quantity") ? "edit-modal__cell--changed" : ""}
                  >
                    <InputBasic
                      className={modalInputClassName}
                      type="text"
                      inputMode="numeric"
                      value={row.quantity}
                      onChange={(e) => updateRow(row.id, "quantity", e.target.value)}
                      placeholder="0"
                      disabled={!canEditField(row, "quantity")}
                    />
                  </TableCell>
                  <TableCell
                    type="item"
                    columnKey="title"
                    className={isCellChanged(row.id, "title") ? "edit-modal__cell--changed" : ""}
                  >
                    <Textarea
                      className={modalInputClassName}
                      value={row.title}
                      onChange={(e) => updateRow(row.id, "title", e.target.value)}
                      placeholder="Название задания"
                      rows={2}
                      maxHeight={80}
                      disabled={!canEditField(row, "title")}
                    />
                  </TableCell>
                  <TableCell
                    type="item"
                    columnKey="cost"
                    className={isCostEffectivelyChanged(row) ? "edit-modal__cell--changed" : ""}
                  >
                    <InputBasic
                      className={modalInputClassName}
                      value={formatThousands(computedCost(row))}
                      placeholder="0"
                      suffix="₽"
                      disabled
                    />
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </section>
        </div>
      </div>

      {changeCostModalOpen && selectedIds.size > 0 && (() => {
        const firstSelected = rows.find((r) => selectedIds.has(r.id));
        const initialPrice = firstSelected ? String(firstSelected.price || "").replace(/\s/g, "") : "";
        const initialQuantity = firstSelected ? String(firstSelected.quantity || "1") : "1";
        return (
          <ChangeCostModal
            initialPrice={initialPrice}
            initialQuantity={initialQuantity}
            onClose={() => {
              setChangeCostModalOpen(false);
              setSelectedIds(new Set());
            }}
            onSave={(data) => {
              setChangeCostModalOpen(false);
              if (data && selectedIds.size > 0) {
                const priceStr = String(data.price || "").replace(/\D/g, "");
                const quantityStr = String(data.quantity ?? 1);
                setRows((prev) =>
                  prev.map((r) => {
                    if (!selectedIds.has(r.id)) return r;
                    return { ...r, price: priceStr, quantity: quantityStr };
                  })
                );
                setChangedCells((prev) => {
                  const next = new Set(prev);
                  selectedIds.forEach((id) => {
                    next.add(`${id}:price`);
                    next.add(`${id}:quantity`);
                    next.add(`${id}:cost`);
                  });
                  return next;
                });
              }
            }}
          />
        );
      })()}
    </div>
  );
}

export default EditAssignmentsModal;
