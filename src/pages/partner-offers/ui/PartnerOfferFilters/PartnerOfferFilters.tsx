import { Icon } from '@iconify/react';
import clsx from 'clsx';

import { FilterButton, FiltersToolbar, SortSelect } from '@/shared/ui/FiltersToolbar';

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
      <FiltersToolbar
        sortControl={
          <label>
            <span className={styles.visuallyHidden}>Сортировка вариантов</span>
            <SortSelect
              aria-label="Сортировка вариантов"
              onChange={(event) => onSortChange(event.target.value as SortOption)}
              value={sort}
            >
              <option value="recommended">Сначала лучшие</option>
              <option value="price">Сначала дешевле</option>
              <option value="rating">По рейтингу</option>
            </SortSelect>
          </label>
        }
      >
        <FilterButton variant="primary">
          <Icon
            aria-hidden="true"
            className={styles.filterButtonIcon}
            icon="mage:filter-fill"
          />
          Фильтры
        </FilterButton>
        {filters.map((filter) => (
          <FilterButton key={filter}>
            {filter}
            <Icon
              aria-hidden="true"
              className={styles.filterButtonIcon}
              icon="iconamoon:arrow-down-2"
            />
          </FilterButton>
        ))}
      </FiltersToolbar>
    </div>
  );
}
