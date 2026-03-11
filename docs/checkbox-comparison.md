# Checkbox: проект vs Storybook / Figma

## Спецификация компонента (актуальная, для будущего)

Текущая реализация `Checkbox` / `CheckboxWithLabel` в `src/components/Checkbox/`.

### Размеры

| Size     | Бокс (внешний) | border-radius | Иконка галочки `.checkbox__mark` |
|----------|-----------------|---------------|-----------------------------------|
| default  | 16×16 px        | 4 px          | 16×16 px                          |
| large    | 24×24 px        | 6 px          | 24×24 px                          |

Gap до лейбла в `CheckboxWithLabel`: **10 px**.

### Состояния

- **Inactive (unchecked):** фон `--color-fill-alter`, обводка `--color-border`. Hover: обводка `--color-primary-border`. Active: обводка `--color-primary-active`.
- **Checked:** фон и обводка `--color-primary-base`. Hover: `--color-primary-hover`. Active: `--color-primary-active`. Внутри — SVG галочка (`.checkbox__mark`), цвет `--color-text-light-solid`. Размер иконки задаётся в CSS (16×16 / 24×24), у SVG только `viewBox="0 0 16 16"`.
- **Indeterminate:** белый бокс с обводкой (фон `--color-bg-container`, обводка `--color-border`). Внутри — элемент `.checkbox__indeterminate-inner`:
  - **default:** 8×8 px, `border-radius: 2px`, фон `--color-primary-base`.
  - **large:** высота 12 px, ширина 100%, `border-radius: 2px`, фон `--color-primary-base`.
  - Hover/active меняют только обводку внешнего бокса (`--color-primary-border` / `--color-primary-active`).
- **Disabled:** один класс `.checkbox--disabled` для всех статусов: фон `--color-bg-container-disabled`, обводка `--color-border-secondary`, `opacity: 0.4`, cursor default.

### Доступность и разметка

- Скрытый нативный `<input type="checkbox">`, `ref` для `indeterminate`. Фокус: `box-shadow` + `--control-outline`, обводка `--color-primary-border`.
- С лейблом: `CheckboxWithLabel`, лейбл Graphik 14px / line-height 20px, цвет `--color-text`.

### Классы (BEM-подобные)

- `.checkbox`, `.checkbox--checked`, `.checkbox--indeterminate`, `.checkbox--disabled`, `.checkbox--large`
- `.checkbox__mark` (SVG галочка), `.checkbox__indeterminate-inner` (внутренний квадрат в indeterminate)
- `.checkbox-wrap`, `.checkbox-wrap__label`, `.checkbox-wrap--disabled`, `.checkbox-wrap--large`

---

## Спецификация из Figma (Konsol UI — Ant Design 5.0)

Компонент **\*SelectionControl\* / Check** — Component Set с вариантами:

| Свойство | Варианты |
|----------|----------|
| **Status** | Inactive, Active, Indeterminate |
| **State** | Default, Hovered, Focused, Pressed, Disabled |
| **Size** | Default, Large |
| **Content** | Default (с текстом), Icon Only |
| **Text** | строка (по умолчанию "Check") |

### Размеры (из макета)

| Size | Квадрат (иконка) | cornerRadius | Gap до текста |
|------|-------------------|--------------|---------------|
| **Default** | 16×16 px | 4 px | 10 px |
| **Large** | 24×24 px | 6 px | 10 px |

### Цвета (Default size)

- **Inactive (Default state)**  
  - Заливка: `#251D35` opacity ≈ 0.02  
  - Обводка: `#251D35` opacity ≈ 0.15, 1px, strokeAlign center  
- **Active (checked)**  
  - Заливка и обводка: `rgb(123, 54, 255)` (primary)  
- Текст лейбла: `#251D35` opacity ≈ 0.88, Graphik Regular 14px, line-height 20px.

В проекте сейчас бокс **20×20** и radius 4 — по Figma для Default должно быть **16×16**, для Large — **24×24** и radius 6.

---

## Что есть в проекте

| Элемент | Реализация |
|--------|------------|
| **Состояния** | `checked`, `indeterminate` (через ref на input), `disabled` (пробрасывается в input) |
| **Визуал** | Квадрат **20×20** (в Figma Default 16×16, Large 24×24), border-radius 4px, border, заливка при checked, галочка (один SVG) |
| **Hover** | Меняется только border (primary) у неактивного чекбокса; у checked — hover по primary-hover |
| **С лейблом** | `CheckboxWithLabel` с `label`, gap **8px** (в Figma 10px), стили лейбла (Graphik 14px/20px) |
| **Без лейбла** | Один компонент `Checkbox` без обёртки — используется в таблице |
| **Доступность** | Скрытый нативный `<input type="checkbox">`, `id` для связи с label |

---

## Чего нет в проекте (есть в Storybook)

По [UI/Checkbox в Storybook](https://main.storybook.konsol.team/?path=/docs/ui-checkbox--docs) есть сториз:

| Стори / фича | В проекте |
|--------------|-----------|
| **Primary** | ✅ Есть (текущий дефолт) |
| **Sizes** | ❌ Нет — только один размер (20×20). В Storybook, судя по названию, есть варианты размеров. |
| **Custom Label** | ⚠️ Частично — есть `CheckboxWithLabel` с текстом; «custom» может подразумевать произвольный контент справа (не только строка). |
| **Without Label** | ✅ Есть |
| **Indeterminate** | ⚠️ Логика есть (`indeterminate` на input), но отображается та же **галочка**, что и при checked. В дизайн-системах для indeterminate обычно рисуют **минус/тире**, а не галочку. |
| **Disabled** | ⚠️ Проп `disabled` есть и input не кликабелен, но **нет визуального стиля**: не снижена opacity, не убран hover, не `cursor: not-allowed`. В Storybook есть отдельная стори «Disabled». |

Итого по Storybook не хватает:
1. **Размеры (Sizes)** — проп `size` и стили (например, small 16×16).  
2. **Визуал disabled** — opacity, отключение hover, cursor.  
3. **Иконка indeterminate** — отдельная иконка «минус» вместо галочки.  
4. **Custom Label** — уточнить: только текст или слот для произвольного контента.

---

## Чего может не хватать по Figma

Без доступа к [ноде в Figma](https://www.figma.com/design/Cy349oQEQA1nKnpbGHUPaf/-konsol--company-web?node-id=25447-72785) ориентируемся на типичный набор состояний:

| Состояние | В проекте |
|-----------|-----------|
| Default (unchecked) | ✅ |
| Hover (unchecked) | ✅ border primary |
| Focus / Focus-visible | ❌ Нет outline/ring при фокусе с клавиатуры |
| Checked | ✅ |
| Checked + Hover | ✅ |
| Indeterminate | ⚠️ Есть логика, визуал как у checked (галочка) |
| Disabled (unchecked) | ❌ Нет визуала |
| Disabled (checked) | ❌ Нет визуала |
| Disabled (indeterminate) | ❌ Нет визуала |
| Error / invalid | ❌ Нет состояния ошибки (border/цвет) |

Итого по Figma часто не хватает:
1. **Focus-visible** — видимое кольцо/outline при фокусе (для доступности).  
2. **Disabled** — отдельные стили для unchecked / checked / indeterminate.  
3. **Indeterminate** — отдельная иконка (минус).  
4. **Error** — вариант с красной обводкой/подсказкой (если есть в макете).

---

## Краткий чек-лист: что добавить

- [ ] **Размеры** — проп `size` (например `default` 20×20, `small` 16×16) и соответствующие стили.  
- [ ] **Disabled** — стили: opacity ~0.5, отключение hover, `cursor: not-allowed`.  
- [ ] **Indeterminate** — отдельный SVG «минус» в `.checkbox__mark` при `indeterminate`, не галочка.  
- [ ] **Focus-visible** — outline/box-shadow при `:focus-visible` на контейнере/input.  
- [ ] **Error** (если есть в Figma) — проп `error` и класс с border/цветом ошибки.  
- [ ] **Custom label** — при необходимости слот для контента справа (React children или `label` как node).

После сверки с макетом по ноде 25447-72785 можно вычеркнуть лишнее или добавить пункты (например, точные размеры, отступы, токены из Figma).

---

## Актуальная сверка с Figma (Konsol UI, node-id=2430-143)

По макету **\*SelectionControl\* / Check**: Status (Inactive / Active / Indeterminate), State (Default / Hovered / Focused / Pressed / Disabled), Size (Default 16×16 / Large 24×24), Content (Default / Icon Only).

### Что в проекте уже совпадает с Figma (после сверки по API)

- **Размеры:** Default 16×16, radius 4px; Large 24×24, radius 6px.
- **Inactive (default):** заливка ≈ 0.02 (`--color-fill-alter`), обводка 0.15 (`--color-border`).
- **Inactive Hovered:** обводка `rgb(0.61, 0.37, 1)` — в проекте `--color-primary-border`.
- **Inactive Pressed:** обводка `rgb(0.36, 0.14, 0.85)` — в проекте `.checkbox:active` → `--color-primary-active`.
- **Active (checked):** заливка и обводка primary `rgb(0.48, 0.21, 1)`.
- **Indeterminate:** белый бокс с обводкой + фиолетовый квадрат внутри (8×8 default / 12×100% large, radius 2px). В проекте: `.checkbox--indeterminate` + `.checkbox__indeterminate-inner`.
- **Иконка галочки:** в проекте 16×16 (default) и 24×24 (large) — `.checkbox__mark`.
- **Gap до лейбла:** 10px.
- **Focus-visible:** кольцо через `box-shadow` и `--control-outline`.
- **Disabled:** в Figma opacity **0.4**; в проекте 0.4, фон/обводка disabled.

### Что может не сходиться с Figma

1. **Stroke align** — в Figma strokeAlign: CENTER; в CSS border внутрь — визуально может отличаться на 1px при зуме.
2. **Disabled: три подсостояния** — в проекте один `.checkbox--disabled`; если в макете Inactive/Active/Indeterminate Disabled различаются, можно вынести отдельные классы.
