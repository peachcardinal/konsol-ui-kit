// UI component registry for Konsol UI.
// API здесь — источник истины; имена и допустимые значения props совпадают со Storybook
// (https://main.storybook.konsol.team/?path=/docs/ui-input--docs).

export type ButtonVariant = "primary" | "default" | "dashed" | "text" | "link" | "sber" | "tbank" | "telegram" | "max";
export type ButtonSize = "sm" | "md" | "lg" | "custom";

export type InputSize = "default" | "large";
export type InputStatus = "default" | "error";

export interface ButtonProps {
  /**
   * Visual style of the button (Storybook UI Button API).
   * - "primary": branded purple button
   * - "default": neutral button (серый фон)
   * - "dashed": dashed border
   * - "text": text-only
   * - "link": link-like
   * - "sber" | "tbank" | "telegram" | "max": брендированные
   */
  variant?: ButtonVariant;

  /**
   * Size: sm (24px), md (32px), lg (40px), custom.
   */
  size?: ButtonSize;

  /**
   * When true, renders icon-only button (no text).
   */
  iconOnly?: boolean;

  /**
   * Icon name (Storybook style, e.g. "CloseIcon", "AddIcon", "ArrowDownIcon").
   * Единый каталог: src/ui/Icon.
   */
  icon?: string;

  /**
   * Position of icon: "start" | "end".
   */
  iconPosition?: "start" | "end";

  /** asChild: use child as root (Radix Slot). */
  asChild?: boolean;
  /** isActive: apply active state styles. */
  isActive?: boolean;
  /** isLoading: show spinner, disable click. */
  isLoading?: boolean;

  /**
   * HTML disabled state.
   */
  disabled?: boolean;

  /**
   * Additional CSS class names to append to the button root.
   */
  className?: string;
}

/**
 * Input Search — поле поиска с иконкой search слева.
 * Storybook: UI/Input, story «Search» (ui-input--search).
 */
export interface InputSearchProps {
  /**
   * Placeholder текст.
   */
  placeholder?: string;

  /**
   * Контролируемое значение.
   */
  value?: string;

  /**
   * Неконтролируемое значение по умолчанию.
   */
  defaultValue?: string;

  /**
   * Обработчик изменения значения.
   */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Блокировка ввода.
   */
  disabled?: boolean;

  /**
   * Размер поля. По умолчанию default. У Input Search нет small.
   * - "default": 32px height
   * - "large": 40px height
   */
  size?: InputSize;

  /**
   * Визуальный статус (ошибка — красная обводка/подпись).
   * - "default": обычное состояние
   * - "error": ошибка валидации
   */
  status?: InputStatus;

  /**
   * Показывать кнопку очистки справа при непустом значении.
   */
  allowClear?: boolean;

  /**
   * Дополнительные CSS-классы на обёртку.
   */
  className?: string;

  /**
   * Остальные нативные атрибуты input (id, name, autoComplete, aria-*, и т.д.).
   */
  // ... rest
}

/**
 * Input Select — поле-триггер выбора (Figma Select Input 415:57).
 * Status: default | error; Size: default | large; Type: basic | multiple.
 */
export interface InputSelectProps {
  /** Placeholder при отсутствии выбора. */
  placeholder?: string;
  /** Выбранное значение: строка (basic) или массив (multiple). */
  value?: string | string[] | null;
  /** Метка выбранного значения (если не совпадает с value). */
  valueLabel?: string | string[];
  /** Опции для отображения меток при value. */
  options?: Array<{ value: string; label: string } | string>;
  /** Режим: один вариант или несколько. */
  mode?: "basic" | "multiple";
  disabled?: boolean;
  size?: InputSize;
  status?: InputStatus;
  /** Подпись под полем. */
  caption?: string;
  /** Клик по полю (открыть меню). */
  onClick?: () => void;
  className?: string;
  id?: string;
  "aria-haspopup"?: string;
  "aria-expanded"?: boolean;
}

/**
 * ActionsPanel — панель действий над контентом (вне сетки).
 * Свои отступы по 12px до сайдбара слева и до края окна справа/снизу (не складываются с паддингами контента).
 * При верстке макетов с панелью выбранных элементов используй этот компонент.
 */
/**
 * InputLabel — метка поля. Figma Input Label (388:11598).
 * Размеры: default (base primary strong, геп снизу 6), large (lg primary strong, геп снизу 10).
 * Опционально: иконка 16×16 справа от текста с гепом 4.
 */
export interface InputLabelProps {
  /** Текст метки. */
  label: string;
  /** id инпута для связи label с полем. */
  htmlFor?: string;
  /** Имя иконки из каталога (16×16 справа от текста, геп 4). */
  icon?: string;
  /** Размер: default (base primary strong, геп 6) или large (lg primary strong, геп 10). */
  size?: "default" | "large";
  className?: string;
}

/**
 * FormItem — блок поля формы: InputLabel + контрол + опционально caption. Figma Form Item (515:43856).
 */
export interface FormItemProps {
  /** Текст метки (передаётся в InputLabel). */
  label: string;
  /** id инпута для htmlFor метки. */
  htmlFor?: string;
  /** Иконка справа от метки (передаётся в InputLabel). */
  icon?: string;
  /** Размер метки и отступ: default | large (передаётся в InputLabel). */
  size?: "default" | "large";
  /** Контрол: любой Input (Basic, Search, Select, Date, Time, Textarea и т.д.). */
  children: React.ReactNode;
  /** Подпись под полем (подсказка или текст ошибки). */
  caption?: string;
  /** Статус: default или error (влияет на цвет caption). */
  status?: "default" | "error";
  className?: string;
}

export interface ActionsPanelSummaryProps {
  text: string;
  sum?: string;
  onClose?: () => void;
}

export interface ActionsPanelProps {
  /**
   * Сводка выбранного: текст ("N заданий"), сумма ("X ₽" в стиле base primary normal + colortextdescription), onClose.
   * Если не передать — блок сводки не показывается.
   */
  summary?: ActionsPanelSummaryProps | null;

  /**
   * Контент справа (например кнопка «Выбрать все»).
   */
  rightSlot?: React.ReactNode;

  /**
   * Кнопки действий между сводкой и rightSlot (Отправить, Завершить, Создать акт и т.д.). Геп между ними 0.5rem.
   */
  children?: React.ReactNode;

  className?: string;
}

export const UIRegistry = {
  Button: {
    importPath: "./Button",
    props: {
      variant: ["primary", "default", "dashed", "text", "link", "sber", "tbank", "telegram", "max"] as ButtonVariant[],
      size: ["sm", "md", "lg", "custom"] as ButtonSize[],
      iconOnly: ["boolean"],
      icon: ["IconName (e.g. AddIcon, CloseIcon, ArrowDownIcon)"],
      iconPosition: ["start", "end"],
      asChild: ["boolean"],
      isActive: ["boolean"],
      isLoading: ["boolean"],
      disabled: ["boolean"],
      className: ["string"],
      children: ["ReactNode"],
    },
    examples: {
      primary: `<Button variant="primary">Отправить</Button>`,
      primarySmallIconLeft: `<Button variant="primary" size="sm" icon="AddIcon" iconPosition="start">Добавить</Button>`,
      primaryIconOnly: `<Button variant="primary" iconOnly icon="AddIcon" aria-label="Добавить" />`,
      defaultWithRightIcon: `<Button variant="default" icon="ArrowDownIcon" iconPosition="end">Подробнее</Button>`,
      dashed: `<Button variant="dashed">Черновик</Button>`,
      text: `<Button variant="text">Текстовая кнопка</Button>`,
      link: `<Button variant="link">Ссылка</Button>`,
      large: `<Button variant="primary" size="lg">Крупная кнопка</Button>`,
      disabled: `<Button variant="primary" disabled>Недоступно</Button>`,
      loading: `<Button variant="primary" isLoading>Сохранение...</Button>`,
    },
  },

  InputSearch: {
    importPath: "./input/Input",
    props: {
      placeholder: ["string"],
      value: ["string"],
      defaultValue: ["string"],
      onChange: ["function"],
      disabled: ["boolean"],
      size: ["default", "large"] as InputSize[],
      status: ["default", "error"] as InputStatus[],
      allowClear: ["boolean"],
      className: ["string"],
    },
    examples: {
      default: `<Input placeholder="Поиск..." />`,
      withValue: `<Input placeholder="ФИО или номер телефона" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />`,
      disabled: `<Input placeholder="Поиск..." disabled />`,
      large: `<Input placeholder="Поиск..." size="large" />`,
      error: `<Input placeholder="Поиск..." status="error" />`,
      withClear: `<Input placeholder="Поиск..." allowClear value={q} onChange={(e) => setQ(e.target.value)} />`,
    },
  },

  InputSelect: {
    importPath: "./input/InputSelect",
    props: {
      placeholder: ["string"],
      value: ["string", "string[]"],
      valueLabel: ["string", "string[]"],
      options: ["array"],
      mode: ["basic", "multiple"],
      disabled: ["boolean"],
      size: ["default", "large"] as InputSize[],
      status: ["default", "error"] as InputStatus[],
      caption: ["string"],
      onClick: ["function"],
      className: ["string"],
    },
    examples: {
      default: `<InputSelect placeholder="Выберите..." onClick={() => {}} />`,
      filled: `<InputSelect placeholder="Выберите..." value="a" valueLabel="Вариант А" options={[{ value: "a", label: "Вариант А" }]} onClick={() => {}} />`,
      multiple: `<InputSelect mode="multiple" placeholder="Выберите..." value={["1", "2"]} valueLabel={["Первый", "Второй"]} onClick={() => {}} />`,
      error: `<InputSelect placeholder="Выберите..." status="error" caption="Обязательное поле" onClick={() => {}} />`,
      large: `<InputSelect placeholder="Выберите..." size="large" onClick={() => {}} />`,
      disabled: `<InputSelect placeholder="Выберите..." disabled onClick={() => {}} />`,
    },
  },

  ActionsPanel: {
    importPath: "./actions-panel",
    props: {
      summary: ["object | null"],
      rightSlot: ["ReactNode"],
      children: ["ReactNode"],
      className: ["string"],
    },
    examples: {
      withSummary: `<ActionsPanel
  summary={{ text: "3 заданий", sum: "33 732 ₽", onClose: () => {} }}
  rightSlot={<Button variant="default">Выбрать все</Button>}
>
  <Button variant="primary">Отправить</Button>
  <Button variant="default">Завершить</Button>
  <Button variant="default" icon="ArrowDownIcon" iconPosition="end">Создать акт</Button>
</ActionsPanel>`,
      withoutSummary: `<ActionsPanel rightSlot={<Button variant="default">Выбрать все</Button>}>
  <Button variant="primary">Действие</Button>
</ActionsPanel>`,
    },
  },

  /** InputLabel — метка поля. Figma 388:11598. size: default | large, опционально icon. */
  InputLabel: {
    importPath: "./input-label",
    props: {
      label: ["string"],
      htmlFor: ["string"],
      icon: ["string"],
      size: ["default", "large"],
      className: ["string"],
    },
    examples: {
      default: `<InputLabel label="Название поля" />`,
      large: `<InputLabel label="Крупная метка" size="large" />`,
      withIcon: `<InputLabel label="С подсказкой" icon="info_fill" />`,
      withFor: `<InputLabel label="Email" htmlFor="email-field" />`,
    },
  },

  /** FormItem — InputLabel + Input (любой) + опционально caption. Figma 515:43856. */
  FormItem: {
    importPath: "./form-item",
    props: {
      label: ["string"],
      htmlFor: ["string"],
      icon: ["string"],
      size: ["default", "large"],
      children: ["ReactNode"],
      caption: ["string"],
      status: ["default", "error"],
      className: ["string"],
    },
    examples: {
      basic: `<FormItem label="ФИО">
  <InputBasic placeholder="Введите имя" />
</FormItem>`,
      large: `<FormItem label="Email" size="large">
  <InputBasic placeholder="email@example.com" type="email" size="large" />
</FormItem>`,
      withCaption: `<FormItem label="Комментарий" caption="Необязательное поле.">
  <InputBasic placeholder="Текст" />
</FormItem>`,
      error: `<FormItem label="Пароль" status="error" caption="Обязательное поле">
  <InputBasic placeholder="Пароль" status="error" type="password" />
</FormItem>`,
    },
  },

  /** *Toast* — Figma 421:14564. Контейнер: по центру, max-width 500px, top 20px. */
  Toast: {
    importPath: "./toast",
    props: {
      type: ["normal", "warning", "success", "error", "loading"],
      message: ["string"],
      className: ["string"],
    },
    examples: {
      normal: `<Toast type="normal" message="Сообщение" />`,
      success: `<Toast type="success" message="Сохранено" />`,
      error: `<Toast type="error" message="Ошибка" />`,
      withContainer: `<ToastContainer>
  <Toast type="success" message="Готово" />
</ToastContainer>`,
    },
  },
} as const;

