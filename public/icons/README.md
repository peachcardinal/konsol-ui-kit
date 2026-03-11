# Иконки Konsol UI

Каталог иконок из Figma (страница **Icon ✅**, [node-id=323-0](https://www.figma.com/design/jGFSCLIcLgpXMacye3goFv/Konsol-UI--Ant-Design-5.0-?node-id=323-0)).

## Файлы

- **icons-catalog.json** — полный список компонентов иконок: `id`, `name`, `type`, `key` (397 шт.).

## Секции в Figma

| Секция | Описание |
|--------|----------|
| Countries | Страны (Belarus, Russia, Kazakhstan, …) |
| Documents (square box) | Документы (file-normal, file-error, file-signed, …) |
| Services | Сервисы и платёжные системы (Sber, Tinkoff, Visa, MasterCard, …) |
| Material Icons | UI-иконки (search, person, settings, arrow_back, …) |
| Custom Icons | Кастомные иконки (bill, bills, sub, …) |
| Flags | Флаги стран (коды ISO: RU, US, …) |
| Не используем | Устаревшие |
| Pasport | Паспорт (Селфи, прописка, разворот) |
| Autorization icons | Иконки авторизации |

## Использование

- **В Figma:** `figma_instantiate_component` с `componentKey` из каталога.
- **В коде:** ищи по `name` или `key` в `icons-catalog.json`; для вёрстки можно экспортировать нужные иконки в SVG и положить в этот каталог.
