# Статус рефактора UI (lowercase kebab-case, плоские файлы)

## Сделано

Следующие компоненты вынесены из папок в **одиночные файлы** в `src/ui/` (lowercase kebab-case). Импорты по проекту обновлены на новые пути. **Сборка проходит.**

| Было (папка)     | Стало (файл)        |
|------------------|---------------------|
| Button/          | `button.tsx`        |
| Alert/           | `alert.tsx`         |
| Accordion/       | `accordion.tsx`     |
| Banner/          | `banner.tsx`       |
| Pagination/      | `pagination.tsx`   |
| Card/            | `card.tsx`         |
| ActionsPanel/    | `actions-panel.tsx` + `actions-panel.css` |
| Toast/           | `toast.tsx` + `toast.css` |
| FormItem/         | `form-item.tsx` + `form-item.css` |
| InputLabel/      | `input-label.tsx` + `input-label.css` |

**Импорты:** везде используются новые пути, например:
- `import { Button } from "../../ui/button"`
- `import { Alert } from "../../ui/alert"`
- `import { FormItem } from "../../ui/form-item"`
- и т.д.

## Что можно удалить (старые папки)

После проверки, что ничего не импортирует старые пути, можно удалить папки и их содержимое:

- `src/ui/Button/` (Button.jsx, index.js)
- `src/ui/Alert/` (Alert.jsx, index.js)
- `src/ui/Accordion/` (Accordion.jsx, index.js)
- `src/ui/Banner/` (Banner.jsx, index.js)
- `src/ui/Pagination/` (Pagination.jsx, index.js)
- `src/ui/Card/` (Card.jsx, index.js)
- `src/ui/ActionsPanel/` (ActionsPanel.jsx, ActionsPanel.css, index.js)
- `src/ui/Toast/` (Toast.jsx, Toast.css, index.js)
- `src/ui/FormItem/` (FormItem.jsx, FormItem.css, index.js)
- `src/ui/InputLabel/` (InputLabel.jsx, InputLabel.css, index.js)

Перед удалением можно выполнить поиск по проекту по путям вида `ui/Alert`, `ui/Button` и т.п. — не должно быть совпадений.

## Оставлены папками (сложные или не перенесённые)

- **Icon/** — много SVG, icons.jsx, каталог
- **Input/** — несколько подкомпонентов (InputBasic, InputSearch, InputDate, InputTime и т.д.)
- **table/** — много модулей (table.tsx, table-body, table-header, Table/ и т.д.)
- **schedule-calendar/**, **combobox-primitive/**, **combobox-base/**, **combobox-multiselect/**, **date-range-picker/**, **phone-input/** — сложные
- **Dialog/**, **Modal/**, **SideModal/**, **NavButton/**, **Sidebar/**, **Select/**, **Checkbox/**, **Radio/**, **Tag/**, **Tabs/**, **Dropdown/**, **Divider/**, **Link/**, **Tooltip/**, **Popover/**, **ScrollArea/**, **Segments/**, **Stepper/**, **Switch/**, **Progress/**, **Avatar/**, **Spinner.jsx**, **Typography.jsx**, **Uploader/**, **Calendar/**, **DatePicker/**, **TimePicker/**, **TimeRangePicker/**, **Timeline/**, **Toaster/**, **MaskedInput/**, **OtpInput/**, **InputNumber/**, **Autocomplete/**, **Command/**, **Carousel/**, **CustomizableCarousel/**, **ChangeCostModal/**, **EditAssignmentsModal/** — пока без изменений

Их при необходимости можно позже либо вынести в плоские файлы (если простые), либо переименовать папки в kebab-case (например `Icon` → `icon`) и оставить точку входа `index.tsx`/`index.js`.

## Рекомендации при передаче проекта

1. Удалить перечисленные выше старые папки после финальной проверки импортов.
2. Для остальных компонентов при продолжении рефактора: простые (один основной файл + index) → `src/ui/<kebab-name>.tsx`; сложные → папка в kebab-case с `index.tsx` внутри.
3. В `registry.ts` пути уже приведены к плоским именам для Button, ActionsPanel, InputLabel, FormItem, Toast; при переносе остальных — обновлять и там.
