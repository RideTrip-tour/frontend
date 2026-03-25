import style from './weekdayheadercell.module.scss'
import './variables.css'

export function WeekdayHeaderCell({ label }: { label: string }) {
  const isWeekend = label === "Сб" || label === "Вс";

  const className = [
    style.weekdayheadercell,
    isWeekend && style.weekend
  ].filter(Boolean).join(" ");

  return (
    <div className={className}>
      {label}
    </div>
  );
}