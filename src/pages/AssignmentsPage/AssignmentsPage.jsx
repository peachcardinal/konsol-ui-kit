import { useState, Fragment } from "react";
import { Sidebar } from "../../ui/sidebar";
import { ActionsPanel } from "../../ui/actions-panel";
import { NavButton } from "../../ui/nav-button";
import { Button } from "../../ui/button";
import { InputSearch } from "../../ui/Input";
import { Table, TableHeader, TableRow, TableCell } from "../../ui/table";
import { Checkbox } from "../../ui/checkbox";
import { Tag } from "../../ui/Tag";
import { ToastAuto } from "../../ui/toast";
import { EditAssignmentsModal } from "../../ui/EditAssignmentsModal";
import { formatISODateToDisplay } from "../../ui/Input";
import "./AssignmentsPage.css";

const NAV_TOP = ["Приглашения", "Исполнители"];
const NAV_TASK_SUBITEMS = [
  "Акты",
  "Пачки актов",
  "Документы",
  "Справочник",
  "Уведомления в МВД",
  "Информатор",
  "Вопросы и ответы",
];

const TABLE_COLUMNS = [
  { key: "check", label: "", sortable: false, type: "checkbox" },
  { key: "num", label: "№", sortable: true, type: "item" },
  { key: "executor", label: "Исполнитель", sortable: true, type: "item" },
  { key: "title", label: "Название", sortable: true, type: "item" },
  { key: "project", label: "Проект", sortable: true, type: "item" },
  { key: "service", label: "Услуга", sortable: true, type: "item" },
  { key: "period", label: "Период", sortable: true, type: "item" },
  { key: "sum", label: "Сумма", sortable: false, type: "item" },
  { key: "status", label: "Статус", sortable: true, type: "item" },
  { key: "actions", label: "", sortable: false, type: "empty" },
];

const PERIOD = "14 мар. — 21 мар.";

const MOCK_TASKS = [
  { id: "1", num: "284719", executor: "Иванов Иван", phone: "+7 (999) 123-45-67", title: "Задание по договору №1", project: "Проект А", service: "Доставка документов", period: PERIOD, periodTime: null, sum: "10 500 ₽", status: "Предложено" },
  { id: "2", num: "591032", executor: "Петров Пётр", phone: "+7 (999) 234-56-78", title: "Задание по договору №2", project: "Проект Б", service: "Курьерская доставка", period: PERIOD, periodTime: null, sum: "15 032 ₽", status: "Черновик" },
  { id: "3", num: "107846", executor: "Сидоров Сергей", phone: "+7 (999) 345-67-89", title: "Задание по договору №3", project: "Проект А", service: "Экспресс-доставка", period: PERIOD, periodTime: null, sum: "8 200 ₽", status: "Предложено" },
  { id: "4", num: "663291", executor: "Козлов Кирилл", phone: "+7 (999) 456-78-90", title: "Задание по договору №4", project: "Проект В", service: "Доставка документов", period: PERIOD, periodTime: null, sum: "22 100 ₽", status: "Черновик" },
  { id: "5", num: "418573", executor: "Новиков Николай", phone: "+7 (999) 567-89-01", title: "Задание по договору №5", project: "Проект Б", service: "Курьерская доставка", period: PERIOD, periodTime: null, sum: "12 400 ₽", status: "Предложено" },
  { id: "6", num: "925104", executor: "Морозов Михаил", phone: "+7 (999) 678-90-12", title: "Задание по договору №6", project: "Проект А", service: "Экспресс-доставка", period: PERIOD, periodTime: null, sum: "18 750 ₽", status: "Черновик" },
  { id: "7", num: "340628", executor: "Волков Владимир", phone: "+7 (999) 789-01-23", title: "Задание по договору №7", project: "Проект В", service: "Доставка документов", period: PERIOD, periodTime: null, sum: "9 600 ₽", status: "Предложено" },
  { id: "8", num: "756813", executor: "Соколов Степан", phone: "+7 (999) 890-12-34", title: "Задание по договору №8", project: "Проект Б", service: "Курьерская доставка", period: PERIOD, periodTime: null, sum: "14 300 ₽", status: "Предложено" },
  { id: "9", num: "192465", executor: "Лебедев Леонид", phone: "+7 (999) 901-23-45", title: "Задание по договору №9", project: "Проект А", service: "Экспресс-доставка", period: PERIOD, periodTime: null, sum: "11 200 ₽", status: "Черновик" },
  { id: "10", num: "539847", executor: "Кузнецов Константин", phone: "+7 (999) 012-34-56", title: "Задание по договору №10", project: "Проект В", service: "Доставка документов", period: PERIOD, periodTime: null, sum: "16 800 ₽", status: "Черновик" },
];

const SORTABLE_KEYS = ["num", "executor", "title", "project", "service", "period", "status"];

/** Цвета Tag для статусов в таблице заданий */
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

function sortTasks(tasks, sortKey, sortOrder) {
  if (!sortKey || !SORTABLE_KEYS.includes(sortKey)) return tasks;
  const dir = sortOrder === "asc" ? 1 : -1;
  return [...tasks].sort((a, b) => {
    const va = a[sortKey] ?? "";
    const vb = b[sortKey] ?? "";
    if (typeof va === "string" && typeof vb === "string") return dir * (va.localeCompare(vb, "ru") || 0);
    return dir * (Number(va) - Number(vb));
  });
}

/** Преобразует строку из модалки редактирования обратно в задание для таблицы */
function rowToTask(row) {
  const orig = row._original || {};
  const period =
    row.periodFrom || row.periodTo
      ? [formatISODateToDisplay(row.periodFrom), formatISODateToDisplay(row.periodTo)].filter(Boolean).join(" — ")
      : orig.period ?? "";
  const periodTime =
    row.timeFrom || row.timeTo
      ? [row.timeFrom, row.timeTo].filter(Boolean).join(" → ")
      : orig.periodTime ?? null;
  const priceNum = Number(String(row.price ?? "").replace(/\D/g, "") || 0);
  const qtyNum = Number(String(row.quantity ?? "").replace(/\D/g, "") || 1);
  const computedCost = priceNum * qtyNum;
  const sum =
    computedCost > 0
      ? `${computedCost.toLocaleString("ru-RU")} ₽`
      : orig.sum;
  const priceDigits = String(row.price ?? "").replace(/\D/g, "");
  const priceFormatted =
    priceDigits && Number(priceDigits) > 0
      ? `${Number(priceDigits).toLocaleString("ru-RU")} ₽`
      : orig.price ?? orig.sum;
  return {
    ...orig,
    id: row.id,
    num: row.num ?? orig.num,
    executor: row.executor ?? orig.executor,
    phone: row.phone ?? orig.phone,
    service: row.service ?? orig.service,
    sum,
    title: row.title ?? orig.title,
    price: priceFormatted,
    period,
    periodTime: periodTime || null,
  };
}

export default function AssignmentsPage() {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [recentlyChangedIds, setRecentlyChangedIds] = useState(new Set());

  const handleSort = (key) => {
    if (sortKey === key) setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedTasks = sortTasks(tasks, sortKey, sortOrder);

  const toggleRow = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    const allSelected = selectedIds.size === tasks.length;
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(tasks.map((t) => t.id)));
  };

  const selectedCount = selectedIds.size;
  const selectedSum = tasks.filter((t) => selectedIds.has(t.id)).reduce(
    (acc, t) => acc + (parseInt(t.sum.replace(/\s|₽/g, ""), 10) || 0),
    0
  );

  const totalTasksCount = tasks.length;
  const totalTasksSum = tasks.reduce(
    (acc, t) => acc + (parseInt(t.sum.replace(/\s|₽/g, ""), 10) || 0),
    0
  );

  const allSelected = selectedIds.size === totalTasksCount && totalTasksCount > 0;
  const someSelected = selectedIds.size > 0 && !allSelected;

  return (
    <div className="assignments-page">
      <Sidebar>
        {NAV_TOP.map((label) => (
          <NavButton key={label}>{label}</NavButton>
        ))}
        <NavButton key="Задания" active>Задания</NavButton>
        <NavButton key="Пачки заданий">Пачки заданий</NavButton>
        {NAV_TASK_SUBITEMS.map((label) => (
          <Fragment key={label}>
            <NavButton>{label}</NavButton>
            {label === "Уведомления в МВД" && <div className="sidebar__nav-divider" />}
          </Fragment>
        ))}
      </Sidebar>

      <main className="assignments-main">
        <header className="header-navigation">
          <h1 className="header-navigation__title text-heading-1">Задания</h1>
          <div className="header-navigation__actions">
            <Button variant="default" icon="DownloadIcon" iconPosition="start">
              Загрузить реестр
            </Button>
            <Button variant="primary" icon="AddIcon" iconPosition="start">
              Создать задание
            </Button>
          </div>
        </header>

        <div
          className={`assignments-content ${selectedCount > 0 ? "assignments-content--with-actions-panel" : ""}`}
        >
          <div className="assignments-filters">
            <div className="assignments-filters__left">
              <InputSearch className="assignments-search" placeholder="ФИО, ИНН или телефон" />
              <Button variant="text" icon="FilterIcon" iconPosition="start">
                Фильтры
              </Button>
            </div>
            <div className="assignments-filters-toolbar">
              <Button variant="default" icon="WorkIcon" iconPosition="start">
                Проекты
              </Button>
              <Button variant="text" iconOnly icon="FullScreenIcon" aria-label="Вид" />
              <Button variant="text" iconOnly icon="UploadIcon" aria-label="Загрузить" />
              <Button variant="text" iconOnly icon="SettingsIcon" aria-label="Настройки" />
            </div>
          </div>

          <p className="assignments-summary text-lg-primary-normal">
            {totalTasksCount} заданий на {totalTasksSum.toLocaleString("ru-RU")} ₽
          </p>

          <section className="assignments-table-section">
            <Table>
              <TableHeader
                columns={TABLE_COLUMNS}
                sortKey={sortKey}
                sortOrder={sortOrder}
                onSort={handleSort}
                headerCheckbox={{
                  checked: allSelected,
                  indeterminate: someSelected,
                  onChange: toggleSelectAll,
                }}
              />
              <tbody>
                {sortedTasks.map((task) => (
                  <TableRow key={task.id} selected={selectedIds.has(task.id)} recentlyChanged={recentlyChangedIds.has(task.id)}>
                    <TableCell type="checkbox">
                      <label className="checkbox-wrap">
                        <Checkbox
                          checked={selectedIds.has(task.id)}
                          onCheckedChange={() => toggleRow(task.id)}
                        />
                      </label>
                    </TableCell>
                    <TableCell type="item" columnKey="num" muted>{task.num}</TableCell>
                    <TableCell type="item" columnKey="executor">
                      <div className="table-cell__stacked">
                        <span className="text-base-primary-normal">{task.executor}</span>
                        <span className="text-sm-primary-normal assignments-cell-secondary">{task.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell type="item" columnKey="title">{task.title}</TableCell>
                    <TableCell type="item" columnKey="project" muted>{task.project}</TableCell>
                    <TableCell type="item" columnKey="service">{task.service}</TableCell>
                    <TableCell type="item" columnKey="period">
                      {task.periodTime ? (
                        <div className="table-cell__stacked">
                          <span className="text-base-primary-normal">{task.period}</span>
                          <span className="text-sm-primary-normal assignments-cell-secondary">{task.periodTime}</span>
                        </div>
                      ) : (
                        task.period
                      )}
                    </TableCell>
                    <TableCell type="item" columnKey="sum">{task.sum}</TableCell>
                    <TableCell type="item" columnKey="status">
                      <Tag preset={getStatusPreset(task.status)}>{task.status}</Tag>
                    </TableCell>
                    <TableCell type="empty">
                      <Button variant="text" iconOnly icon="MoreVertIcon" aria-label="Действия" />
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </section>
        </div>

        {selectedCount > 0 && (
          <div className="assignments-page__bottom-panel">
            <ActionsPanel
              summary={{
                text: `${selectedCount} заданий`,
                sum: `${selectedSum.toLocaleString("ru-RU")} ₽`,
                onClose: () => {
                  setSelectedIds(new Set());
                },
              }}
              rightSlot={
                <Button variant="default" onClick={toggleSelectAll}>
                  Выбрать все
                </Button>
              }
            >
              <Button variant="primary">Отправить</Button>
              <Button variant="default">Завершить</Button>
              <Button variant="default" icon="ArrowDownIcon" iconPosition="end">Создать акт</Button>
              <Button
                variant="text"
                iconOnly
                icon="EditIcon"
                aria-label="Изменить"
                onClick={() => setEditModalOpen(true)}
              />
              <Button variant="text" iconOnly icon="MoreVertIcon" aria-label="Ещё" />
            </ActionsPanel>
          </div>
        )}

        {editModalOpen && (
          <EditAssignmentsModal
            tasks={
              selectedCount > 0
                ? sortedTasks.filter((t) => selectedIds.has(t.id))
                : sortedTasks
            }
            onClose={() => setEditModalOpen(false)}
            onSave={(rows, changedRowIds = new Set()) => {
              setTasks((prev) =>
                prev.map((t) => {
                  const row = rows.find((r) => r.id === t.id);
                  return row ? rowToTask(row) : t;
                })
              );
              setEditModalOpen(false);
              setSelectedIds(new Set());
              setToastMessage(`Изменили ${changedRowIds.size} заданий`);
              setRecentlyChangedIds(new Set(changedRowIds));
            }}
          />
        )}

        {toastMessage && (
          <ToastAuto
            type="success"
            message={toastMessage}
            duration={3000}
            onDone={() => {
              setToastMessage(null);
              setRecentlyChangedIds(new Set());
            }}
          />
        )}
      </main>
    </div>
  );
}
