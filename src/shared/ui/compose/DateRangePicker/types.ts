export interface DateRangeValue {
  fromTimestamp:  number | null;
  toTimestamp:    number | null;
  fromFormatted:  string | null;
  toFormatted:    string | null;
}

export type SelectionTab = "from" | "to";

export interface DayCellFlags {
  isToday:      boolean;
  isWeekend:    boolean;
  isDisabled:   boolean;
  isSelected:   boolean;
  isRangeStart: boolean;
  isRangeEnd:   boolean;
  isInRange:    boolean;
  isDimmed:     boolean;
}
