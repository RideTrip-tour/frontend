import { Icon } from '@iconify/react';

import type {
  FilterRelaxation,
  PartnerOffersMode,
  PartnerOffersStatus,
  RelaxableFilterKey,
} from '../../model/types';

import styles from './PartnerOffersNotices.module.scss';

export type SuggestedFilter = 'price' | 'dates' | 'accommodation' | 'transfer';

interface PartnerOffersNoticesProps {
  status: PartnerOffersStatus;
  mode: PartnerOffersMode;
  relaxations: readonly FilterRelaxation[];
  onRestoreFilter: (key: RelaxableFilterKey) => void;
  onRestoreAll: () => void;
  onEditFilter: (filter: SuggestedFilter) => void;
}

const suggestions: { key: SuggestedFilter; label: string }[] = [
  { key: 'price', label: 'Бюджет' },
  { key: 'dates', label: 'Даты поездки' },
  { key: 'accommodation', label: 'Тип проживания' },
  { key: 'transfer', label: 'Трансфер' },
];

export function PartnerOffersNotices({
  status,
  mode,
  relaxations,
  onRestoreFilter,
  onRestoreAll,
  onEditFilter,
}: PartnerOffersNoticesProps) {
  if (status === 'error' || mode !== 'similar') return null;

  return (
    <div className={styles.notices}>
      {relaxations.length > 0 && (
        <aside
          className={styles.relaxedNotice}
          aria-label="Изменённые условия поиска"
        >
          <div className={styles.noticeHeading}>
            <Icon
              className={styles.infoIcon}
              icon="material-symbols:info-rounded"
              aria-hidden="true"
            />
            <div>
              <h2>Немного изменили параметры, чтобы показать больше вариантов</h2>
              <p>
                На основе вашего запроса мы ослабили некоторые фильтры. Вы можете вернуть их обратно
                в любой момент.
              </p>
            </div>
          </div>
          <div className={styles.relaxedActions}>
            <div className={styles.chips}>
              {relaxations.map((relaxation) => (
                <div
                  className={styles.chip}
                  key={relaxation.key}
                >
                  <div>
                    <strong>{relaxation.label}</strong>
                    <span>{relaxation.description}</span>
                  </div>
                  <button
                    aria-label={`Вернуть исходный фильтр: ${relaxation.label}`}
                    className={styles.removeRelaxation}
                    onClick={() => onRestoreFilter(relaxation.key)}
                    type="button"
                  >
                    <Icon
                      icon="iconamoon:close"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              ))}
            </div>
            <button
              className={styles.restoreButton}
              onClick={onRestoreAll}
              type="button"
            >
              Вернуть все фильтры
              <Icon
                icon="solar:pen-bold"
                aria-hidden="true"
              />
            </button>
          </div>
        </aside>
      )}

      <aside
        className={styles.suggestionsNotice}
        aria-label="Как найти больше вариантов"
      >
        <div className={styles.noticeHeading}>
          <Icon
            className={styles.bulbIcon}
            icon="icons8:idea"
            aria-hidden="true"
          />
          <div>
            <h2>Хотите больше вариантов?</h2>
            <p>Попробуйте изменить один из параметров, которые чаще всего ограничивают поиск.</p>
          </div>
        </div>
        <div className={styles.suggestionActions}>
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.key}
              onClick={() => onEditFilter(suggestion.key)}
              type="button"
            >
              {suggestion.label}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
