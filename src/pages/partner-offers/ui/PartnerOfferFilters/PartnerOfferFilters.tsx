import { Icon } from '@iconify/react';
import clsx from 'clsx';

import { formatSimilarResultCount } from '../../lib/formatters';
import type { PartnerOffersMode, PartnerOffersStatus } from '../../model/types';

import styles from './PartnerOfferFilters.module.scss';

export type SortOption = 'recommended' | 'price' | 'rating';

interface PartnerOfferFiltersProps {
  status: PartnerOffersStatus;
  mode: PartnerOffersMode;
  totalCount: number;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const filters = ['Цена', 'Проживание', 'Рейтинг', 'Трансфер'];

export function PartnerOfferFilters({
  status,
  mode,
  totalCount,
  sort,
  onSortChange,
}: PartnerOfferFiltersProps) {
  if (status === 'error') return null;

  return (
    <div className={clsx(styles.resultsHeader, mode === 'similar' && styles.similarResultsHeader)}>
      {(mode === 'similar' || status === 'empty') &&
        (status === 'loading' ? (
          <div
            aria-hidden="true"
            className={styles.resultsTitlePlaceholder}
          />
        ) : (
          <h2 className={styles.resultsTitle}>Мы нашли {formatSimilarResultCount(totalCount)}</h2>
        ))}
      <div className={styles.toolbar}>
        <div className={styles.filterGroup}>
          <button
            className={clsx(styles.filterButton, styles.filterButtonPrimary)}
            type="button"
          >
            <Icon
              aria-hidden="true"
              className={styles.filterButtonIcon}
              icon="mage:filter-fill"
            />
            Фильтры
          </button>
          {filters.map((filter) => (
            <button
              className={styles.filterButton}
              key={filter}
              type="button"
            >
              {filter}
              <Icon
                aria-hidden="true"
                className={styles.filterButtonIcon}
                icon="iconamoon:arrow-down-2"
              />
            </button>
          ))}
        </div>
        <label className={styles.sortLabel}>
          <span className={styles.visuallyHidden}>Сортировка вариантов</span>
          <select
            aria-label="Сортировка вариантов"
            onChange={(event) => onSortChange(event.target.value as SortOption)}
            value={sort}
          >
            <option value="recommended">Сначала лучшие</option>
            <option value="price">Сначала дешевле</option>
            <option value="rating">По рейтингу</option>
          </select>
        </label>
      </div>
    </div>
  );
}
