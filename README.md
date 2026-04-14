# konsol-ui-kit

Konsol UI kit and component playground for building internal prototypes.

## Quick start

```bash
npm install
npm run dev
```

## UI components catalog

Use this repository as a visual and code reference for prototype screens.  
After `npm run dev`, open:

- `/` — assignments demo screen
- `/components` — component showcase page

### Core and layout

- `Sidebar`, `NavButton`
- `Card`, `Divider`, `Typography`
- `ActionsPanel`

### Buttons and controls

- `Button`
- `Checkbox`, `Radio`, `Switch`
- `Segments`, `Tabs`
- `Pagination`

### Inputs and form building

- `Input` family (`InputSearch`, `InputBasic`, `InputDate`, `InputTime`, `InputSelect`, `InputTextarea`)
- `InputLabel`, `FormItem`
- `Textarea`, `Select`
- `DatePicker`, `TimePicker`, `TimeRangePicker`
- `MaskedInput`, `PhoneInput`, `OtpInput`, `InputNumber`

### Feedback and overlays

- `Alert`, `Banner`, `Toast`, `Toaster`
- `Dialog`, `Modal`, `SideModal`
- `Popover`, `Tooltip`, `Dropdown`
- `Progress`, `Stepper`

### Data display and navigation

- `Table`
- `Tag`
- `Avatar`
- `Timeline`
- `Accordion`

### Advanced helpers

- `Autocomplete`
- `Combobox` (base, primitive, multiselect)
- `Calendar`, `DateRangePicker`, `ScheduleCalendar`
- `Carousel`, `CustomizableCarousel`, `ScrollArea`
- `Command`, `Uploader`

### Icons and visual assets

- `Icon` (main UI icon set)
- `IconBanks`
- `IconDocuments`

Most source components live in `src/ui`.

## Public repository notice

This repository may contain visual assets (fonts, logos, bank/service icons, and brand imagery) that can have separate license or trademark restrictions.

- Do not assume all assets are free for commercial/public redistribution.
- Review and replace restricted assets before reuse outside your organization.
- See `THIRD_PARTY_NOTICE.md` for details.

## Recommended public-safe setup

- Keep generated build output out of git (`dist/` is ignored).
- Keep local credentials out of git (`.env*` is ignored).
- Prefer open-licensed fonts/icons for public forks.
