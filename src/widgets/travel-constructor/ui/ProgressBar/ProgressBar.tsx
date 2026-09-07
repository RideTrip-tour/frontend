import style from './ProgressBar.module.scss';
import {
  TOTAL_FIELDS,
  selectFilledCount,
  selectProgress,
  useConstructor,
} from '@/widgets/travel-constructor/model/constructorStore';

export function ProgressBar() {
  const filledCount = useConstructor(selectFilledCount);
  const progress = useConstructor(selectProgress);

  return (
    <section className={style.progressBar}>
      <div className={style.progressBar__header}>
        <h2 className={style.progressBar__title}>
          Конструктор путешествия
        </h2>
      </div>
      <div className={style.progressBar__content}>
        <div className={style.progressBar__track}>
          <div 
            className={style.progressBar__fill}
            style={{ width: `${progress}%` }}
          />
          <span className={style.progressBar__count}>
            {filledCount}/{TOTAL_FIELDS}
          </span>
        </div>

        <p className={style.progressBar__description}>
          Отпуск готов на {progress}%
        </p>
      </div>
    </section>
  );
}
