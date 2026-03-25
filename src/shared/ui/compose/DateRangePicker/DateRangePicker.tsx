import style from './daterangepicker.module.scss'
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { toMidnight, formatDisplayDate } from "./utils.ts";
import {
  DateRangePickerModal
} from '@/shared/ui/compose/DateRangePicker/DateRangePickerModal/DateRangePickerModal.tsx'

export default function DateRangePicker() {
  const today = useMemo(() => toMidnight(new Date()), []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [liveFrom,    setLiveFrom]    = useState<Date | null>(null);
  const [liveTo,      setLiveTo]      = useState<Date | null>(null);

  const triggerRef = useRef<HTMLDivElement>(null);
  const modalRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isModalOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        !triggerRef.current?.contains(target) &&
        !modalRef.current?.contains(target)
      ) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);

  }, [isModalOpen]);

  const handleRangeChange = useCallback(
    (newFrom: Date | null, newTo: Date | null) => {
      setLiveFrom(newFrom);
      setLiveTo(newTo);
    },
    [],
  );

  const triggerDisplayLabel = useMemo<string>(() => {

    if (!liveFrom) return "Выберите даты";

    const fromStr = formatDisplayDate(liveFrom.getTime());

    if (!liveTo) return fromStr;

    const toStr = formatDisplayDate(liveTo.getTime());

    if (fromStr === toStr) return `${fromStr} — только 1 день`;

    return `${fromStr} — ${toStr}`;

  }, [liveFrom, liveTo]);

  const hasSelection = liveFrom !== null;

  const triggerClass = [
    style.daterangepicker__trigger,
    isModalOpen && style['daterangepicker__trigger--open'],
    hasSelection && style['daterangepicker__trigger--selected']
  ].filter(Boolean).join(" ");

  return (
    <div className={style.daterangepicker}>

      <div
        ref={triggerRef}
        onClick={() => setIsModalOpen((prev) => !prev)}
        className={triggerClass}
      >

        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={style.daterangepicker__icon}
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8"  y1="2" x2="8"  y2="6" />
          <line x1="3"  y1="10" x2="21" y2="10" />
        </svg>

        {triggerDisplayLabel}

      </div>

      {isModalOpen && (
        <div
          ref={modalRef}
          className={style.daterangepicker__modal}
        >
          <DateRangePickerModal
            today={today}
            initialFrom={liveFrom}
            initialTo={liveTo}
            onRangeChange={handleRangeChange}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      )}

    </div>
  );
}