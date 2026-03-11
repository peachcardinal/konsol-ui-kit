# InputTime — сверка с Figma *Input* / Time (5273-5118)

## Что в Figma

- **Status:** Default | Error
- **Size:** Default (32px высота, 8px radius, 10px padding) | Large (40px, 10px radius, 12px padding)
- **State:** Default | Hover | Focused | Selected | Filled | Disabled
- **Range:** False (одно поле, ширина 160px) | True (два поля, общая ширина 320px)
- **Input Caption:** опционально (как у Input Basic)

Цвета по стейтам (общая система инпутов, как у Input Search / Input Basic):
- **Default (пусто):** placeholder/текст — `colorTextPlaceholder`
- **Hover:** бордер — `colorPrimaryBorder`
- **Focus:** бордер — `colorPrimaryBase`, outline — `controlOutline`
- **Filled:** текст и контент внутри — `colorText`
- **Disabled:** текст и placeholder — `colorTextDisabled`, фон — `colorBgContainerDisabled`, без общей opacity
- **Error:** бордер — `colorErrorBase`, focus outline — `colorErrorBg`

---

## Ошибки, которые уже проходили в других инпутах и нужно было учесть в InputTime

| Проблема | Где чинили | В InputTime было / стало |
|----------|------------|---------------------------|
| **1. Иконка/сепаратор не меняет цвет по стейту** | Input Search: иконка слева = цвет текста (placeholder → при filled colorText) | Сепаратор `arrow_next` в range был всегда `color-text-description`. **Исправлено:** в filled — `colorText`, в disabled — `colorTextDisabled`. |
| **2. Disabled через opacity** | Button, Input: не opacity, а явные токены | InputTime использует общий `.input-wrap--disabled` (цвета токенов). OK. |
| **3. Filled при disabled** | Input: filled только если есть значение и не disabled | Уже верно: `hasValue && !disabled`. OK. |
| **4. Ширина single vs Figma** | — | В Figma single = 160px. В проекте общий `max-width: 360px`. **Исправлено:** для single (не range) задан `max-width: 160px`. |
| **5. Placeholder цвет** | Input: default/placeholder = colorTextPlaceholder | Общий CSS для `input::placeholder`. OK. |
| **6. Текст в поле** | Input: цвет текста = colorText, в disabled = colorTextDisabled | Общий `.input-wrap input` и `.input-wrap--disabled input`. OK. |

---

## Внесённые правки

1. **Сепаратор в range (иконка arrow_next):**
   - `.input-wrap--filled .input-time__sep` → `color: var(--color-text);`
   - `.input-wrap--disabled .input-time__sep` → `color: var(--color-text-disabled);`
   - По умолчанию (пусто) оставлен `color-text-description`.

2. **Ширина одиночного InputTime:**
   - `.input-wrap.input-time:not(.input-wrap--range)` → `max-width: 160px;` (по Figma).

3. **Геп в range:** уже 6px (`.input-wrap--range .input-content { gap: 6px; }`).

4. **Плейсхолдер 00:00:** в разметке везде задан `placeholder="00:00"`. У `input type="time"` атрибут placeholder не поддерживается — браузеры показывают свою маску (`--:--`). Чтобы везде была маска 00:00, нужен кастомный инпут (текст + маска).
