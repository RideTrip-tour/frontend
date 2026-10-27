import style from './weekdayheadercell.module.scss';


function WeekdayHeaderCell({ label }: Readonly<{ label: string }>) {
  const isWeekend = label === 'Сб' || label === 'Вс';

  const className = [style.weekdayheadercell, isWeekend && style.weekend].filter(Boolean).join(' ');

  return <div className={className}>{label}</div>;
}

export default WeekdayHeaderCell;

