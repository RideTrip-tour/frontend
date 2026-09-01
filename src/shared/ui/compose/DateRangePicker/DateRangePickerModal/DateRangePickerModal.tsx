import style from './daterangepickermodal.module.scss'
import './variables.css'
import { useState, useEffect, useCallback, useMemo } from "react";
import type { SelectionTab } from '@/shared/ui/compose/DateRangePicker/types.ts'
import { MAX_FUTURE_MONTHS, MONTH_LABELS_RU } from '@/shared/ui/compose/DateRangePicker/constants.ts'
import { formatDisplayDate } from '@/shared/ui/compose/DateRangePicker/utils.ts'
import CalendarHeader
  from '@/shared/ui/compose/DateRangePicker/DateRangePickerModal/Calendar/CalendarHeader'
import DrumRoller
  from '@/shared/ui/compose/DateRangePicker/DateRangePickerModal/Calendar/CalendarHeader/DrumRoller'
import CalendarGrid
  from '@/shared/ui/compose/DateRangePicker/DateRangePickerModal/Calendar/CalendarGrid'

interface DateRangePickerModalProps {
  today: Date;
  initialFrom: Date | null;
  initialTo: Date | null;
  onRangeChange: (from: Date | null, to: Date | null) => void;
  onClose: () => void;
}

function DateRangePickerModal({
                                       today,
                                       initialFrom,
                                       initialTo,
                                       onRangeChange,
                                       onClose,
                                     }: DateRangePickerModalProps) {

  const [activeTab, setActiveTab] = useState<SelectionTab>("from");
  const [selectionFrom, setSelectionFrom] = useState<Date | null>(initialFrom);
  const [selectionTo, setSelectionTo] = useState<Date | null>(initialTo);

  const initialDisplayMonth = initialFrom?.getMonth() ?? today.getMonth();
  const initialDisplayYear = initialFrom?.getFullYear() ?? today.getFullYear();

  const [displayMonth, setDisplayMonth] = useState(initialDisplayMonth);
  const [displayYear, setDisplayYear] = useState(initialDisplayYear);
  const [showDrumPicker, setShowDrumPicker] = useState(false);

  const maxAllowedDate = useMemo(
    () => new Date(today.getFullYear(), today.getMonth() + MAX_FUTURE_MONTHS, 1),
    [today],
  );

  const isPrevMonthDisabled = useMemo(
    () => displayYear === today.getFullYear() && displayMonth === today.getMonth(),
    [displayYear, displayMonth, today],
  );

  const isNextMonthDisabled = useMemo(
    () => displayYear === maxAllowedDate.getFullYear() && displayMonth === maxAllowedDate.getMonth(),
    [displayYear, displayMonth, maxAllowedDate],
  );

  const availableYears = useMemo<string[]>(() => {
    const years = new Set<string>();

    for (let i = 0; i <= MAX_FUTURE_MONTHS; i++) {
      years.add(
        String(
          new Date(
            today.getFullYear(),
            today.getMonth() + i,
            1,
          ).getFullYear()
        )
      );
    }

    return [...years];
  }, [today]);

  const selectedYearDrumIndex = useMemo(
    () => Math.max(0, availableYears.indexOf(String(displayYear))),
    [availableYears, displayYear],
  );

  const monthDrumMinIndex = useMemo(
    () => displayYear === today.getFullYear() ? today.getMonth() : 0,
    [displayYear, today],
  );

  const monthDrumMaxIndex = useMemo(
    () => displayYear === maxAllowedDate.getFullYear() ? maxAllowedDate.getMonth() : 11,
    [displayYear, maxAllowedDate],
  );

  useEffect(() => {
    onRangeChange(selectionFrom, selectionTo);
  }, [selectionFrom, selectionTo, onRangeChange]);

  const goToPrevMonth = useCallback(() => {
    if (isPrevMonthDisabled) return;

    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear((y) => y - 1);
    } else {
      setDisplayMonth((m) => m - 1);
    }
  }, [isPrevMonthDisabled, displayMonth]);

  const goToNextMonth = useCallback(() => {
    if (isNextMonthDisabled) return;

    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear((y) => y + 1);
    } else {
      setDisplayMonth((m) => m + 1);
    }
  }, [isNextMonthDisabled, displayMonth]);

  const handleDrumMonthChange = useCallback((monthIndex: number) => {
    setDisplayMonth(monthIndex);
  }, []);

  const handleDrumYearChange = useCallback((yearIndex: number) => {
    const newYear = parseInt(availableYears[yearIndex], 10);
    const minDate = new Date(today.getFullYear(), today.getMonth(), 1);

    let clampedMonth = displayMonth;

    const candidateDate = new Date(newYear, displayMonth, 1);

    if (candidateDate < minDate) {
      clampedMonth = today.getMonth();
    } else if (candidateDate > maxAllowedDate) {
      clampedMonth = maxAllowedDate.getMonth();
    }

    setDisplayYear(newYear);
    setDisplayMonth(clampedMonth);

  }, [availableYears, displayMonth, today, maxAllowedDate]);

  const handleDayClick = useCallback((clickedDate: Date) => {

    if (activeTab === "from") {

      setSelectionFrom(clickedDate);

      setSelectionTo((prevTo) =>
        prevTo && clickedDate <= prevTo ? prevTo : null
      );

      setActiveTab("to");

    } else {

      if (selectionFrom && clickedDate < selectionFrom) return;

      setSelectionTo(clickedDate);

    }

  }, [activeTab, selectionFrom]);

  const fromFormatted = selectionFrom
    ? formatDisplayDate(selectionFrom.getTime())
    : null;

  const toFormatted = selectionTo
    ? formatDisplayDate(selectionTo.getTime())
    : null;

  return (
    <div className={style.daterangepickermodal}>

      <div className={style.daterangepickermodal__tabs}>

        {(["from", "to"] as const).map((tab) => {

          const isActive = activeTab === tab;
          const tabLabel = tab === "from" ? "Когда" : "Обратно";
          const tabDateText = tab === "from" ? fromFormatted : toFormatted;

          const tabClass = [
            style.daterangepickermodal__tab,
            isActive && style['daterangepickermodal__tab--active']
          ].filter(Boolean).join(" ");

          const valueClass = [
            style.daterangepickermodal__tabValue,
            isActive && tabDateText && style['daterangepickermodal__tabValue--active'],
            !tabDateText && style['daterangepickermodal__tabValue--empty']
          ].filter(Boolean).join(" ");

          return (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={tabClass}
            >
              <div className={style.daterangepickermodal__tabLabel}>
                {tabLabel}
              </div>

              <div className={valueClass}>
                {tabDateText ?? "—"}
              </div>
            </div>
          );
        })}

        <button
          onClick={onClose}
          className={style.daterangepickermodal__okButton}
        >
          OK
        </button>

      </div>

      {showDrumPicker ? (

        <div>

          <div className={style.daterangepickermodal__drumHeader}>

            <span className={style.daterangepickermodal__drumTitle}>
              {MONTH_LABELS_RU[displayMonth]} {displayYear}
            </span>

            <button
              onClick={() => setShowDrumPicker(false)}
              className={style.daterangepickermodal__doneButton}
            >
              Готово
            </button>

          </div>

          <div className={style.daterangepickermodal__drums}>

            <div className={`${style.daterangepickermodal__drum} ${style['daterangepickermodal__drum--month']}`}>

              <div className={style.daterangepickermodal__drumLabel}>
                МЕСЯЦ
              </div>

              <DrumRoller
                items={MONTH_LABELS_RU}
                selectedIndex={displayMonth}
                minValidIndex={monthDrumMinIndex}
                maxValidIndex={monthDrumMaxIndex}
                onChange={handleDrumMonthChange}
              />

            </div>

            <div className={`${style.daterangepickermodal__drum} ${style['daterangepickermodal__drum--year']}`}>

              <div className={style.daterangepickermodal__drumLabel}>
                ГОД
              </div>

              <DrumRoller
                items={availableYears}
                selectedIndex={selectedYearDrumIndex}
                minValidIndex={0}
                maxValidIndex={availableYears.length - 1}
                onChange={handleDrumYearChange}
              />

            </div>

          </div>

        </div>

      ) : (

        <>
          <CalendarHeader
            displayYear={displayYear}
            displayMonth={displayMonth}
            isPrevMonthDisabled={isPrevMonthDisabled}
            isNextMonthDisabled={isNextMonthDisabled}
            onPrevMonth={goToPrevMonth}
            onNextMonth={goToNextMonth}
            onOpenDrumPicker={() => setShowDrumPicker(true)}
          />

          <CalendarGrid
            displayYear={displayYear}
            displayMonth={displayMonth}
            selectionFrom={selectionFrom}
            selectionTo={selectionTo}
            activeTab={activeTab}
            today={today}
            onDayClick={handleDayClick}
          />
        </>
      )}

    </div>
  );
}

export default DateRangePickerModal