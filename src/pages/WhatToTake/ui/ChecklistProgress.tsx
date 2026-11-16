import { Icon } from '@iconify/react';

import style from './ChecklistProgress.module.scss';

interface ChecklistProgressProps {
  checkedCount: number;
  totalCount: number;
  onReset: () => void;
}

export function ChecklistProgress({ checkedCount, totalCount, onReset }: ChecklistProgressProps) {
  const progress = totalCount === 0 ? 0 : Math.round((checkedCount / totalCount) * 100);

  return (
    <div className={style.root}>
      <div
        className={style.track}
        role="progressbar"
        aria-label="Прогресс сборов"
        aria-valuemin={0}
        aria-valuemax={totalCount}
        aria-valuenow={checkedCount}
      >
        <span
          className={style.value}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className={style.text}>
        Ваш список {checkedCount} из {totalCount}
      </p>
      <div className={style.actions}>
        <span>Прогресс сохраняется в вашем профиле</span>
        <button
          type="button"
          className={style.resetButton}
          onClick={onReset}
        >
          Сбросить
          <Icon icon="solar:restart-bold" />
        </button>
      </div>
    </div>
  );
}
