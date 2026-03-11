import { useState } from "react";
import { Sidebar } from "../../ui/sidebar";
import { NavButton } from "../../ui/nav-button";
import { Button } from "../../ui/button";
import { InputSearch } from "../../ui/Input";
import { InputBasic } from "../../ui/Input";
import { InputTime } from "../../ui/Input";
import { InputDate } from "../../ui/Input";
import { Textarea } from "../../ui/Textarea";
import { InputSelect } from "../../ui/Input";
import { FormItem } from "../../ui/form-item";
import { Checkbox } from "../../ui/checkbox";
import { Tag } from "../../ui/Tag";
import { Segments, SegmentItem } from "../../ui/Segments";
import { Radio, RadioGroup } from "../../ui/radio";
import { Table, TableHeader, TableRow, TableCell } from "../../ui/Table";
import { ActionsPanel } from "../../ui/actions-panel";
import { Toast } from "../../ui/toast";
import { Alert } from "../../ui/alert";
import { Banner } from "../../ui/banner";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/Avatar";
import { Switch } from "../../ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/Tabs";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from "../../ui/Dropdown";
import { Pagination } from "../../ui/pagination";
import { Icon, icons } from "../../ui/Icon";
import "./ComponentsPage.css";

/** Все иконки из src/ui/Icon (ключи каталога) */
const ICON_NAMES = Object.keys(icons);

const TAG_PRESETS = [
  "blue",
  "cyan",
  "geekblue",
  "gold",
  "green",
  "lime",
  "magenta",
  "orange",
  "purple",
  "red",
  "volcano",
  "gray",
];


const SEGMENT_ITEMS = [
  { value: "all", label: "Все" },
  { value: "active", label: "Активные" },
  { value: "draft", label: "Черновики" },
];

const RADIO_OPTIONS = [
  { value: "option1", label: "Радио кнопка" },
  { value: "option2", label: "Второй вариант" },
  { value: "option3", label: "Третий вариант" },
];

const TABLE_DEMO_COLUMNS = [
  { key: "name", label: "Имя", sortable: true, type: "item" },
  { key: "role", label: "Роль", sortable: true, type: "item" },
  { key: "status", label: "Статус", sortable: true, type: "item" },
];

const TABLE_DEMO_ROWS = [
  { id: "1", name: "Строка 1", role: "Исполнитель", status: "Активен" },
  { id: "2", name: "Строка 2", role: "Клиент", status: "Черновик" },
  { id: "3", name: "Строка 3", role: "Исполнитель", status: "Отменён" },
];

export default function ComponentsPage() {
  const [searchValue, setSearchValue] = useState("Поиск");
  const [segmentValue, setSegmentValue] = useState(SEGMENT_ITEMS[0].value);
  const [radioValue, setRadioValue] = useState(RADIO_OPTIONS[0].value);
  const [tabsValue, setTabsValue] = useState("tab1");
  const [switchChecked, setSwitchChecked] = useState(false);
  const [paginationCurrent, setPaginationCurrent] = useState(1);

  return (
    <div className="components-page">
      <Sidebar>
        <NavButton onClick={() => (window.location.href = "/")}>Задания</NavButton>
        <NavButton active>Компоненты</NavButton>
      </Sidebar>

      <main className="components-main">
        <header className="header-navigation">
          <h1 className="header-navigation__title text-heading-1">Компоненты</h1>
        </header>

        <div className="components-content">
          {/* Buttons */}
          <section className="components-section">
            <h2 className="components-section__title text-heading-2">Button</h2>
            <p className="components-section__description text-sm-primary-normal">
              Базовые варианты кнопки: типы, размеры, состояния disabled и иконки.
            </p>

            <div className="components-subtitle text-sm-primary-normal">Типы (size=&quot;default&quot;)</div>
            <div className="components-grid">
              <div className="components-swatch">
                <Button variant="primary">Primary</Button>
                <div className="components-swatch__label">type=&quot;primary&quot;</div>
              </div>
              <div className="components-swatch">
                <Button variant="default">Default</Button>
                <div className="components-swatch__label">type=&quot;default&quot;</div>
              </div>
              <div className="components-swatch">
                <Button variant="dashed">Dashed</Button>
                <div className="components-swatch__label">type=&quot;dashed&quot;</div>
              </div>
              <div className="components-swatch">
                <Button variant="text">Text</Button>
                <div className="components-swatch__label">type=&quot;text&quot;</div>
              </div>
              <div className="components-swatch">
                <Button variant="link">Link</Button>
                <div className="components-swatch__label">type=&quot;link&quot;</div>
              </div>
            </div>

            <div className="components-subtitle text-sm-primary-normal">Размеры</div>
            <div className="components-grid">
              <div className="components-swatch">
                <Button variant="primary" size="sm">
                  Small
                </Button>
                <div className="components-swatch__label">type=&quot;primary&quot;, size=&quot;small&quot;</div>
              </div>
              <div className="components-swatch">
                <Button variant="primary" size="md">
                  Default
                </Button>
                <div className="components-swatch__label">type=&quot;primary&quot;, size=&quot;default&quot;</div>
              </div>
              <div className="components-swatch">
                <Button variant="primary" size="lg">
                  Large
                </Button>
                <div className="components-swatch__label">type=&quot;primary&quot;, size=&quot;large&quot;</div>
              </div>
            </div>

            <div className="components-subtitle text-sm-primary-normal">Состояния (Primary, size=&quot;default&quot;)</div>
            <div className="components-state-row">
              <div className="components-state-row__label text-sm-primary-normal">Visual state</div>
              <div className="components-state-row__cells">
                <div className="components-swatch">
                  <Button variant="primary">Default</Button>
                  <div className="components-swatch__label">state=&quot;default&quot;</div>
                </div>
                <div className="components-swatch components-demo-btn--hover">
                  <Button variant="primary">Hover</Button>
                  <div className="components-swatch__label">state=&quot;hover&quot; (эмулируется)</div>
                </div>
                <div className="components-swatch components-demo-btn--active">
                  <Button variant="primary">Active</Button>
                  <div className="components-swatch__label">state=&quot;active&quot; (эмулируется)</div>
                </div>
                <div className="components-swatch">
                  <Button variant="primary" disabled>
                    Disabled
                  </Button>
                  <div className="components-swatch__label">disabled</div>
                </div>
              </div>
            </div>

            <div className="components-subtitle text-sm-primary-normal">Иконки и iconOnly</div>
            <div className="components-grid">
              <div className="components-swatch">
                <Button variant="primary" icon="AddIcon" iconPosition="start">
                  С иконкой слева
                </Button>
                <div className="components-swatch__label">
                  type=&quot;primary&quot;, iconLeft=&quot;add&quot;
                </div>
              </div>
              <div className="components-swatch">
                <Button variant="default" icon="ArrowDownIcon" iconPosition="end">
                  С иконкой справа
                </Button>
                <div className="components-swatch__label">
                  type=&quot;default&quot;, iconRight=&quot;arrow_down&quot;
                </div>
              </div>
              <div className="components-swatch">
                <Button variant="text" iconOnly icon="MoreVertIcon" aria-label="Ещё" />
                <div className="components-swatch__label">
                  type=&quot;text&quot;, iconOnly, iconLeft=&quot;more_vert&quot;
                </div>
              </div>
              <div className="components-swatch">
                <Button variant="primary" size="sm" iconOnly icon="AddIcon" aria-label="Добавить" />
                <div className="components-swatch__label">
                  type=&quot;primary&quot;, size=&quot;small&quot;, iconOnly
                </div>
              </div>
            </div>
          </section>

          {/* Input (Search) */}
          <section className="components-section">
            <h2 className="components-section__title text-heading-2">Input (Search)</h2>
            <p className="components-section__description text-sm-primary-normal">
              Поле поиска с иконкой слева. Варианты по размеру, статусу и allowClear.
            </p>
            <div className="components-grid">
              <div className="components-swatch">
                <InputSearch placeholder="Поиск..." />
                <div className="components-swatch__label">
                  size=&quot;default&quot;, status=&quot;default&quot;
                </div>
              </div>
              <div className="components-swatch">
                <InputSearch placeholder="Поиск (large)..." size="lg" />
                <div className="components-swatch__label">
                  size=&quot;large&quot;, status=&quot;default&quot;
                </div>
              </div>
              <div className="components-swatch">
                <InputSearch placeholder="Ошибка валидации" error="Ошибка" />
                <div className="components-swatch__label">
                  size=&quot;default&quot;, status=&quot;error&quot;
                </div>
              </div>
              <div className="components-swatch">
                <InputSearch placeholder="Поиск (disabled)" disabled />
                <div className="components-swatch__label">
                  size=&quot;default&quot;, disabled
                </div>
              </div>
              <div className="components-swatch">
                <InputSearch
                  placeholder="Поиск с очисткой"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onClear={() => setSearchValue("")}
                />
                <div className="components-swatch__label">
                  allowClear, value=&quot;{searchValue}&quot;
                </div>
              </div>
            </div>

            <div className="components-subtitle text-sm-primary-normal">Состояния (эмуляция hover/focus)</div>
            <div className="components-state-row">
              <div className="components-state-row__label text-sm-primary-normal">Visual state</div>
              <div className="components-state-row__cells">
                <div className="components-swatch">
                  <InputSearch placeholder="Default" />
                  <div className="components-swatch__label">state=&quot;default&quot;</div>
                </div>
                <div className="components-swatch components-demo-input--hover">
                  <InputSearch placeholder="Hover" />
                  <div className="components-swatch__label">state=&quot;hover&quot; (эмулируется)</div>
                </div>
                <div className="components-swatch components-demo-input--focus">
                  <InputSearch placeholder="Focus" />
                  <div className="components-swatch__label">state=&quot;focus&quot; (эмулируется)</div>
                </div>
              </div>
            </div>
          </section>

          {/* Input Basic */}
          <section className="components-section">
            <h2 className="components-section__title text-heading-2">Input (Basic)</h2>
            <p className="components-section__description text-sm-primary-normal">
              Базовый текстовый инпут без иконки поиска. Размеры, статус, иконки слева/справа, суффикс и caption под полем.
            </p>

            <div className="components-subtitle text-sm-primary-normal">Статусы и размеры</div>
            <div className="components-grid">
              <div className="components-swatch">
                <InputBasic placeholder="Input" />
                <div className="components-swatch__label">status=&quot;default&quot;, size=&quot;default&quot;</div>
              </div>
              <div className="components-swatch">
                <InputBasic placeholder="Input" size="large" />
                <div className="components-swatch__label">status=&quot;default&quot;, size=&quot;large&quot;</div>
              </div>
              <div className="components-swatch">
                <InputBasic placeholder="Ошибка валидации" status="error" />
                <div className="components-swatch__label">status=&quot;error&quot;, size=&quot;default&quot;</div>
              </div>
              <div className="components-swatch">
                <InputBasic placeholder="Disabled" disabled />
                <div className="components-swatch__label">disabled</div>
              </div>
            </div>

            <div className="components-subtitle text-sm-primary-normal">Иконки, суффикс и caption</div>
            <div className="components-grid">
              <div className="components-swatch">
                <InputBasic placeholder="С иконкой слева" iconLeft="search" />
                <div className="components-swatch__label">iconLeft=&quot;search&quot;</div>
              </div>
              <div className="components-swatch">
                <InputBasic placeholder="С иконкой справа" iconRight="arrow_down" />
                <div className="components-swatch__label">iconRight=&quot;arrow_down&quot;</div>
              </div>
              <div className="components-swatch">
                <InputBasic placeholder="С суффиксом" suffix="₽" />
                <div className="components-swatch__label">suffix=&quot;₽&quot;</div>
              </div>
              <div className="components-swatch">
                <InputBasic
                  placeholder="С caption"
                  caption="This is a caption under a text input."
                />
                <div className="components-swatch__label">caption (status=&quot;default&quot;)</div>
              </div>
              <div className="components-swatch">
                <InputBasic
                  placeholder="Ошибка валидации"
                  status="error"
                  caption="Error caption under a text input."
                />
                <div className="components-swatch__label">status=&quot;error&quot;, caption</div>
              </div>
            </div>
          </section>

          {/* FormItem */}
          <section className="components-section">
            <h2 className="components-section__title text-heading-2">FormItem</h2>
            <p className="components-section__description text-sm-primary-normal">
              Блок поля формы: InputLabel (Figma 388:11598) + любой Input (Basic, Search, Select, Date, Time, Textarea). Figma Form Item (515:43856).
            </p>
            <div className="components-grid">
              <div className="components-swatch">
                <FormItem label="Название">
                  <InputBasic placeholder="Введите значение" />
                </FormItem>
                <div className="components-swatch__label">label + InputBasic</div>
              </div>
              <div className="components-swatch">
                <FormItem label="Email" size="large">
                  <InputBasic placeholder="email@example.com" type="email" size="large" />
                </FormItem>
                <div className="components-swatch__label">size=&quot;large&quot;</div>
              </div>
              <div className="components-swatch">
                <FormItem label="С подсказкой" icon="info_fill">
                  <InputBasic placeholder="Иконка справа от метки" />
                </FormItem>
                <div className="components-swatch__label">icon=&quot;info_fill&quot;</div>
              </div>
              <div className="components-swatch">
                <FormItem label="Подпись под полем" caption="Необязательное поле.">
                  <InputBasic placeholder="Текст" />
                </FormItem>
                <div className="components-swatch__label">caption</div>
              </div>
              <div className="components-swatch">
                <FormItem label="Пароль" status="error" caption="Обязательное поле">
                  <InputBasic placeholder="Пароль" status="error" type="password" />
                </FormItem>
                <div className="components-swatch__label">status=&quot;error&quot;, caption</div>
              </div>
            </div>
          </section>

          {/* Input Time */}
          <section className="components-section">
            <h2 className="components-section__title text-heading-2">Input (Time)</h2>
            <p className="components-section__description text-sm-primary-normal">
              Поле ввода времени (одиночное или диапазон). Figma *Input* / Time (5273-5118): Status, Size, State, Range.
            </p>
            <div className="components-subtitle text-sm-primary-normal">Одиночное время</div>
            <div className="components-grid">
              <div className="components-swatch">
                <InputTime />
                <div className="components-swatch__label">size=&quot;default&quot;, status=&quot;default&quot;</div>
              </div>
              <div className="components-swatch">
                <InputTime size="large" />
                <div className="components-swatch__label">size=&quot;large&quot;</div>
              </div>
              <div className="components-swatch">
                <InputTime defaultValue="09:00" />
                <div className="components-swatch__label">defaultValue=&quot;09:00&quot;</div>
              </div>
              <div className="components-swatch">
                <InputTime disabled />
                <div className="components-swatch__label">disabled</div>
              </div>
              <div className="components-swatch">
                <InputTime status="error" />
                <div className="components-swatch__label">status=&quot;error&quot;</div>
              </div>
              <div className="components-swatch">
                <InputTime caption="Подпись под полем времени." />
                <div className="components-swatch__label">caption</div>
              </div>
            </div>
            <div className="components-subtitle text-sm-primary-normal">Диапазон времени (range=true)</div>
            <div className="components-grid components-grid--range">
              <div className="components-swatch">
                <InputTime range />
                <div className="components-swatch__label">range (пустой)</div>
              </div>
              <div className="components-swatch">
                <InputTime range defaultValueStart="09:00" defaultValueEnd="18:00" />
                <div className="components-swatch__label">range, 09:00 – 18:00</div>
              </div>
              <div className="components-swatch">
                <InputTime range size="large" />
                <div className="components-swatch__label">range, size=&quot;large&quot;</div>
              </div>
              <div className="components-swatch">
                <InputTime range status="error" caption="Ошибка в диапазоне времени." />
                <div className="components-swatch__label">range, status=&quot;error&quot;, caption</div>
              </div>
            </div>
          </section>

          {/* Input Date */}
          <section className="components-section">
            <h2 className="components-section__title text-heading-2">Input (Date)</h2>
            <p className="components-section__description text-sm-primary-normal">
              Поле ввода даты (одиночное или диапазон). Figma *DatePicker* (415-795): Status, Size, State, Range.
            </p>
            <div className="components-subtitle text-sm-primary-normal">Одиночная дата</div>
            <div className="components-grid">
              <div className="components-swatch">
                <InputDate />
                <div className="components-swatch__label">size=&quot;default&quot;, status=&quot;default&quot;</div>
              </div>
              <div className="components-swatch">
                <InputDate size="large" />
                <div className="components-swatch__label">size=&quot;large&quot;</div>
              </div>
              <div className="components-swatch">
                <InputDate defaultValue="2025-03-06" />
                <div className="components-swatch__label">defaultValue (YYYY-MM-DD)</div>
              </div>
              <div className="components-swatch">
                <InputDate disabled />
                <div className="components-swatch__label">disabled</div>
              </div>
              <div className="components-swatch">
                <InputDate status="error" />
                <div className="components-swatch__label">status=&quot;error&quot;</div>
              </div>
              <div className="components-swatch">
                <InputDate caption="Подпись под полем даты." />
                <div className="components-swatch__label">caption</div>
              </div>
            </div>
            <div className="components-subtitle text-sm-primary-normal">Диапазон дат (range=true)</div>
            <div className="components-grid components-grid--range">
              <div className="components-swatch">
                <InputDate range />
                <div className="components-swatch__label">range (пустой)</div>
              </div>
              <div className="components-swatch">
                <InputDate range defaultValueStart="2025-03-01" defaultValueEnd="2025-03-31" />
                <div className="components-swatch__label">range, март 2025</div>
              </div>
              <div className="components-swatch">
                <InputDate range size="large" />
                <div className="components-swatch__label">range, size=&quot;large&quot;</div>
              </div>
              <div className="components-swatch">
                <InputDate range status="error" caption="Ошибка в диапазоне дат." />
                <div className="components-swatch__label">range, status=&quot;error&quot;, caption</div>
              </div>
            </div>
          </section>

          {/* Input Textarea */}
          <section className="components-section">
            <h2 className="components-section__title text-heading-2">Input (Textarea)</h2>
            <p className="components-section__description text-sm-primary-normal">
              Многострочное поле. Figma *Input* / Textarea (389-12330). Ограничение по высоте 140px — при превышении скролл. При error — иконка error_fill справа сверху и красная подпись.
            </p>
            <div className="components-grid">
              <div className="components-swatch">
                <Textarea placeholder="Placeholder" />
                <div className="components-swatch__label">default</div>
              </div>
              <div className="components-swatch">
                <Textarea placeholder="Large" size="lg" />
                <div className="components-swatch__label">size=&quot;large&quot;</div>
              </div>
              <div className="components-swatch">
                <Textarea placeholder="Disabled" disabled />
                <div className="components-swatch__label">disabled</div>
              </div>
              <div className="components-swatch">
                <Textarea
                  placeholder="Error"
                  error="Ошибка"
                  caption="This is a caption under a text input."
                />
                <div className="components-swatch__label">status=&quot;error&quot;, caption</div>
              </div>
              <div className="components-swatch">
                <Textarea
                  defaultValue="We'd love to offer you a free Quarter subscription to explore our library (it includes includes 5,000+ assets, mockup-online service, and a Figma plugin). In exchange, we'd truly appreciate your honest feedback! Just a few quick notes on what you love and"
                  error="Ошибка"
                  caption="This is a caption under a text input."
                />
                <div className="components-swatch__label">длинный текст, max-height 140px + scroll, error</div>
              </div>
            </div>
          </section>

          {/* Input Select */}
          <section className="components-section">
            <h2 className="components-section__title text-heading-2">Input (Select)</h2>
            <p className="components-section__description text-sm-primary-normal">
              Поле-триггер выбора. Figma Select Input (415:57). Status: default | error; Size: default | large; Type: basic | multiple. Иконка arrow_down справа.
            </p>
            <div className="components-subtitle text-sm-primary-normal">Basic и размеры</div>
            <div className="components-grid">
              <div className="components-swatch">
                <InputSelect placeholder="Выберите..." onClick={() => {}} />
                <div className="components-swatch__label">placeholder, size=&quot;default&quot;</div>
              </div>
              <div className="components-swatch">
                <InputSelect placeholder="Выберите..." size="large" onClick={() => {}} />
                <div className="components-swatch__label">size=&quot;large&quot;</div>
              </div>
              <div className="components-swatch">
                <InputSelect
                  placeholder="Выберите..."
                  value="1"
                  valueLabel="Первый вариант"
                  options={[{ value: "1", label: "Первый вариант" }, { value: "2", label: "Второй вариант" }]}
                  onClick={() => {}}
                />
                <div className="components-swatch__label">value + valueLabel (filled)</div>
              </div>
              <div className="components-swatch">
                <InputSelect placeholder="Выберите..." disabled onClick={() => {}} />
                <div className="components-swatch__label">disabled</div>
              </div>
              <div className="components-swatch">
                <InputSelect placeholder="Выберите..." status="error" onClick={() => {}} />
                <div className="components-swatch__label">status=&quot;error&quot;</div>
              </div>
              <div className="components-swatch">
                <InputSelect
                  placeholder="Выберите..."
                  status="error"
                  caption="Обязательное поле"
                  onClick={() => {}}
                />
                <div className="components-swatch__label">status=&quot;error&quot;, caption</div>
              </div>
            </div>
            <div className="components-subtitle text-sm-primary-normal">Multiple</div>
            <div className="components-grid">
              <div className="components-swatch">
                <InputSelect
                  mode="multiple"
                  placeholder="Выберите несколько..."
                  value={["a", "b"]}
                  valueLabel={["Вариант А", "Вариант Б"]}
                  onClick={() => {}}
                />
                <div className="components-swatch__label">mode=&quot;multiple&quot;, value + valueLabel</div>
              </div>
            </div>
          </section>

          {/* Checkbox */}
          <section className="components-section">
            <h2 className="components-section__title text-heading-2">Checkbox</h2>
            <p className="components-section__description text-sm-primary-normal">
              Состояния чекбокса: unchecked, checked, indeterminate, disabled; размеры default и large.
            </p>
            <div className="components-grid">
              <div className="components-swatch">
                <Checkbox label="Default" checked={false} onCheckedChange={() => {}} />
                <div className="components-swatch__label">
                  size=&quot;default&quot;, unchecked
                </div>
              </div>
              <div className="components-swatch">
                <Checkbox label="Checked" checked onCheckedChange={() => {}} />
                <div className="components-swatch__label">
                  size=&quot;default&quot;, checked
                </div>
              </div>
              <div className="components-swatch">
                <Checkbox label="Indeterminate" checked="indeterminate" onCheckedChange={() => {}} />
                <div className="components-swatch__label">size=&quot;default&quot;, indeterminate</div>
              </div>
              <div className="components-swatch">
                <Checkbox label="Disabled" checked={false} disabled onCheckedChange={() => {}} />
                <div className="components-swatch__label">
                  size=&quot;default&quot;, disabled
                </div>
              </div>
              <div className="components-swatch">
                <Checkbox label="Large checked" size="lg" checked onCheckedChange={() => {}} />
                <div className="components-swatch__label">
                  size=&quot;large&quot;, checked
                </div>
              </div>
              <div className="components-swatch">
                <Checkbox label="Large disabled" size="lg" checked disabled onCheckedChange={() => {}} />
                <div className="components-swatch__label">
                  size=&quot;large&quot;, checked, disabled
                </div>
              </div>
            </div>

            <div className="components-subtitle text-sm-primary-normal">Состояния (эмуляция hover/active)</div>
            <div className="components-state-row">
              <div className="components-state-row__label text-sm-primary-normal">Default checkbox</div>
              <div className="components-state-row__cells">
                <div className="components-swatch">
                  <Checkbox checked={false} onCheckedChange={() => {}} />
                  <div className="components-swatch__label">state=&quot;default&quot;</div>
                </div>
                <div className="components-swatch components-demo-checkbox--hover">
                  <Checkbox checked={false} onCheckedChange={() => {}} />
                  <div className="components-swatch__label">state=&quot;hover&quot; (эмулируется)</div>
                </div>
                <div className="components-swatch components-demo-checkbox--active">
                  <Checkbox checked={false} onCheckedChange={() => {}} />
                  <div className="components-swatch__label">state=&quot;active&quot; (эмулируется)</div>
                </div>
              </div>
            </div>

            <div className="components-state-row">
              <div className="components-state-row__label text-sm-primary-normal">Checked checkbox</div>
              <div className="components-state-row__cells">
                <div className="components-swatch">
                  <Checkbox checked onCheckedChange={() => {}} />
                  <div className="components-swatch__label">state=&quot;checked&quot;</div>
                </div>
                <div className="components-swatch components-demo-checkbox--checked-hover">
                  <Checkbox checked onCheckedChange={() => {}} />
                  <div className="components-swatch__label">
                    state=&quot;checked+hover&quot; (эмулируется)
                  </div>
                </div>
                <div className="components-swatch components-demo-checkbox--checked-active">
                  <Checkbox checked onCheckedChange={() => {}} />
                  <div className="components-swatch__label">
                    state=&quot;checked+active&quot; (эмулируется)
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tag */}
          <section className="components-section">
            <h2 className="components-section__title text-heading-2">Tag</h2>
            <p className="components-section__description text-sm-primary-normal">
              Preset-цвета Tag: Blue, Cyan, Geekblue, Gold, Green, Lime, Magenta, Orange, Purple, Red, Volcano, Gray.
            </p>
            <div className="components-grid">
              {TAG_PRESETS.map((preset) => (
                <div key={preset} className="components-swatch">
                  <Tag preset={preset}>{preset}</Tag>
                  <div className="components-swatch__label">preset=&quot;{preset}&quot;</div>
                </div>
              ))}
            </div>
          </section>

          {/* Segment */}
          <section className="components-section">
            <h2 className="components-section__title text-heading-2">Segment</h2>
            <p className="components-section__description text-sm-primary-normal">
              Табы статусов с активным и неактивными элементами. Оси: size, block, disabled, иконки, active tab.
            </p>

            <div className="components-subtitle text-sm-primary-normal">Интерактивный пример</div>
            <div className="components-grid">
              <div className="components-swatch">
                <Segments value={segmentValue} onValueChange={setSegmentValue}>
                  {SEGMENT_ITEMS.map((i) => (
                    <SegmentItem key={i.value} value={i.value}>{i.label}</SegmentItem>
                  ))}
                </Segments>
                <div className="components-swatch__label">
                  activeValue=&quot;{segmentValue}&quot; (кликабельно)
                </div>
              </div>
            </div>

            <div className="components-subtitle text-sm-primary-normal">Все варианты активного таба</div>
            <div className="components-grid">
              <div className="components-swatch">
                <Segments value="all" onValueChange={() => {}}>
                  {SEGMENT_ITEMS.map((i) => (
                    <SegmentItem key={i.value} value={i.value}>{i.label}</SegmentItem>
                  ))}
                </Segments>
                <div className="components-swatch__label">activeValue=&quot;all&quot; (первый)</div>
              </div>
              <div className="components-swatch">
                <Segments value="active" onValueChange={() => {}}>
                  {SEGMENT_ITEMS.map((i) => (
                    <SegmentItem key={i.value} value={i.value}>{i.label}</SegmentItem>
                  ))}
                </Segments>
                <div className="components-swatch__label">activeValue=&quot;active&quot; (средний)</div>
              </div>
              <div className="components-swatch">
                <Segments value="draft" onValueChange={() => {}}>
                  {SEGMENT_ITEMS.map((i) => (
                    <SegmentItem key={i.value} value={i.value}>{i.label}</SegmentItem>
                  ))}
                </Segments>
                <div className="components-swatch__label">activeValue=&quot;draft&quot; (последний)</div>
              </div>
            </div>

            <div className="components-subtitle text-sm-primary-normal">Размеры и block</div>
            <div className="components-grid">
              <div className="components-swatch">
                <Segments size="default" value="all" onValueChange={() => {}}>
                  {SEGMENT_ITEMS.map((i) => (
                    <SegmentItem key={i.value} value={i.value}>{i.label}</SegmentItem>
                  ))}
                </Segments>
                <div className="components-swatch__label">size=&quot;default&quot;, block=false</div>
              </div>
              <div className="components-swatch">
                <Segments size="lg" value="all" onValueChange={() => {}}>
                  {SEGMENT_ITEMS.map((i) => (
                    <SegmentItem key={i.value} value={i.value}>{i.label}</SegmentItem>
                  ))}
                </Segments>
                <div className="components-swatch__label">size=&quot;large&quot;, block=false</div>
              </div>
              <div className="components-swatch">
                <Segments size="default" value="active" onValueChange={() => {}}>
                  {SEGMENT_ITEMS.map((i) => (
                    <SegmentItem key={i.value} value={i.value}>{i.label}</SegmentItem>
                  ))}
                </Segments>
                <div className="components-swatch__label">size=&quot;default&quot;, block=true</div>
              </div>
              <div className="components-swatch">
                <Segments size="lg" value="active" onValueChange={() => {}}>
                  {SEGMENT_ITEMS.map((i) => (
                    <SegmentItem key={i.value} value={i.value}>{i.label}</SegmentItem>
                  ))}
                </Segments>
                <div className="components-swatch__label">size=&quot;large&quot;, block=true</div>
              </div>
            </div>

            <div className="components-subtitle text-sm-primary-normal">Disabled (общий и по пунктам)</div>
            <div className="components-grid">
              <div className="components-swatch">
                <Segments value="all" onValueChange={() => {}} disabled>
                  {SEGMENT_ITEMS.map((i) => (
                    <SegmentItem key={i.value} value={i.value}>{i.label}</SegmentItem>
                  ))}
                </Segments>
                <div className="components-swatch__label">disabled=true (все пункты недоступны)</div>
              </div>
              <div className="components-swatch">
                <Segments value="draft" onValueChange={() => {}}>
                  <SegmentItem value="all">Все</SegmentItem>
                  <SegmentItem value="active" disabled>Активные</SegmentItem>
                  <SegmentItem value="draft">Черновики</SegmentItem>
                </Segments>
                <div className="components-swatch__label">
                  items[1].disabled=true (средний пункт выключен)
                </div>
              </div>
            </div>

            <div className="components-subtitle text-sm-primary-normal">Иконки в табах</div>
            <div className="components-grid">
              <div className="components-swatch">
                <Segments value="active" onValueChange={() => {}}>
                  <SegmentItem value="all" icon="info_fill">Все</SegmentItem>
                  <SegmentItem value="active" icon="check_circle_fill">Активные</SegmentItem>
                  <SegmentItem value="draft" icon="time">Черновики</SegmentItem>
                </Segments>
                <div className="components-swatch__label">icon: info_fill / check_circle_fill / time</div>
              </div>
            </div>
          </section>

          {/* Radio */}
          <section className="components-section">
            <h2 className="components-section__title text-heading-2">Radio</h2>
            <p className="components-section__description text-sm-primary-normal">
              Группа радио-кнопок (Primary). Переключение активного пункта через value/onChange.
            </p>
            <div className="components-grid">
              <div className="components-swatch">
                <RadioGroup value={radioValue} onValueChange={setRadioValue}>
                  {RADIO_OPTIONS.map((opt) => (
                    <Radio key={opt.value} value={opt.value} label={opt.label} />
                  ))}
                </RadioGroup>
                <div className="components-swatch__label">
                  value=&quot;{radioValue}&quot; (кликабельно, стрелки для навигации)
                </div>
              </div>
              <div className="components-swatch">
                <RadioGroup value="single" onValueChange={() => {}}>
                  <Radio value="single" label="Один пункт" />
                </RadioGroup>
                <div className="components-swatch__label">Один пункт (как в reference)</div>
              </div>
              <div className="components-swatch">
                <RadioGroup value={radioValue} onValueChange={setRadioValue} size="lg">
                  {RADIO_OPTIONS.map((opt) => (
                    <Radio key={opt.value} value={opt.value} label={opt.label} size="lg" />
                  ))}
                </RadioGroup>
                <div className="components-swatch__label">size=&quot;lg&quot;</div>
              </div>
            </div>
          </section>

          {/* NavButton */}
          <section className="components-section">
            <h2 className="components-section__title text-heading-2">NavButton</h2>
            <p className="components-section__description text-sm-primary-normal">
              Пункты бокового меню: обычный, активный и &quot;sub&quot;.
            </p>
            <div className="components-grid">
              <div className="components-swatch">
                <NavButton>Обычный пункт</NavButton>
                <div className="components-swatch__label">active=false, sub=false</div>
              </div>
              <div className="components-swatch">
                <NavButton active>Активный пункт</NavButton>
                <div className="components-swatch__label">active=true, sub=false</div>
              </div>
              <div className="components-swatch">
                <NavButton sub>Sub-пункт</NavButton>
                <div className="components-swatch__label">active=false, sub=true</div>
              </div>
            </div>

            <div className="components-subtitle text-sm-primary-normal">Состояния (эмуляция hover)</div>
            <div className="components-state-row">
              <div className="components-state-row__label text-sm-primary-normal">Default пункт</div>
              <div className="components-state-row__cells">
                <div className="components-swatch">
                  <NavButton>Default</NavButton>
                  <div className="components-swatch__label">state=&quot;default&quot;</div>
                </div>
                <div className="components-swatch components-demo-nav--hover">
                  <NavButton>Hover</NavButton>
                  <div className="components-swatch__label">state=&quot;hover&quot; (эмулируется)</div>
                </div>
                <div className="components-swatch">
                  <NavButton active>Active</NavButton>
                  <div className="components-swatch__label">state=&quot;active&quot;</div>
                </div>
              </div>
            </div>
          </section>

          {/* ActionsPanel */}
          <section className="components-section">
            <h2 className="components-section__title text-heading-2">ActionsPanel</h2>
            <p className="components-section__description text-sm-primary-normal">
              Панель действий над таблицей с блоком сводки и без него.
            </p>
            <div className="components-grid components-grid--column">
              <div className="components-swatch components-swatch--fullwidth">
                <ActionsPanel
                  summary={{
                    text: "3 задания",
                    sum: "33 732 ₽",
                    onClose: () => {},
                  }}
                  rightSlot={<Button variant="default">Выбрать все</Button>}
                >
                  <Button variant="primary">Отправить</Button>
                  <Button variant="default">Завершить</Button>
                  <Button variant="default" icon="ArrowDownIcon" iconPosition="end">
                    Создать акт
                  </Button>
                </ActionsPanel>
                <div className="components-swatch__label">summary=&#123;...&#125;, rightSlot, children</div>
              </div>

              <div className="components-swatch components-swatch--fullwidth">
                <ActionsPanel rightSlot={<Button variant="default">Выбрать все</Button>}>
                  <Button variant="primary">Действие</Button>
                </ActionsPanel>
                <div className="components-swatch__label">summary=null, только actions + rightSlot</div>
              </div>
            </div>
          </section>

          {/* Toast */}
          <section className="components-section">
            <h2 className="components-section__title text-heading-2">Toast</h2>
            <p className="components-section__description text-sm-primary-normal">
              Figma *Toast* (421:14564). Типы: normal, warning, success, error, loading. Контейнер всегда по центру экрана, макс. ширина 500px, отступ сверху 20px.
            </p>
            <div className="components-subtitle text-sm-primary-normal">Варианты type</div>
            <div className="components-grid">
              <div className="components-swatch">
                <Toast type="normal" message="Message" />
                <div className="components-swatch__label">type=&quot;normal&quot;</div>
              </div>
              <div className="components-swatch">
                <Toast type="success" message="Сохранено" />
                <div className="components-swatch__label">type=&quot;success&quot;</div>
              </div>
              <div className="components-swatch">
                <Toast type="warning" message="Внимание" />
                <div className="components-swatch__label">type=&quot;warning&quot;</div>
              </div>
              <div className="components-swatch">
                <Toast type="error" message="Ошибка" />
                <div className="components-swatch__label">type=&quot;error&quot;</div>
              </div>
              <div className="components-swatch">
                <Toast type="loading" message="Загрузка…" />
                <div className="components-swatch__label">type=&quot;loading&quot;</div>
              </div>
            </div>
          </section>

          {/* Alert */}
          <section className="components-section">
            <h2 className="components-section__title text-heading-2">Alert</h2>
            <p className="components-section__description text-sm-primary-normal">
              Уведомления: error, info, success, warning. Опционально title, description, action, closable.
            </p>
            <div className="components-grid components-grid--column">
              <div className="components-swatch components-swatch--fullwidth">
                <Alert variant="error" title="Ошибка" description="Описание ошибки" closable onClose={() => {}} />
                <div className="components-swatch__label">variant=&quot;error&quot;, closable</div>
              </div>
              <div className="components-swatch components-swatch--fullwidth">
                <Alert variant="info" title="Информация" description="Информационное сообщение." />
                <div className="components-swatch__label">variant=&quot;info&quot;</div>
              </div>
              <div className="components-swatch components-swatch--fullwidth">
                <Alert variant="success" title="Успех" description="Операция выполнена." />
                <div className="components-swatch__label">variant=&quot;success&quot;</div>
              </div>
              <div className="components-swatch components-swatch--fullwidth">
                <Alert variant="warning" title="Внимание" description="Проверьте данные." />
                <div className="components-swatch__label">variant=&quot;warning&quot;</div>
              </div>
            </div>
          </section>

          {/* Banner */}
          <section className="components-section">
            <h2 className="components-section__title text-heading-2">Banner</h2>
            <p className="components-section__description text-sm-primary-normal">
              Баннер с цветом (gold, green, purple, red), заголовком, описанием и действиями.
            </p>
            <div className="components-grid components-grid--column">
              <div className="components-swatch components-swatch--fullwidth">
                <Banner
                  color="purple"
                  title="Заголовок баннера"
                  description="Краткое описание или призыв к действию."
                  actions={<Button variant="primary" size="sm">Действие</Button>}
                  onClose={() => {}}
                />
                <div className="components-swatch__label">color=&quot;purple&quot;</div>
              </div>
              <div className="components-swatch components-swatch--fullwidth">
                <Banner color="green" title="Успех" description="Всё готово." onClose={() => {}} />
                <div className="components-swatch__label">color=&quot;green&quot;</div>
              </div>
            </div>
          </section>

          {/* Avatar */}
          <section className="components-section">
            <h2 className="components-section__title text-heading-2">Avatar</h2>
            <p className="components-section__description text-sm-primary-normal">
              Аватар: Image или Fallback (инициалы). Размеры small, default, large, extra. Shape: circle, square.
            </p>
            <div className="components-grid">
              <div className="components-swatch">
                <Avatar size="default" shape="circle">
                  <AvatarFallback colorVariant="purple">АИ</AvatarFallback>
                </Avatar>
                <div className="components-swatch__label">Fallback, circle, purple</div>
              </div>
              <div className="components-swatch">
                <Avatar size="large" shape="circle">
                  <AvatarFallback colorVariant="blue">ИК</AvatarFallback>
                </Avatar>
                <div className="components-swatch__label">size=&quot;large&quot;, blue</div>
              </div>
              <div className="components-swatch">
                <Avatar size="default" shape="square">
                  <AvatarFallback colorVariant="volcano">К</AvatarFallback>
                </Avatar>
                <div className="components-swatch__label">square, volcano</div>
              </div>
              <div className="components-swatch">
                <Avatar size="small" shape="circle">
                  <AvatarFallback colorVariant="magenta">M</AvatarFallback>
                </Avatar>
                <div className="components-swatch__label">size=&quot;small&quot;</div>
              </div>
            </div>
          </section>

          {/* Switch */}
          <section className="components-section">
            <h2 className="components-section__title text-heading-2">Switch</h2>
            <p className="components-section__description text-sm-primary-normal">
              Переключатель. Размеры md, lg. Состояния: default, checked, disabled, loading.
            </p>
            <div className="components-grid">
              <div className="components-swatch">
                <Switch checked={switchChecked} onCheckedChange={setSwitchChecked} />
                <div className="components-swatch__label">controlled, checked={String(switchChecked)}</div>
              </div>
              <div className="components-swatch">
                <Switch checked={false} onCheckedChange={() => {}} />
                <div className="components-swatch__label">unchecked</div>
              </div>
              <div className="components-swatch">
                <Switch checked size="lg" onCheckedChange={() => {}} />
                <div className="components-swatch__label">size=&quot;lg&quot;, checked</div>
              </div>
              <div className="components-swatch">
                <Switch checked={false} disabled onCheckedChange={() => {}} />
                <div className="components-swatch__label">disabled</div>
              </div>
              <div className="components-swatch">
                <Switch label="С подписью" checked={false} onCheckedChange={() => {}} />
                <div className="components-swatch__label">label</div>
              </div>
            </div>
          </section>

          {/* Tabs */}
          <section className="components-section">
            <h2 className="components-section__title text-heading-2">Tabs</h2>
            <p className="components-section__description text-sm-primary-normal">
              Вкладки. Tabs (Root) + TabsList + TabsTrigger + TabsContent.
            </p>
            <div className="components-grid components-grid--column">
              <div className="components-swatch components-swatch--fullwidth">
                <Tabs value={tabsValue} onValueChange={setTabsValue}>
                  <TabsList size="md">
                    <TabsTrigger value="tab1">Вкладка 1</TabsTrigger>
                    <TabsTrigger value="tab2">Вкладка 2</TabsTrigger>
                    <TabsTrigger value="tab3">Вкладка 3</TabsTrigger>
                  </TabsList>
                  <TabsContent value="tab1">Контент первой вкладки.</TabsContent>
                  <TabsContent value="tab2">Контент второй вкладки.</TabsContent>
                  <TabsContent value="tab3">Контент третьей вкладки.</TabsContent>
                </Tabs>
                <div className="components-swatch__label">value=&quot;{tabsValue}&quot;</div>
              </div>
            </div>
          </section>

          {/* Dropdown */}
          <section className="components-section">
            <h2 className="components-section__title text-heading-2">Dropdown</h2>
            <p className="components-section__description text-sm-primary-normal">
              Выпадающее меню: Dropdown + DropdownTrigger + DropdownContent + DropdownItem, DropdownSeparator.
            </p>
            <div className="components-grid">
              <div className="components-swatch">
                <Dropdown>
                  <DropdownTrigger asChild>
                    <Button variant="default">Открыть меню</Button>
                  </DropdownTrigger>
                  <DropdownContent>
                    <DropdownItem onClick={() => {}}>Пункт 1</DropdownItem>
                    <DropdownItem onClick={() => {}}>Пункт 2</DropdownItem>
                    <DropdownSeparator />
                    <DropdownItem danger onClick={() => {}}>Удалить</DropdownItem>
                  </DropdownContent>
                </Dropdown>
                <div className="components-swatch__label">Basic + danger item</div>
              </div>
            </div>
          </section>

          {/* Pagination */}
          <section className="components-section">
            <h2 className="components-section__title text-heading-2">Pagination</h2>
            <p className="components-section__description text-sm-primary-normal">
              Пагинация: current, total, pageSize, onChange. hideOnSinglePage.
            </p>
            <div className="components-grid">
              <div className="components-swatch">
                <Pagination
                  current={paginationCurrent}
                  total={50}
                  pageSize={10}
                  onChange={(page) => setPaginationCurrent(page)}
                  hideOnSinglePage={false}
                />
                <div className="components-swatch__label">total=50, current={paginationCurrent}</div>
              </div>
              <div className="components-swatch">
                <Pagination current={1} total={100} pageSize={10} onChange={() => {}} />
                <div className="components-swatch__label">total=100</div>
              </div>
            </div>
          </section>

          {/* Table */}
          <section className="components-section">
            <h2 className="components-section__title text-heading-2">Table</h2>
            <p className="components-section__description text-sm-primary-normal">
              Базовая таблица и компактная таблица со зеброй и сортировкой.
            </p>

            <div className="components-subtitle text-sm-primary-normal">
              size=&quot;default&quot;, striped=false
            </div>
            <div className="components-swatch components-swatch--fullwidth">
              <Table>
                <TableHeader
                  columns={TABLE_DEMO_COLUMNS}
                  sortKey={null}
                  sortOrder="asc"
                  onSort={undefined}
                />
                <tbody>
                  {TABLE_DEMO_ROWS.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell type="item" columnKey="name">
                        {row.name}
                      </TableCell>
                      <TableCell type="item" columnKey="role" muted>
                        {row.role}
                      </TableCell>
                      <TableCell type="item" columnKey="status">
                        <Tag preset={row.status === "Активен" ? "green" : row.status === "Черновик" ? "gray" : "red"}>
                          {row.status}
                        </Tag>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
              <div className="components-swatch__label">
                Table: size=&quot;default&quot;, striped=false
              </div>
            </div>

            <div className="components-subtitle text-sm-primary-normal">
              size=&quot;compact&quot;, striped=true, sortKey=&quot;name&quot;
            </div>
            <div className="components-swatch components-swatch--fullwidth">
              <Table size="compact" striped>
                <TableHeader
                  columns={TABLE_DEMO_COLUMNS}
                  sortKey="name"
                  sortOrder="asc"
                  onSort={() => {}}
                />
                <tbody>
                  {TABLE_DEMO_ROWS.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell type="item" columnKey="name">
                        {row.name}
                      </TableCell>
                      <TableCell type="item" columnKey="role" muted>
                        {row.role}
                      </TableCell>
                      <TableCell type="item" columnKey="status">
                        <Tag preset={row.status === "Активен" ? "green" : row.status === "Черновик" ? "gray" : "red"}>
                          {row.status}
                        </Tag>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
              <div className="components-swatch__label">
                Table: size=&quot;compact&quot;, striped=true, сортировка по &quot;name&quot;
              </div>
            </div>

            <div className="components-subtitle text-sm-primary-normal">Состояния строк (эмуляция hover/selected)</div>
            <div className="components-grid components-grid--column">
              <div className="components-swatch components-swatch--fullwidth components-demo-table--hover">
                <Table size="compact">
                  <TableHeader
                    columns={TABLE_DEMO_COLUMNS}
                    sortKey={null}
                    sortOrder="asc"
                    onSort={undefined}
                  />
                  <tbody>
                    {TABLE_DEMO_ROWS.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell type="item" columnKey="name">
                          {row.name}
                        </TableCell>
                        <TableCell type="item" columnKey="role" muted>
                          {row.role}
                        </TableCell>
                        <TableCell type="item" columnKey="status">
                          <Tag preset={row.status === "Активен" ? "green" : row.status === "Черновик" ? "gray" : "red"}>
                            {row.status}
                          </Tag>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </Table>
                <div className="components-swatch__label">
                  Первая строка: state=&quot;hover&quot; (эмулируется)
                </div>
              </div>

              <div className="components-swatch components-swatch--fullwidth components-demo-table--selected">
                <Table size="compact">
                  <TableHeader
                    columns={TABLE_DEMO_COLUMNS}
                    sortKey={null}
                    sortOrder="asc"
                    onSort={undefined}
                  />
                  <tbody>
                    {TABLE_DEMO_ROWS.map((row) => (
                      <TableRow key={row.id} selected={row.id === "1"}>
                        <TableCell type="item" columnKey="name">
                          {row.name}
                        </TableCell>
                        <TableCell type="item" columnKey="role" muted>
                          {row.role}
                        </TableCell>
                        <TableCell type="item" columnKey="status">
                          <Tag preset={row.status === "Активен" ? "green" : row.status === "Черновик" ? "gray" : "red"}>
                            {row.status}
                          </Tag>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </Table>
                <div className="components-swatch__label">
                  Первая строка: selected (TableRow selected=true)
                </div>
              </div>

              <div className="components-swatch components-swatch--fullwidth components-demo-table--selected-hover">
                <Table size="compact">
                  <TableHeader
                    columns={TABLE_DEMO_COLUMNS}
                    sortKey={null}
                    sortOrder="asc"
                    onSort={undefined}
                  />
                  <tbody>
                    {TABLE_DEMO_ROWS.map((row) => (
                      <TableRow key={row.id} selected={row.id === "1"}>
                        <TableCell type="item" columnKey="name">
                          {row.name}
                        </TableCell>
                        <TableCell type="item" columnKey="role" muted>
                          {row.role}
                        </TableCell>
                        <TableCell type="item" columnKey="status">
                          <Tag preset={row.status === "Активен" ? "green" : row.status === "Черновик" ? "gray" : "red"}>
                            {row.status}
                          </Tag>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </Table>
                <div className="components-swatch__label">
                  Первая строка: selected + hover (эмулируется)
                </div>
              </div>
            </div>
          </section>

          {/* Icons */}
          <section className="components-section">
            <h2 className="components-section__title text-heading-2">Icon</h2>
            <p className="components-section__description text-sm-primary-normal">
              Все иконки из каталога src/ui/Icon (icon — PascalCase, например &quot;SearchIcon&quot;, &quot;CloseIcon&quot;).
            </p>
            <div className="components-grid components-grid--icons">
              {ICON_NAMES.map((iconKey) => (
                <div key={iconKey} className="components-swatch components-swatch--icon">
                  <span className="components-icon-preview">
                    <Icon icon={iconKey} />
                  </span>
                  <div className="components-swatch__label">icon=&quot;{iconKey}&quot;</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

