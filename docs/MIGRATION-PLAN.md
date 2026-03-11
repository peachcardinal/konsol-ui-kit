# План миграции: один src, удаление storybook-src

**Цель:** весь UI и логика живут в `src/`; папка `storybook-src` (reference) удаляется. Новый код из reference заменяет и дополняет текущие компоненты.

**Критерий «готовности к удалению storybook-src»:** ни один файл в проекте не импортирует из `storybook-src`, а все нужные для приложения компоненты и утилиты перенесены в `src/`.

---

## Текущее состояние

| Где сейчас | Что есть в проекте | Что есть в storybook-src |
|------------|--------------------|---------------------------|
| **src/** | Sidebar, NavButton, ActionsPanel, Table, Checkbox, Tag, Toast, FormItem, Input (поиск), InputBasic, InputDate, InputTime, InputTextarea, InputSelect, Segment, Radio, Icon | Всё то же + расширенные варианты и ещё ~40 компонентов |
| **src/ui/** | Button ✅, Input ✅, Typography (минимальный), Spinner, Icon ✅, lib/utils, Tailwind | — |

**Уже перенесено в src/ui:** Button, Input (вместе с InputPassword, InputSearch, InputTitle, InputLink), минимальный Typography, Spinner, Icon (единый каталог из storybook-src), cn.  
**Ещё не перенесено:** большая часть UI (Select, Checkbox, Radio, Table, Dialog, DatePicker, Tag, Segment и т.д.).

---

## Стратегия: поэтапно по слоям

Миграцию делаем **слоями по зависимостям**: сначала фундамент и примитивы, потом то, что от них зависит. В каждом шаге: **переносим в src/ui → переключаем использование в приложении → при необходимости убираем дубликаты из src/components**.

### Фаза 0. Фундамент ✅ (завершена)

- [x] `lib/utils.ts` (cn и др.)
- [x] Tailwind + токены (colors, shadow, font)
- [x] Иконки: единый каталог src/ui/Icon (из storybook-src, SVG через ?react)
- [x] Минимальный Typography (для Input и т.д.)
- [x] Токены из reference не копируем — используем палитру проекта (`public/css/colors.css`), в Tailwind добавлены маппинги (background, foreground, destructive, hover-input-primary, positive, warning, boxShadow focus/error). Импортов из storybook-src в проекте нет.

**Состав фундамента (один набор стилей и утилит):**

| Что | Где |
|-----|-----|
| Утилита `cn` | `src/lib/utils.ts` |
| Tailwind | `tailwind.config.js`, `postcss.config.cjs`, `src/ui/ui.css` (подключается в `main.jsx`) |
| Цвета/шрифты | `public/css/colors.css`, `public/css/fonts.css`, `public/css/tokens.css` (подключаются в `index.html`) |
| Иконки | `src/ui/Icon` (PascalCase+Icon, SVG из storybook-src через ?react; обратная совместимость snake_case) |
| Typography (минимальный) | `src/ui/Typography.jsx` |
| Spinner | `src/ui/Spinner.jsx` |
| Button / Input | `src/ui/Button`, `src/ui/Input` |

**Результат фазы:** один набор стилей и утилит, без зависимости от storybook-src в стилях.

---

### Фаза 1. Базовые UI-примитивы ✅ (завершена)

Переносим в **src/ui/** только то, что нужно для следующих фаз и для экранов.

| Компонент | В reference | Действие | Зависимости |
|-----------|-------------|----------|-------------|
| **Card** | ui/card | ✅ Перенесён в src/ui/Card | cn |
| **Divider** | ui/divider | ✅ Перенесён в src/ui/Divider | cn |
| **Link** | ui/link | ✅ Перенесён в src/ui/Link | Slot, cn, Icon |
| **Spinner** | — | Уже в src/ui | — |
| **Button** | — | Уже в src/ui | — |
| **Input** | — | Уже в src/ui | Typography, Icon, Button |

Добавлен токен `card-fill-tertiary` в tailwind.config.js (для Card variant="gray"). В проекте пока нет использования Card/Divider/Link из components/ — при появлении заменить на `src/ui/Card`, `src/ui/Divider`, `src/ui/Link`.

---

### Фаза 2. Формы и выбор ✅ (завершена)

По текущим страницам используются: **Input (поиск), InputBasic, InputDate, InputTime, InputTextarea, InputSelect, FormItem, Checkbox, Radio, Segment**.

| Компонент | Сейчас в проекте | В reference | Статус |
|-----------|-------------------|-------------|--------|
| Input (поиск) | ui/Input (InputSearch) | ui/input (InputSearch) | ✅ Используется на ComponentsPage |
| InputBasic | components/Input/InputBasic | ui/input | Оставить; при необходимости позже — обёртка поверх ui/Input |
| InputDate / InputTime | components/Input/* | ui/date-picker, time-picker | Оставить; фаза 4 при замене |
| InputTextarea | **ui/Textarea** | ui/textarea | ✅ Перенесён; заменён в EditAssignmentsModal, ComponentsPage |
| InputSelect | components/Input/InputSelect | ui/select | ui/Select добавлен; InputSelect пока из components (другой API) |
| FormItem / InputLabel | components/FormItem, InputLabel | (Figma Form Item) | Оставить как есть |
| **Checkbox** | **ui/Checkbox** | ui/checkbox | ✅ Перенесён; заменён в Table, AssignmentsPage, EditAssignmentsModal, ComponentsPage |
| **Radio** | **ui/Radio** + RadioGroup | ui/radio | ✅ Перенесён; заменён на ComponentsPage |
| **Segment** | **ui/Segments** (SegmentItem, Segments, SingleSegment) | ui/segments | ✅ Перенесён; заменён на ComponentsPage |

**Сделано в фазу 2:** установлены @radix-ui/react-checkbox, @radix-ui/react-radio-group, @radix-ui/react-toggle-group, @radix-ui/react-select. Добавлены в src/ui: Checkbox, Radio (+ RadioGroup), Segments (+ SegmentItem, SingleSegment), Textarea, Select (SelectTrigger, SelectContent, SelectItem, SelectValue, MultiSelect и др.). В tailwind: primary-10, input, popover, input-disabled-background. Иконка DoneIcon в src/ui/Icon. Замены: Table → ui/Checkbox; AssignmentsPage, EditAssignmentsModal → ui/Checkbox, ui/Textarea; ComponentsPage → ui/InputSearch, ui/Textarea, ui/Checkbox, ui/Segments, ui/Radio.

**Результат фазы 2:** формы и выбор на экранах используют src/ui (Checkbox, Radio, Segments, Textarea, InputSearch). InputSelect и InputBasic/InputDate/InputTime пока из components; старые Checkbox, Segment, Radio в components/ можно позже удалить или оставить как обёртки.

---

### Фаза 3. Оверлеи и навигация ✅ (завершена)

| Компонент | В reference | Статус |
|-----------|-------------|--------|
| **Popover** | ui/popover | ✅ Перенесён в src/ui/Popover (Root, Trigger, Content, Anchor) |
| **Tooltip** | ui/tooltip | ✅ Перенесён в src/ui/Tooltip (Provider, Root, Trigger, Content) |
| **Dialog** | ui/dialog (primitive) | ✅ Перенесён в src/ui/Dialog (Root, Portal, Trigger, Overlay, Content, Title, Description, Close, Header, Footer) |
| **Modal** | ui/modal | ✅ Перенесён в src/ui/Modal (Root, Trigger, Content, Title, Close, Portal, Overlay) |
| **Dropdown** | ui/dropdown | ✅ Перенесён в src/ui/Dropdown (Root, Trigger, Content, Item, Label, Separator) |

**Сделано:** установлены @radix-ui/react-popover, @radix-ui/react-tooltip, @radix-ui/react-dialog. Добавлены токены: spotlight-background, primary-foreground, hover-background. DialogBase (teleporter) не перенесён — используется упрощённый Dialog + Modal.

После фазы 3: модалки и выпадающие меню можно строить из src/ui.

---

### Фаза 4. Сложные составные компоненты ✅ (частично завершена)

Переносим по мере необходимости (используются на экранах или точно будут в ближайших фичах).

| Компонент | В reference | Статус |
|-----------|-------------|--------|
| **Tag** | ui/tag | ✅ Перенесён в src/ui/Tag; заменён на AssignmentsPage, EditAssignmentsModal, ComponentsPage |
| **Pagination** | ui/pagination | ✅ Перенесён в src/ui/Pagination (без showQuickJumper / InputNumber) |
| **Alert** | ui/alert | ✅ Перенесён в src/ui/Alert |
| **Tabs** | ui/tabs | ✅ Перенесён в src/ui/Tabs (TabsList, TabsTrigger, TabsContent) |
| **Select** (полный) | ui/select | Уже в src/ui/Select (фаза 2) |
| **DatePicker** | ui/date-picker | Оставить InputDate; перенос при замене |
| **Calendar** | ui/calendar | Для DatePicker |
| **Table** | ui/table | Оставить текущую Table; перенос при замене |
| **Banner** | ui/banner | ✅ Перенесён в src/ui/Banner (изображения в src/assets/images) |
| **Avatar** | ui/avatar | ✅ Перенесён в src/ui/Avatar |
| **Switch** | ui/switch | ✅ Перенесён в src/ui/Switch |

**Сделано:** @radix-ui/react-tabs, иконки CheckCircleFillIcon, CancelFillIcon, InfoFillIcon в src/ui/Icon; токены border-primary, border-tabs, switch-background в tailwind.

---

### Фаза 5. Специализированные ✅ (частично завершена)

| Компонент | В reference | Статус |
|-----------|-------------|--------|
| **Progress** | ui/progress | ✅ Перенесён в src/ui/Progress |
| **ScrollArea** | ui/scroll-area | ✅ Перенесён в src/ui/ScrollArea (ScrollArea, ScrollBar) |
| **Stepper** | ui/stepper | ✅ Перенесён в src/ui/Stepper |
| **Accordion** | ui/accordion | ✅ Перенесён в src/ui/Accordion (Root, Item, Trigger, Content) |
| PhoneInput | ui/phone-input | По необходимости |
| MaskedInput | ui/masked-input | По необходимости |
| Toaster / toast | ui/toaster | sonner — по необходимости |
| Combobox | ui/combobox* | По необходимости |
| Schedule-calendar | ui/schedule-calendar | По необходимости |
| Carousel | ui/carousel | По необходимости |
| OTP Input | ui/otp-input | По необходимости (зависит от Input, Link) |
| Uploader | ui/uploader | По необходимости |
| Timeline | ui/timeline | По необходимости |
| Command | ui/command | cmdk — по необходимости |

**Сделано:** @radix-ui/react-progress, @radix-ui/react-scroll-area, @radix-ui/react-accordion.

---

### Фаза 6. Иконки и каталог ✅ (завершена, Вариант B)

- **Сделано:** перенесены из storybook-src `components/icon` (icons.ts + assets) в `src/ui/Icon`.
- **Удалено:** IconAdapter, icon-name-map. Единый каталог — `src/ui/Icon` (icons.jsx + Icon.jsx, SVG через `?react`).
- **Обратная совместимость:** Icon принимает `icon` (Storybook: "CloseIcon") и `name` (snake_case: "close"), маппинг встроен.

---

## Порядок работ (практический)

1. **Фаза 0** — проверить, что стили/токены из reference при необходимости дописаны в проект; storybook-src не используется в сборке.
2. **Фаза 1** — Card, Divider, Link в src/ui (если нужны).
3. **Фаза 2** — по приоритету использования:
   - Checkbox, Radio, Segment → src/ui; заменить на страницах.
   - Textarea, Select → src/ui; заменить использование.
   - Input: перевести все использования на ui/Input (и InputSearch и т.д.).
4. **Фаза 3** — Popover, Tooltip, Dialog, Dropdown в src/ui.
5. **Фаза 4** — по мере надобности: Tag, Table, DatePicker, Calendar и т.д.
6. **Фаза 5** — только при появлении фич (PhoneInput, Toaster, Combobox и т.д.).
7. **Удаление дубликатов** — после перевода экранов на ui/* удалить или пометить устаревшими старые компоненты в `src/components/`.
8. **Удаление storybook-src** — когда:
   - нет импортов из `storybook-src` ни в коде, ни в конфигах;
   - все нужные для приложения компоненты и стили есть в `src/`.

---

## Перенос reference в src ✅ (завершён)

- **src/reference** — полная копия storybook-src (Avatar, Banner, Switch, Calendar, Table, Combobox, icon-banks, icon-documents и др.)
- **src/assets/images/** — изображения для Banner (alfa.png, tbank.png, doc.png и др.)
- **src/ui/IconBanks**, **src/ui/IconDocuments** — папки иконок банков и документов
- Алиас `@` → `src/reference` для импортов из reference (см. src/reference/README.md)

После переноса папку `storybook-src` можно удалить — всё содержимое теперь в `src/reference` и `src/assets`.

---

## Кратко

- **План:** поэтапная миграция по слоям (фонд → примитивы → формы → оверлеи → сложные → специализированные), с заменой использования и последующей очисткой дубликатов.
- **Цель:** один src, который заменил и дополнил текущий код; reference (storybook-src) удалён.
- **Компонентов много** — не переносим всё подряд: сначала то, что используется или точно понадобится; остальное по мере появления задач.

Если нужно, следующий шаг можно расписать в виде конкретных задач (например: «перенести Select в src/ui и заменить на AssignmentsPage и ComponentsPage»).
