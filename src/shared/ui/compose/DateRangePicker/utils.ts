import { CALENDAR_GRID_ROWS } from "./constants.ts";

export function toMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function formatDisplayDate(timestamp: number): string {
  const d  = new Date(timestamp);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
}

export function areSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()
  );
}

/** Always 6×7 = 42 cells; null = empty padding cell */
export function buildCalendarCells(year: number, month: number): (Date | null)[] {
  const firstOfMonth = new Date(year, month, 1);
  const lastDayNum   = new Date(year, month + 1, 0).getDate();
  const rawDow       = firstOfMonth.getDay();
  const startOffset  = rawDow === 0 ? 6 : rawDow - 1;

  const totalCells   = CALENDAR_GRID_ROWS * 7;
  const cells: (Date | null)[] = new Array(totalCells).fill(null);
  for (let day = 1; day <= lastDayNum; day++) {
    cells[startOffset + day - 1] = new Date(year, month, day);
  }
  return cells;
}
