/**
 * Конвертация дат для полей даты в формате input[type="date"] (YYYY-MM-DD)
 * и отображаемого формата в таблицах ("14 мар.", "14.03.2025").
 */

const RU_SHORT_MONTHS = [
  "янв.", "фев.", "мар.", "апр.", "май", "июн.",
  "июл.", "авг.", "сен.", "окт.", "нояб.", "дек.",
];

const ISO_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;
const DDMMYYYY_REGEX = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;

/**
 * Парсит строку даты в ISO (YYYY-MM-DD) для value input[type="date"].
 * Поддерживает: "2025-03-14", "14.03.2025", "14 мар." (год — текущий).
 * @param {string} str
 * @returns {string} "YYYY-MM-DD" или "" если не удалось распарсить
 */
export function parseDisplayDateToISO(str) {
  if (!str || typeof str !== "string") return "";
  const s = str.trim();
  if (!s) return "";

  let year, month, day;

  const isoMatch = s.match(ISO_REGEX);
  if (isoMatch) {
    return s;
  }

  const dmyMatch = s.match(DDMMYYYY_REGEX);
  if (dmyMatch) {
    day = parseInt(dmyMatch[1], 10);
    month = parseInt(dmyMatch[2], 10);
    year = parseInt(dmyMatch[3], 10);
  } else {
    const parts = s.split(/\s+/);
    const dayPart = parts[0];
    const monthPart = parts[1];
    if (!dayPart || !monthPart) return "";
    day = parseInt(dayPart.replace(/\D/g, ""), 10);
    if (Number.isNaN(day) || day < 1 || day > 31) return "";
    const monthIndex = RU_SHORT_MONTHS.findIndex(
      (m) => monthPart.toLowerCase().startsWith(m.toLowerCase())
    );
    if (monthIndex === -1) return "";
    month = monthIndex + 1;
    year = new Date().getFullYear();
  }

  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) return "";
  const d = new Date(year, month - 1, day);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

/**
 * Форматирует ISO дату (YYYY-MM-DD) в короткий вид для отображения: "14 мар.".
 * @param {string} iso "YYYY-MM-DD"
 * @returns {string}
 */
export function formatISODateToDisplay(iso) {
  if (!iso || typeof iso !== "string") return "";
  const m = iso.match(ISO_REGEX);
  if (!m) return iso;
  const [, y, mo, d] = m;
  const date = new Date(parseInt(y, 10), parseInt(mo, 10) - 1, parseInt(d, 10));
  if (Number.isNaN(date.getTime())) return iso;
  const day = date.getDate();
  const month = RU_SHORT_MONTHS[date.getMonth()];
  return `${day} ${month}`;
}
